import { describe, expect, it, vi } from 'vitest';
import { createGameCard } from './game-card';

const formatCompactNumberMock = vi.hoisted(() => vi.fn());

vi.mock('../../data/game-images.ts', () => ({
  getGameImage: vi.fn((image: string) => image),
}));

vi.mock('../../assets/icons/star.svg?raw', () => ({
  default: '<svg></svg>',
}));

vi.mock('../../assets/icons/like.svg?raw', () => ({
  default: '<svg></svg>',
}));

vi.mock('../../utils/compact-number.ts', () => ({
  formatCompactNumber: formatCompactNumberMock,
}));

function createGame(likesCount: number) {
  return {
    slug: 'tukoni',
    name: 'Tukoni',
    cardImage: 'tukoni.jpg',
    heroImage: 'tukoni-hero.jpg',
    category: 'Puzzle',
    price: 'Free',
    shortDescription: 'A relaxing puzzle adventure.',
    fullDescription: 'A relaxing puzzle adventure game.',
    rating: 4.8,
    likesCount,
    isLikedByCurrentUser: false,
    featured: false,
    specs: {
      price: 'Free',
      genre: 'Puzzle',
      players: '1',
      duration: '10 min',
    },
    topRecords: [],
  };
}

describe('createGameCard', () => {
  it('creates card with selected position', () => {
    const card = createGameCard({
      game: createGame(100),
      position: 'selected',
    });

    expect(card.tagName).toBe('ARTICLE');
    expect(card.className).toBe('game-card game-card--selected');
  });

  it('renders game information', () => {
    formatCompactNumberMock.mockReturnValue('100');

    const card = createGameCard({
      game: createGame(100),
      position: 'near',
    });

    const image = card.querySelector<HTMLImageElement>(
      ':scope .game-card__image',
    );

    expect(image?.alt).toBe('Tukoni');
    expect(image?.src).toContain('tukoni.jpg');
    expect(card.querySelector(':scope .game-card__name')?.textContent).toBe(
      'Tukoni',
    );
    expect(
      card.querySelector(':scope .game-card__rating')?.textContent,
    ).toContain('4.8');
  });

  it('renders formatted likes', () => {
    formatCompactNumberMock.mockReturnValue('1.3K');

    const card = createGameCard({
      game: createGame(1250),
      position: 'far',
    });

    expect(
      card.querySelector(':scope .game-card__likes')?.textContent,
    ).toContain('1.3K');

    expect(formatCompactNumberMock).toHaveBeenCalledWith(1250);
  });

  it('handles card click', () => {
    const onClick = vi.fn();

    const card = createGameCard({
      game: createGame(100),
      position: 'near',
      onClick,
    });

    card.click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not add click handler without onClick', () => {
    const card = createGameCard({
      game: createGame(100),
      position: 'far',
    });

    const event = new MouseEvent('click');

    card.dispatchEvent(event);

    expect(card.className).toBe('game-card game-card--far');
  });
});
