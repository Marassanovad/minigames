import './game-dialog.scss';
import likeIcon from '../../assets/icons/like.svg?raw';
import starIcon from '../../assets/icons/star.svg?raw';
import type {
  GameDetails,
  GameDetailsRecord,
  GameDetailsSpecs,
} from '../../types/game.ts';
import type { Comment } from '../../types/comments.ts';
import { getGameImage } from '../../data/game-images.ts';
import { createCloseButton } from '../close-button/close-button.ts';
import { createPlayOrDetailsButton } from '../play-or-details-button/play-or-details-button.ts';
import { createFavoriteButton } from '../favorite-button/favorite-button.ts';
import { formatNumber } from '../../utils/format-number.ts';
import { formatCompactNumber } from '../../utils/compact-number.ts';
import { getTimeAgo } from '../../utils/time-ago.ts';
import { getMedal } from '../../utils/get-medal.ts';
import { createCommentLikeButton } from '../comment-like-button/comment-like-button.ts';
import { getComments } from '../../api/comments-api.ts';
import { getGame, toggleFavorite } from '../../api/game-api.ts';
import { createSendButton } from '../send-button/send-button.ts';
import { createCommentInput } from '../comment-input/comment-input.ts';
import { auth } from '../../firebase';
import { createSnackbar } from '../snackbar/snackbar.ts';

interface GameDialogOptions {
  gameSlug: string;
  onLogin: () => void;
  onClose?: () => void;
}

export function createGameDialog({
  gameSlug,
  onLogin,
  onClose,
}: GameDialogOptions): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'game-dialog';

  const content = document.createElement('div');
  content.className = 'game-dialog__content';
  dialog.append(content);
  dialog.addEventListener('close', () => {
    onClose?.();
  });

  void loadGameDetails();

  return dialog;

  async function loadGameDetails(): Promise<void> {
    showLoading();
    try {
      const userEmail = auth.currentUser?.email;

      const response = await getGame(gameSlug, {
        userEmail: userEmail ?? undefined,
      });

      renderGame(response.data);
      void loadComments();
    } catch {
      showError();
    }
  }

  async function loadComments(): Promise<void> {
    const commentsContainer = content.querySelector(
      '.game-dialog__comments-content',
    );
    if (!(commentsContainer instanceof HTMLElement)) {
      return;
    }
    showCommentsLoading(commentsContainer);
    try {
      const userEmail = auth.currentUser?.email;

      const response = await getComments(gameSlug, {
        limit: 3,
        sort: 'newest',
        userEmail: userEmail ?? undefined,
      });

      const title = content.querySelector('.game-dialog__comments-title');
      if (title instanceof HTMLElement) {
        title.textContent = `Comments (${response.meta.totalComments})`;
      }
      renderComments(commentsContainer, response.data);
    } catch {
      showCommentsError(commentsContainer);
    }
  }

  function renderGame(game: GameDetails): void {
    content.replaceChildren();
    const closeButton = createCloseButton(() => {
      dialog.close();
    });
    const image = document.createElement('img');
    image.className = 'game-dialog__hero';
    image.src = getGameImage(game.heroImage);
    image.alt = game.name;

    const body = document.createElement('div');
    body.className = 'game-dialog__body';

    const titleContent = document.createElement('div');
    titleContent.className = 'game-dialog__title_content';

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
    likes.insertAdjacentText('beforeend', formatCompactNumber(game.likesCount));

    stats.append(rating, likes);

    const description = document.createElement('p');
    description.className = 'game-dialog__description';
    description.textContent = game.fullDescription;

    const actionButtons = document.createElement('div');
    actionButtons.className = 'game-dialog__action-buttons';

    const isFree = game.specs.price === 'Free';
    const playButton = createPlayOrDetailsButton({
      variant: isFree ? 'play' : 'purchase',
      price: game.specs.price,
      onClick: () => {
        // play / purchase action
      },
    });

    let isFavoriteRequestPending = false;

    const favoriteButton = createFavoriteButton({
      isFavorite: game.isLikedByCurrentUser,
      onClick: async () => {
        if (isFavoriteRequestPending) {
          return;
        }

        const user = auth.currentUser;

        if (!user?.email) {
          createSnackbar('Please log in to add games to favorites.', dialog);
          onLogin();
          return;
        }

        isFavoriteRequestPending = true;
        favoriteButton.setLoading(true);

        try {
          const response = await toggleFavorite(game.slug, {
            userEmail: user.email,
          });

          favoriteButton.setFavorite(response.data.isFavorited);

          likes.replaceChildren();
          likes.innerHTML = likeIcon;
          likes.insertAdjacentText(
            'beforeend',
            formatCompactNumber(response.data.likesCount),
          );
        } catch (error) {
          console.error('Failed to toggle favorite:', error);
          createSnackbar(
            'Failed to update favorites. Please try again.',
            dialog,
          );
        } finally {
          isFavoriteRequestPending = false;
          favoriteButton.setLoading(false);
        }
      },
    });

    favoriteButton.classList.add('game-dialog__favorite-button');

    actionButtons.append(playButton, favoriteButton);

    const specs = createSpecs(game.specs);
    const records = createTopRecords(game.topRecords);
    const comments = createCommentsSection();

    titleContent.append(title, stats);
    body.append(
      titleContent,
      description,
      specs,
      actionButtons,
      records,
      comments,
    );
    content.append(closeButton, image, body);
  }

  function showCommentsError(container: HTMLElement): void {
    container.replaceChildren();
    const error = document.createElement('div');
    error.className = 'game-dialog__comments-error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load comments.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
      void loadComments();
    });
    error.append(message, retryButton);
    container.append(error);
  }

  function showLoading(): void {
    content.replaceChildren();
    const loading = document.createElement('div');
    loading.className = 'game-dialog__loading';
    loading.textContent = 'Loading...';
    content.append(loading);
  }

  function showError(): void {
    content.replaceChildren();
    const error = document.createElement('div');
    error.className = 'game-dialog__error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load game details.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
      void loadGameDetails();
    });
    error.append(message, retryButton);
    content.append(error);
  }
}

function renderComments(container: HTMLElement, comments: Comment[]): void {
  container.replaceChildren();

  if (comments.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'game-dialog__comments-empty';
    empty.textContent = 'No comments yet.';

    container.append(empty);

    return;
  }

  const list = document.createElement('div');
  list.className = 'game-dialog__comments-list';

  for (const comment of comments) {
    const item = createComment(comment);

    list.append(item);
  }

  container.append(list);
}

function createCommentsSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-dialog__comments';

  const title = document.createElement('h3');
  title.className = 'game-dialog__comments-title';
  title.textContent = 'Comments';

  const send = document.createElement('div');
  send.className = 'game-dialog__comments-send';

  const user = document.createElement('div');
  user.className = 'game-dialog__comments-user';
  user.textContent = 'U';

  const commentInput = createCommentInput('Write a comment...');
  const sendButton = createSendButton(() => {
    // Comment sending will be implemented later
  });
  send.append(user, commentInput, sendButton);

  const commentsContent = document.createElement('div');
  commentsContent.className = 'game-dialog__comments-content';

  section.append(title, send, commentsContent);
  return section;
}

function showCommentsLoading(container: HTMLElement): void {
  container.replaceChildren();

  const loading = document.createElement('div');
  loading.className = 'game-dialog__comments-loading';
  loading.textContent = 'Loading comments...';

  container.append(loading);
}

function createComment(comment: Comment): HTMLElement {
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
  date.textContent = getTimeAgo(comment.createdAt);

  header.append(author, date);

  const text = document.createElement('p');
  text.className = 'game-dialog__comment-text';
  text.textContent = comment.text;

  const likes = createCommentLikeButton(
    comment.likesCount,
    comment.isLikedByCurrentUser,
    () => {
      // Like action will be implemented in Story 4
    },
  );
  item.append(header, text, likes);
  return item;
}

function createSpecs(specs: GameDetailsSpecs): HTMLElement {
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

function createTopRecords(records: GameDetailsRecord[]): HTMLElement {
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
    score.textContent = formatNumber(record.score);

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
