import { describe, expect, it, vi } from 'vitest';
import { getCategories, getLeaderboard } from './catalog-api';

vi.mock('./api', () => ({
  get: vi.fn(),
}));

import { get } from './api';

describe('catalog-api', () => {
  it('gets categories', async () => {
    const categories = [{ id: '1', name: 'Action' }];

    vi.mocked(get).mockResolvedValue(categories);

    await expect(getCategories()).resolves.toEqual(categories);

    expect(get).toHaveBeenCalledWith('/categories');
  });

  it('gets leaderboard', async () => {
    const leaderboard = [{ nickname: 'Player', score: 100 }];

    vi.mocked(get).mockResolvedValue(leaderboard);

    await expect(getLeaderboard()).resolves.toEqual(leaderboard);

    expect(get).toHaveBeenCalledWith('/leaderboard');
  });
});
