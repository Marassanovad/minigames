import { describe, expect, it, vi } from 'vitest';
import { createGameCard } from './game-library-card';

const createPlayOrDetailsButtonMock = vi.hoisted(() => vi.fn());
const formatCompactNumberMock = vi.hoisted(() => vi.fn());

vi.mock(
  '../../../../../components/play-or-details-button/play-or-details-button',
  () => ({
    createPlayOrDetailsButton: createPlayOrDetailsButtonMock,
  }),
);

vi.mock('../../../../../utils/compact-number.ts', () => ({
  formatCompactNumber: formatCompactNumberMock,
}));

vi.mock('../../../../../data/game-images', () => ({
  getGameImage: vi.fn((image: string) => image),
}));

function createGame(price = 'Free') {
  return {
    slug: 'tukoni',
    name: 'Tukoni',
    cardImage: 'tukoni.jpg',
    heroImage: 'tukoni-hero.jpg',
    category: 'Puzzle',
    price,
    shortDescription: 'A relaxing puzzle adventure.',
    fullDescription: 'A relaxing puzzle adventure game.',
    rating: 4.8,
    likesCount: 1250,
    isLikedByCurrentUser: false,
    featured: false,
    specs: {
      price,
      genre: 'Puzzle',
      players: '1',
      duration: '10 min',
    },
    topRecords: [],
  };
}

describe('createGameCard', () => {
  it('creates game card with game information', () => {
    formatCompactNumberMock.mockReturnValue('1.2K');
    createPlayOrDetailsButtonMock.mockImplementation(({ onClick }) => {
      const button = document.createElement('button');
      button.textContent = 'View Details';
      button.addEventListener('click', onClick);
      return button;
    });

    const card = createGameCard({
      game: createGame(),
    });

    expect(card.tagName).toBe('ARTICLE');
    expect(card.className).toBe('library_game-card');

    const image = card.querySelector<HTMLImageElement>(
      ':scope .library_game-card__image',
    );

    expect(image?.alt).toBe('Tukoni');
    expect(image?.src).toContain('tukoni.jpg');

    expect(card.querySelector('.library_game-card__name')?.textContent).toBe(
      'Tukoni',
    );
    expect(card.querySelector('.library_game-card__genre')?.textContent).toBe(
      'Puzzle',
    );
    expect(
      card.querySelector('.library_game-card__description')?.textContent,
    ).toBe('A relaxing puzzle adventure.');
  });

  it('renders rating and formatted likes', () => {
    formatCompactNumberMock.mockReturnValue('1.2K');

    const card = createGameCard({
      game: createGame(),
    });

    expect(
      card.querySelector('.library_game-card__rating')?.textContent,
    ).toContain('4.8');
    expect(
      card.querySelector('.library_game-card__likes')?.textContent,
    ).toContain('1.2K');

    expect(formatCompactNumberMock).toHaveBeenCalledWith(1250);
  });

  it('adds free class for free game', () => {
    const card = createGameCard({
      game: createGame(),
    });

    expect(
      card
        .querySelector('.library_game-card__price--title')
        ?.classList.contains('free'),
    ).toBe(true);

    expect(
      card
        .querySelector('.library_game-card__price--stats')
        ?.classList.contains('free'),
    ).toBe(true);
  });

  it('does not add free class for paid game', () => {
    const card = createGameCard({
      game: createGame('$4.99'),
    });

    expect(
      card
        .querySelector('.library_game-card__price--title')
        ?.classList.contains('free'),
    ).toBe(false);

    expect(
      card
        .querySelector('.library_game-card__price--stats')
        ?.classList.contains('free'),
    ).toBe(false);
  });

  it('calls onDetail when details button is clicked', () => {
    const onDetail = vi.fn();

    createPlayOrDetailsButtonMock.mockImplementation(({ onClick }) => {
      const button = document.createElement('button');
      button.addEventListener('click', onClick);
      return button;
    });

    createGameCard({
      game: createGame(),
      onDetail,
    });

    const options = createPlayOrDetailsButtonMock.mock.calls[0]?.[0];

    if (!options) {
      throw new TypeError('Button options were not provided');
    }

    options.onClick();

    expect(onDetail).toHaveBeenCalledOnce();
  });
});
