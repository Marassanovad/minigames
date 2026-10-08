import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNewGames } from './new-games';

const getGamesMock = vi.hoisted(() => vi.fn());
const createGameCardMock = vi.hoisted(() => vi.fn());
const createPaginationControlMock = vi.hoisted(() => vi.fn());

vi.mock('../../../../api/game-api', () => ({
  getGames: getGamesMock,
}));

vi.mock('../../../../components/game-card/game-card', () => ({
  createGameCard: createGameCardMock,
}));

vi.mock('../../../../components/pagination-control/pagination-control', () => ({
  createPaginationControl: createPaginationControlMock,
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
    featured: false,
    specs: {
      price: 'Free',
      genre: 'Action',
      players: '1',
      duration: '10 min',
    },
    topRecords: [],
  };
}

describe('createNewGames', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createGameCardMock.mockImplementation(({ game, position, onClick }) => {
      const card = document.createElement('button');

      card.dataset.game = game.slug;
      card.dataset.position = position;
      card.addEventListener('click', onClick);

      return card;
    });

    createPaginationControlMock.mockImplementation(
      ({ currentPage, totalPages, onPageChange }) => {
        const pagination = document.createElement('div');

        pagination.dataset.currentPage = String(currentPage);
        pagination.dataset.totalPages = String(totalPages);

        const next = document.createElement('button');
        next.textContent = 'Next';
        next.addEventListener('click', () => {
          onPageChange(currentPage + 1);
        });

        pagination.append(next);

        return pagination;
      },
    );
  });

  it('creates section with loading skeletons', () => {
    getGamesMock.mockImplementation(() => new Promise(() => {}));

    const section = createNewGames();

    expect(section.className).toBe('new-games');
    expect(section.querySelectorAll('.new-games__skeleton')).toHaveLength(5);
  });

  it('renders featured games after loading', async () => {
    const games = [
      createGame('one'),
      createGame('two'),
      createGame('three'),
      createGame('four'),
      createGame('five'),
    ];

    getGamesMock.mockResolvedValue({
      data: games,
    });

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelectorAll('button[data-game]')).toHaveLength(5);
    });

    expect(getGamesMock).toHaveBeenCalledWith({
      featured: true,
    });

    expect(createPaginationControlMock).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 1,
        totalPages: 5,
        hidePages: true,
        isLoop: true,
      }),
    );
  });

  it('renders empty state when there are no featured games', async () => {
    getGamesMock.mockResolvedValue({
      data: [],
    });

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelector('.new-games__empty')?.textContent).toBe(
        'No featured games found.',
      );
    });

    expect(section.querySelectorAll('.new-games__skeleton')).toHaveLength(0);
  });

  it('renders error state when loading fails', async () => {
    getGamesMock.mockRejectedValue(new Error('Failed'));

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelector('.new-games__error')?.textContent).toContain(
        'Failed to load games. Please try again.',
      );
    });

    expect(
      section.querySelector(':scope .new-games__error button')?.textContent,
    ).toBe('Retry');
  });

  it('retries loading games', async () => {
    getGamesMock
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce({
        data: [createGame('one')],
      });

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelector('.new-games__error')).not.toBeNull();
    });

    const retryButton = section.querySelector(
      ':scope .new-games__error button',
    ) as HTMLButtonElement;

    retryButton.click();

    await vi.waitFor(() => {
      expect(section.querySelectorAll('button[data-game]')).toHaveLength(5);
    });

    expect(getGamesMock).toHaveBeenCalledTimes(2);
  });

  it('changes page through pagination', async () => {
    const games = [
      createGame('one'),
      createGame('two'),
      createGame('three'),
      createGame('four'),
      createGame('five'),
      createGame('six'),
    ];

    getGamesMock.mockResolvedValue({
      data: games,
    });

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelectorAll('button[data-game]')).toHaveLength(5);
    });

    const nextButton = section.querySelector(
      ':scope .new-games__header button',
    );

    if (!(nextButton instanceof HTMLButtonElement)) {
      throw new TypeError('Pagination button was not created');
    }

    nextButton.click();

    expect(section.querySelector(':scope [data-game="four"]')).not.toBeNull();
  });

  it('changes selected game when a card is clicked', async () => {
    const games = [
      createGame('one'),
      createGame('two'),
      createGame('three'),
      createGame('four'),
      createGame('five'),
      createGame('six'),
    ];

    getGamesMock.mockResolvedValue({
      data: games,
    });

    const section = createNewGames();

    await vi.waitFor(() => {
      expect(section.querySelectorAll('button[data-game]')).toHaveLength(5);
    });

    const selectedCard = section.querySelector(':scope [data-position="near"]');

    if (!(selectedCard instanceof HTMLButtonElement)) {
      throw new TypeError('Selected card was not created');
    }

    selectedCard.click();

    expect(section.querySelector('[data-game="four"]')).not.toBeNull();
  });
});
