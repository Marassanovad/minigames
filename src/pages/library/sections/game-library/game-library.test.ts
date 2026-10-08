import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGameLibrary } from './game-library';

const getGamesMock = vi.hoisted(() => vi.fn());
const createGameCardMock = vi.hoisted(() => vi.fn());
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('../../../../api/game-api', () => ({
  getGames: getGamesMock,
}));

vi.mock('./game-card/game-library-card.ts', () => ({
  createGameCard: createGameCardMock,
}));

vi.mock('../../../../app/router.ts', () => ({
  navigate: navigateMock,
}));

function createGame(id: string) {
  return {
    slug: id,
    name: `Game ${id}`,
    heroImage: `${id}.jpg`,
    rating: 4.5,
    likesCount: 100,
    fullDescription: `Description ${id}`,
    isLikedByCurrentUser: false,
    featured: true,
    specs: {
      price: 'Free',
      genre: 'Action',
      players: '1',
      duration: '10 min',
    },
    topRecords: [],
  };
}

describe('createGameLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createGameCardMock.mockImplementation(({ game, onDetail }) => {
      const card = document.createElement('button');
      card.dataset.game = game.slug;
      card.addEventListener('click', onDetail);
      return card;
    });
  });

  it('creates section with loading skeletons', () => {
    getGamesMock.mockImplementation(() => new Promise(() => {}));

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
    });

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('game-library');
    expect(section.querySelectorAll('.game-library__skeleton')).toHaveLength(6);
  });

  it('loads games with default parameters', async () => {
    getGamesMock.mockResolvedValue({
      data: [createGame('one')],
      meta: {
        totalPages: 3,
      },
    });

    const onTotalPagesChange = vi.fn();

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
      onTotalPagesChange,
    });

    await vi.waitFor(() => {
      expect(section.querySelector('[data-game="one"]')).not.toBeNull();
    });

    expect(getGamesMock).toHaveBeenCalledWith({
      page: 1,
      limit: 6,
      category: undefined,
      sort: 'rating-desc',
    });

    expect(onTotalPagesChange).toHaveBeenCalledWith(3);
  });

  it('loads games with filter, sort and pagination', async () => {
    getGamesMock.mockResolvedValue({
      data: [createGame('one')],
      meta: {
        totalPages: 5,
      },
    });

    const section = createGameLibrary({
      filter: 'action',
      sort: 'rating-asc',
      page: 2,
      itemsPerPage: 4,
    });

    await vi.waitFor(() => {
      expect(section.querySelector('[data-game="one"]')).not.toBeNull();
    });

    expect(getGamesMock).toHaveBeenCalledWith({
      page: 2,
      limit: 4,
      category: 'action',
      sort: 'rating-asc',
    });
  });

  it('renders multiple games', async () => {
    getGamesMock.mockResolvedValue({
      data: [createGame('one'), createGame('two')],
      meta: {
        totalPages: 1,
      },
    });

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
    });

    await vi.waitFor(() => {
      expect(section.querySelectorAll('[data-game]')).toHaveLength(2);
    });

    expect(section.querySelector(':scope [data-game="one"]')).not.toBeNull();
    expect(section.querySelector(':scope [data-game="two"]')).not.toBeNull();
  });

  it('renders empty state', async () => {
    getGamesMock.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 0,
      },
    });

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
    });

    await vi.waitFor(() => {
      expect(section.querySelector('.game-library__empty')?.textContent).toBe(
        'No games found.',
      );
    });

    expect(section.querySelectorAll('.game-library__skeleton')).toHaveLength(0);
  });

  it('renders error state', async () => {
    getGamesMock.mockRejectedValue(new TypeError('Failed'));

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
    });

    await vi.waitFor(() => {
      expect(
        section.querySelector('.game-library__error')?.textContent,
      ).toContain('Failed to load games.');
    });

    expect(
      section.querySelector(':scope .game-library__error button')?.textContent,
    ).toBe('Retry');
  });

  it('retries loading games', async () => {
    getGamesMock
      .mockRejectedValueOnce(new TypeError('Failed'))
      .mockResolvedValueOnce({
        data: [createGame('one')],
        meta: {
          totalPages: 1,
        },
      });

    const section = createGameLibrary({
      filter: 'all',
      sort: 'rating-desc',
    });

    await vi.waitFor(() => {
      expect(section.querySelector('.game-library__error')).not.toBeNull();
    });

    const retryButton = section.querySelector(
      ':scope .game-library__error button',
    );

    if (!(retryButton instanceof HTMLButtonElement)) {
      throw new TypeError('Retry button was not created');
    }

    retryButton.click();

    await vi.waitFor(() => {
      expect(section.querySelector('[data-game="one"]')).not.toBeNull();
    });

    expect(getGamesMock).toHaveBeenCalledTimes(2);
  });

  it('navigates to game details', async () => {
    getGamesMock.mockResolvedValue({
      data: [createGame('tukoni')],
      meta: {
        totalPages: 1,
      },
    });

    const section = createGameLibrary({
      filter: 'action',
      sort: 'rating-asc',
      page: 2,
    });

    await vi.waitFor(() => {
      expect(section.querySelector('[data-game="tukoni"]')).not.toBeNull();
    });

    const card = section.querySelector(':scope [data-game="tukoni"]');

    if (!(card instanceof HTMLButtonElement)) {
      throw new TypeError('Game card was not created');
    }

    card.click();

    expect(navigateMock).toHaveBeenCalledWith({
      path: '/library',
      category: 'action',
      sort: 'rating-asc',
      page: 2,
      game: 'tukoni',
    });
  });
});
