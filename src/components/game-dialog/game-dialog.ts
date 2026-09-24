import './game-dialog.scss';

import likeIcon from '../../assets/icons/like.svg?raw';
import starIcon from '../../assets/icons/star.svg?raw';
import { getGameImage } from '../../data/game-images.ts';
import { createCloseButton } from '../close-button/close-button.ts';
import { createPlayOrDetailsButton } from '../play-or-details-button/play-or-details-button.ts';
import {
  createFavoriteButton,
  type FavoriteButtonElement,
} from '../favorite-button/favorite-button.ts';
import { createCommentInput } from '../comment-input/comment-input.ts';
import { createSendButton } from '../send-button/send-button.ts';
import { createCommentLikeButton } from '../comment-like-button/comment-like-button.ts';

interface GameDialogRecord {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}

interface GameDialogSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface GameComment {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
}

export interface GameDialogData {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: GameDialogSpecs;
  topRecords: GameDialogRecord[];
  comments: GameComment[];
}

interface GameDialogOptions {
  game: GameDialogData;
  onClose?: () => void;
}

export function createGameDialog({
  game,
  onClose,
}: GameDialogOptions): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'game-dialog';

  const content = document.createElement('div');
  content.className = 'game-dialog__content';

  const closeButton = createCloseButton(() => {
    dialog.close();
    onClose?.();
  });
  const image = document.createElement('img');
  image.className = 'game-dialog__hero';
  image.src = getGameImage(game.heroImage);
  image.alt = game.name;

  const body = document.createElement('div');
  body.className = 'game-dialog__body';

  const title_content = document.createElement('div');
  title_content.className = 'game-dialog__title_content';

  const title = document.createElement('h2');
  title.className = 'game-dialog__title';
  title.textContent = game.name;

  const stats = document.createElement('div');
  stats.className = 'game-dialog__stats';

  const rating = document.createElement('span');
  rating.className = 'library_game-card__rating';
  rating.innerHTML = starIcon;
  rating.insertAdjacentText('beforeend', `${game.rating}`);

  const likes = document.createElement('span');
  likes.className = 'library_game-card__likes';
  likes.innerHTML = likeIcon;
  likes.insertAdjacentText('beforeend', formatLikes(game.likesCount));

  stats.append(rating, likes);

  const description = document.createElement('p');
  description.className = 'game-dialog__description';
  description.textContent = game.fullDescription;

  const actionButtons = document.createElement('div');
  actionButtons.className = 'game-dialog__action-buttons';

  const playButton = createPlayOrDetailsButton({
    variant: 'play',
    onClick: () => {
      // play action
    },
  });

  let isFavorite = game.isLikedByCurrentUser;

  const favoriteButtons: FavoriteButtonElement[] = [];

  const toggleFavorite = (): void => {
    isFavorite = !isFavorite;

    for (const button of favoriteButtons) {
      button.setFavorite(isFavorite);
    }
  };

  const favoriteButton = createFavoriteButton({
    variant: 'text',
    isFavorite,
    onClick: toggleFavorite,
  });

  favoriteButton.classList.add('game-dialog__favorite-button', 'desktop-only');

  const favoriteButton2 = createFavoriteButton({
    variant: 'icon',
    isFavorite,
    onClick: toggleFavorite,
  });

  favoriteButton2.classList.add('game-dialog__favorite-button', 'mobile-only');

  favoriteButtons.push(favoriteButton, favoriteButton2);

  actionButtons.append(playButton, favoriteButton, favoriteButton2);

  const specs = createSpecs(game.specs);
  const records = createTopRecords(game.topRecords);
  const comments = createComments(game.comments ?? []);

  title_content.append(title, stats);

  body.append(title_content, description, specs, actionButtons, records);

  if (comments) {
    body.append(comments);
  }

  content.append(closeButton, image, body);

  dialog.append(content);

  return dialog;
}

function createSpecs(specs: GameDialogSpecs): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-dialog__specs';

  const items = [
    ['Genre', specs.genre],
    ['Players', specs.players],
    ['Duration', specs.duration],
    ['Price', specs.price],
  ];

  for (const [label, value] of items) {
    const item = document.createElement('div');
    item.className = 'game-dialog__spec';

    const itemLabel = document.createElement('span');
    itemLabel.className = 'game-dialog__spec-label';
    itemLabel.textContent = label;

    const itemValue = document.createElement('span');
    itemValue.className = 'game-dialog__spec-value';
    itemValue.textContent = value;

    item.append(itemLabel, itemValue);
    container.append(item);
  }

  return container;
}

function createTopRecords(records: GameDialogRecord[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-dialog__records';

  const title = document.createElement('h3');
  title.className = 'game-dialog__records-title';
  title.textContent = '🏆 Top Records';

  const list = document.createElement('ol');
  list.className = 'game-dialog__records-list';

  for (const record of records) {
    const item = document.createElement('li');
    item.className = 'game-dialog__record';

    const player = document.createElement('div');
    player.className = 'game-dialog__record-player';

    const medal = document.createElement('span');
    medal.className = 'game-dialog__record-medal';
    medal.textContent = getMedal(record.position);
    medal.setAttribute('aria-hidden', 'true');

    const playerName = document.createElement('span');
    playerName.className = 'game-dialog__record-name';
    playerName.textContent = record.playerName;
    player.append(medal, playerName);

    const result = document.createElement('div');
    result.className = 'game-dialog__record-result';

    const score = document.createElement('span');
    score.className = 'game-dialog__record-score';
    score.textContent = formatScore(record.score);

    const timeAgo = document.createElement('span');
    timeAgo.className = 'game-dialog__record-time';
    timeAgo.textContent = getTimeAgo(record.achievedAt);

    result.append(score, timeAgo);
    item.append(player, result);
    list.append(item);
  }

  section.append(title, list);

  return section;
}

function getMedal(position: number): string {
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
  return medals[position] ?? `${position}.`;
}

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  return 'just now';
}

function createComments(comments: GameComment[]): HTMLElement | undefined {
  if (comments.length === 0) {
    return undefined;
  }

  const section = document.createElement('section');
  section.className = 'game-dialog__comments';

  const title = document.createElement('h3');
  title.className = 'game-dialog__comments-title';
  title.textContent = 'Comments (' + comments.length + ')';

  const send = document.createElement('div');
  send.className = 'game-dialog__comments-send';

  const user = document.createElement('div');
  user.className = 'game-dialog__comments-user';
  user.textContent = 'U';
  const comment_input = createCommentInput('Write a comment...');
  const send_button = createSendButton(() => {});
  send.append(user, comment_input, send_button);

  const list = document.createElement('div');
  list.className = 'game-dialog__comments-list';

  for (const comment of comments) {
    const item = document.createElement('article');
    item.className = 'game-dialog__comment';

    const header = document.createElement('div');
    header.className = 'game-dialog__comment-header';

    const author = document.createElement('div');
    author.className = 'game-dialog__comment-author';

    const avatar = document.createElement('span');
    avatar.className = 'game-dialog__comment-avatar';
    avatar.textContent = comment.authorName.charAt(0).toUpperCase();

    const authorName = document.createElement('span');
    authorName.className = 'game-dialog__comment-name';
    authorName.textContent = comment.authorName;

    author.append(avatar, authorName);

    const date = document.createElement('time');
    date.className = 'game-dialog__comment-date';
    date.dateTime = comment.createdAt;
    date.textContent = formatCommentDate(comment.createdAt);

    header.append(author, date);

    const text = document.createElement('p');
    text.className = 'game-dialog__comment-text';
    text.textContent = comment.text;

    const likes = createCommentLikeButton(comment.likesCount, true, () => {});

    item.append(header, text, likes);
    list.append(item);
  }

  section.append(title, send, list);

  return section;
}

function formatLikes(likesCount: number): string {
  return likesCount >= 1000
    ? `${(likesCount / 1000).toFixed(1)}K`
    : String(likesCount);
}

function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

function formatCommentDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
