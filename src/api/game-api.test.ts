import { describe, expect, it, vi } from 'vitest';
import { getGame, getGames, toggleFavorite } from './game-api';

vi.mock('./api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

import { get, post } from './api';

describe('game-api', () => {
  it('gets games without parameters', async () => {
    vi.mocked(get).mockResolvedValue([]);

    await expect(getGames()).resolves.toEqual([]);

    expect(get).toHaveBeenCalledWith('/games');
  });

  it('gets games with all parameters', async () => {
    vi.mocked(get).mockResolvedValue([]);

    await getGames({
      featured: true,
      page: 2,
      limit: 10,
      category: 'action',
      sort: 'rating-asc',
    });

    expect(get).toHaveBeenCalledWith(
      '/games?featured=true&page=2&limit=10&category=action&sort=rating-asc',
    );
  });

  it('gets a game without parameters', async () => {
    const game = { id: '1' };

    vi.mocked(get).mockResolvedValue(game);

    await expect(getGame('test-game')).resolves.toEqual(game);

    expect(get).toHaveBeenCalledWith('/games/test-game');
  });

  it('gets a game with user email', async () => {
    vi.mocked(get).mockResolvedValue({ id: '1' });

    await getGame('test-game', {
      userEmail: 'user@example.com',
    });

    expect(get).toHaveBeenCalledWith(
      '/games/test-game?userEmail=user%40example.com',
    );
  });

  it('toggles favorite', async () => {
    const body = {
      userEmail: 'user@example.com',
    };

    vi.mocked(post).mockResolvedValue({ favorite: true });

    await expect(toggleFavorite('test-game', body)).resolves.toEqual({
      favorite: true,
    });

    expect(post).toHaveBeenCalledWith('/games/test-game/favorite', body);
  });
});
