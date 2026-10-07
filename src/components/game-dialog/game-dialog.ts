import './game-dialog.scss';
import likeIcon from '../../assets/icons/like.svg?raw';
import starIcon from '../../assets/icons/star.svg?raw';
import type { GameDetails } from '../../types/game.ts';
import type { Comment } from '../../types/comments.ts';
import { getGameImage } from '../../data/game-images.ts';
import { createCloseButton } from '../close-button/close-button.ts';
import { createPlayOrDetailsButton } from '../play-or-details-button/play-or-details-button.ts';
import { createFavoriteButton } from '../favorite-button/favorite-button.ts';
import { formatCompactNumber } from '../../utils/compact-number.ts';
import { getTimeAgo } from '../../utils/time-ago.ts';
import { createCommentLikeButton } from '../comment-like-button/comment-like-button.ts';
import {
  getComments,
  postComment,
  toggleCommentLike,
} from '../../api/comments-api.ts';
import { getGame, toggleFavorite } from '../../api/game-api.ts';
import { createSendButton } from '../send-button/send-button.ts';
import { createCommentInput } from '../comment-input/comment-input.ts';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createSnackbar } from '../snackbar/snackbar.ts';
import { createSpecs } from './sections/specs.ts';
import { createTopRecords } from './sections/top-records.ts';

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
      renderComments(commentsContainer, response.data, dialog, onLogin);
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
    const comments = createCommentsSection(dialog, gameSlug, loadComments);

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

function renderComments(
  container: HTMLElement,
  comments: Comment[],
  dialog: HTMLDialogElement,
  onLogin: () => void,
): void {
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
    const item = createComment(comment, dialog, onLogin);

    list.append(item);
  }

  container.append(list);
}

function createCommentsSection(
  dialog: HTMLDialogElement,
  gameSlug: string,
  loadComments: () => Promise<void>,
): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-dialog__comments';

  const title = document.createElement('h3');
  title.className = 'game-dialog__comments-title';
  title.textContent = 'Comments';

  const send = document.createElement('div');
  send.className = 'game-dialog__comments-send';

  const user = document.createElement('div');
  user.className = 'game-dialog__comments-user';

  let isCommentRequestPending = false;

  const handleSubmit = async (): Promise<void> => {
    if (isCommentRequestPending) {
      return;
    }

    const user = auth.currentUser;

    if (!user?.email || !user.displayName) {
      return;
    }

    const text = commentInput.getValue().trim();

    if (!text) {
      createSnackbar('Comment cannot be empty.', dialog);
      return;
    }

    if (text.length > 500) {
      createSnackbar('Comment must be 500 characters or less.', dialog);
      return;
    }

    isCommentRequestPending = true;
    commentInput.setLoading(true);
    sendButton.setLoading(true);

    try {
      await postComment(gameSlug, {
        userEmail: user.email,
        authorName: user.displayName,
        text,
      });

      commentInput.clear();

      await loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
      createSnackbar('Failed to send comment. Please try again.', dialog);
    } finally {
      isCommentRequestPending = false;
      commentInput.setLoading(false);
      sendButton.setLoading(false);
    }
  };

  const commentInput = createCommentInput('Write a comment...', () => {
    void handleSubmit();
  });

  const sendButton = createSendButton(() => {
    void handleSubmit();
  });

  send.append(user, commentInput, sendButton);

  const commentsContent = document.createElement('div');
  commentsContent.className = 'game-dialog__comments-content';

  section.append(title, send, commentsContent);

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser?.email && currentUser.displayName) {
      send.style.display = '';
      user.textContent = currentUser.displayName.trim().charAt(0).toUpperCase();
    } else {
      send.style.display = 'none';
    }
  });

  return section;
}

function showCommentsLoading(container: HTMLElement): void {
  container.replaceChildren();

  const loading = document.createElement('div');
  loading.className = 'game-dialog__comments-loading';
  loading.textContent = 'Loading comments...';

  container.append(loading);
}

function createComment(
  comment: Comment,
  dialog: HTMLDialogElement,
  onLogin: () => void,
): HTMLElement {
  const item = document.createElement('article');
  item.className = 'game-dialog__comment';

  const header = document.createElement('div');
  header.className = 'game-dialog__comment-header';

  const author = document.createElement('div');
  author.className = 'game-dialog__comment-author';

  const avatar = document.createElement('span');
  avatar.className = 'game-dialog__comment-avatar';

  const avatarColor = Math.floor(Math.random() * 5) + 1;
  avatar.classList.add(`avatar-random-${avatarColor}`);

  avatar.textContent = comment.authorName.trim().charAt(0).toUpperCase();

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

  let isLikeRequestPending = false;

  const likes = createCommentLikeButton(
    comment.likesCount,
    comment.isLikedByCurrentUser,
    async () => {
      if (isLikeRequestPending) {
        return;
      }

      const user = auth.currentUser;

      if (!user?.email) {
        createSnackbar('Please log in to like comments.', dialog);
        onLogin();
        return;
      }

      isLikeRequestPending = true;
      likes.disabled = true;
      likes.classList.add('is-loading');

      try {
        const response = await toggleCommentLike(comment.commentId, {
          userEmail: user.email,
        });

        likes.classList.toggle('is-liked', response.data.isLikedByCurrentUser);

        const count = likes.querySelector('span:last-child');

        if (count) {
          count.textContent = String(response.data.likesCount);
        }
      } catch (error) {
        console.error('Failed to toggle comment like:', error);

        createSnackbar(
          'Failed to update comment like. Please try again.',
          dialog,
        );
      } finally {
        isLikeRequestPending = false;
        likes.disabled = false;
        likes.classList.remove('is-loading');
      }
    },
  );
  item.append(header, text, likes);
  return item;
}
