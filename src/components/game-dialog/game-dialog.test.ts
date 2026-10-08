import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGameDialog } from './game-dialog';

const authStateCallback = vi.fn();

vi.mock('../../firebase', () => ({
  auth: {
    currentUser: undefined,
  },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_, callback) => {
    authStateCallback.mockImplementation(callback);
  }),
}));

vi.mock('../../data/game-images.ts', () => ({
  getGameImage: vi.fn(() => 'game.jpg'),
}));

vi.mock('../../api/game-api.ts', () => ({
  getGame: vi.fn(),
  toggleFavorite: vi.fn(),
}));

vi.mock('../../api/comments-api.ts', () => ({
  getComments: vi.fn(),
  postComment: vi.fn(),
  toggleCommentLike: vi.fn(),
}));

vi.mock('../close-button/close-button.ts', () => ({
  createCloseButton: vi.fn((onClick) => {
    const button = document.createElement('button');
    button.textContent = 'close';
    button.addEventListener('click', onClick);
    return button;
  }),
}));

vi.mock('../play-or-details-button/play-or-details-button.ts', () => ({
  createPlayOrDetailsButton: vi.fn(() => {
    const button = document.createElement('button');
    button.textContent = 'play';
    return button;
  }),
}));

vi.mock('../favorite-button/favorite-button.ts', () => ({
  createFavoriteButton: vi.fn(({ isFavorite, onClick }) => {
    const button = document.createElement('button') as HTMLButtonElement & {
      setFavorite: (isLoading: boolean) => void;
      setLoading: (isLoading: boolean) => void;
    };

    button.textContent = isFavorite ? 'favorite' : 'not favorite';
    button.addEventListener('click', () => {
      void onClick();
    });
    button.setFavorite = vi.fn();
    button.setLoading = vi.fn();

    return button;
  }),
}));

vi.mock('../comment-like-button/comment-like-button.ts', () => ({
  createCommentLikeButton: vi.fn((count, isLiked, onClick) => {
    const button = document.createElement('button') as HTMLButtonElement;
    const countElement = document.createElement('span');

    countElement.textContent = String(count);
    button.append(countElement);

    if (isLiked) {
      button.classList.add('is-liked');
    }

    button.addEventListener('click', () => {
      void onClick();
    });

    return button;
  }),
}));

vi.mock('../send-button/send-button.ts', () => ({
  createSendButton: vi.fn((onClick) => {
    const button = document.createElement('button') as HTMLButtonElement & {
      setLoading: (isLoading: boolean) => void;
    };

    button.textContent = 'send';
    button.addEventListener('click', () => {
      void onClick();
    });
    button.setLoading = vi.fn();

    return button;
  }),
}));

vi.mock('../comment-input/comment-input.ts', () => ({
  createCommentInput: vi.fn((_, onSubmit) => {
    const input = document.createElement('input') as HTMLInputElement & {
      getValue: () => string;
      clear: () => void;
      setLoading: (isLoading: boolean) => void;
    };

    input.getValue = () => input.value;
    input.clear = vi.fn(() => {
      input.value = '';
    });
    input.setLoading = vi.fn();

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        onSubmit();
      }
    });

    return input;
  }),
}));

vi.mock('../snackbar/snackbar.ts', () => ({
  createSnackbar: vi.fn(),
}));

vi.mock('./sections/specs.ts', () => ({
  createSpecs: vi.fn(() => document.createElement('div')),
}));

vi.mock('./sections/top-records.ts', () => ({
  createTopRecords: vi.fn(() => document.createElement('div')),
}));

vi.mock('../../utils/compact-number.ts', () => ({
  formatCompactNumber: vi.fn(String),
}));

vi.mock('../../utils/time-ago.ts', () => ({
  getTimeAgo: vi.fn(() => '5 min ago'),
}));

import { getGame, toggleFavorite } from '../../api/game-api.ts';
import { getComments, postComment } from '../../api/comments-api.ts';
import { createSnackbar } from '../snackbar/snackbar.ts';

const game = {
  slug: 'test-game',
  name: 'Test Game',
  heroImage: 'test.jpg',
  rating: 4.5,
  likesCount: 1200,
  fullDescription: 'Test description',
  isLikedByCurrentUser: false,
  specs: {
    price: 'Free',
    genre: 'Action',
    players: '1',
    duration: '10 min',
  },
  topRecords: [],
};

describe('createGameDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getGame).mockResolvedValue({
      data: game,
    });

    vi.mocked(getComments).mockResolvedValue({
      data: [],
      meta: {
        totalComments: 0,
        returnedCount: 0,
        sort: 'newest',
      },
    });
  });

  it('creates dialog and loads game details', async () => {
    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(dialog.querySelector('.game-dialog__title')?.textContent).toBe(
        'Test Game',
      );
    });

    expect(getGame).toHaveBeenCalledWith('test-game', {
      userEmail: undefined,
    });
  });

  it('renders game details', async () => {
    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(dialog.querySelector('.game-dialog__hero')).not.toBeNull();
    });

    expect(dialog.querySelector('.game-dialog__description')?.textContent).toBe(
      'Test description',
    );

    expect(dialog.querySelector('.game-dialog__stats')?.textContent).toContain(
      '4.5',
    );
  });

  it('shows comments empty state', async () => {
    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comments-empty')?.textContent,
      ).toBe('No comments yet.');
    });

    expect(
      dialog.querySelector('.game-dialog__comments-title')?.textContent,
    ).toBe('Comments (0)');
  });

  it('renders comments', async () => {
    vi.mocked(getComments).mockResolvedValue({
      data: [
        {
          commentId: 'comment-1',
          authorName: 'Dasha',
          text: 'Great game!',
          createdAt: '2026-01-01T12:00:00Z',
          likesCount: 5,
          isLikedByCurrentUser: false,
        },
      ],
      meta: {
        totalComments: 1,
        returnedCount: 1,
        sort: 'newest',
      },
    });

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comment-name')?.textContent,
      ).toBe('Dasha');
    });

    expect(
      dialog.querySelector('.game-dialog__comment-text')?.textContent,
    ).toBe('Great game!');
  });

  it('shows game loading state', () => {
    vi.mocked(getGame).mockImplementation(() => new Promise(() => {}));

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    expect(dialog.querySelector('.game-dialog__loading')?.textContent).toBe(
      'Loading...',
    );
  });

  it('shows game error state', async () => {
    vi.mocked(getGame).mockRejectedValue(new Error('Failed'));

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__error')?.textContent,
      ).toContain('Failed to load game details.');
    });
  });

  it('calls onClose when dialog closes', () => {
    const onClose = vi.fn();

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
      onClose,
    });

    dialog.dispatchEvent(new Event('close'));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onLogin when favorite is clicked by guest', async () => {
    const onLogin = vi.fn();

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin,
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__favorite-button'),
      ).not.toBeNull();
    });

    const favoriteButton = dialog.querySelector(
      '.game-dialog__favorite-button',
    ) as HTMLButtonElement;

    favoriteButton.click();

    await vi.waitFor(() => {
      expect(onLogin).toHaveBeenCalledOnce();
    });

    expect(createSnackbar).toHaveBeenCalledWith(
      'Please log in to add games to favorites.',
      dialog,
    );
  });

  it('toggles favorite for authenticated user', async () => {
    const firebaseModule = await import('../../firebase');

    Object.defineProperty(firebaseModule.auth, 'currentUser', {
      value: {
        email: 'dasha@example.com',
        displayName: 'Dasha',
      },
      configurable: true,
    });

    vi.mocked(toggleFavorite).mockResolvedValue({
      data: {
        gameSlug: 'test-game',
        isFavorited: true,
        likesCount: 1201,
      },
    });

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__favorite-button'),
      ).not.toBeNull();
    });

    const favoriteButton = dialog.querySelector(
      '.game-dialog__favorite-button',
    ) as HTMLButtonElement;

    favoriteButton.click();

    await vi.waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith('test-game', {
        userEmail: 'dasha@example.com',
      });
    });
  });

  it('shows comments error', async () => {
    vi.mocked(getComments).mockRejectedValue(new Error('Failed'));

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comments-error'),
      ).not.toBeNull();
    });

    expect(
      dialog.querySelector('.game-dialog__comments-error')?.textContent,
    ).toContain('Failed to load comments.');
  });

  it('shows comments loading state', async () => {
    vi.mocked(getComments).mockImplementation(() => new Promise(() => {}));

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comments-loading')?.textContent,
      ).toBe('Loading comments...');
    });
  });

  it('does not submit empty comment', async () => {
    const firebaseModule = await import('../../firebase');

    Object.defineProperty(firebaseModule.auth, 'currentUser', {
      value: {
        email: 'dasha@example.com',
        displayName: 'Dasha',
      },
      configurable: true,
    });

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    authStateCallback({
      email: 'dasha@example.com',
      displayName: 'Dasha',
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comments-send'),
      ).not.toBeNull();
    });

    const input = dialog.querySelector(
      ':scope .game-dialog__comments-send input',
    ) as HTMLInputElement;

    input.value = ' '.repeat(3);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    await vi.waitFor(() => {
      expect(createSnackbar).toHaveBeenCalledWith(
        'Comment cannot be empty.',
        dialog,
      );
    });

    expect(postComment).not.toHaveBeenCalled();
  });

  it('does not submit comment longer than 500 characters', async () => {
    const firebaseModule = await import('../../firebase');

    Object.defineProperty(firebaseModule.auth, 'currentUser', {
      value: {
        email: 'dasha@example.com',
        displayName: 'Dasha',
      },
      configurable: true,
    });

    const dialog = createGameDialog({
      gameSlug: 'test-game',
      onLogin: vi.fn(),
    });

    authStateCallback({
      email: 'dasha@example.com',
      displayName: 'Dasha',
    });

    await vi.waitFor(() => {
      expect(
        dialog.querySelector('.game-dialog__comments-send'),
      ).not.toBeNull();
    });

    const input = dialog.querySelector(
      ':scope .game-dialog__comments-send input',
    ) as HTMLInputElement;

    input.value = 'a'.repeat(501);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    await vi.waitFor(() => {
      expect(createSnackbar).toHaveBeenCalledWith(
        'Comment must be 500 characters or less.',
        dialog,
      );
    });

    expect(postComment).not.toHaveBeenCalled();
  });
});
