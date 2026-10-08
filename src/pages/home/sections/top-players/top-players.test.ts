import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTopPlayers } from './top-players';

const getLeaderboardMock = vi.hoisted(() => vi.fn());
const createUserAvatarMock = vi.hoisted(() => vi.fn());

vi.mock('../../../../api/catalog-api.ts', () => ({
  getLeaderboard: getLeaderboardMock,
}));

vi.mock('../../../../utils/create-avatar.ts', () => ({
  createUserAvatar: createUserAvatarMock,
}));

vi.mock('../../../../utils/compact-number.ts', () => ({
  formatCompactNumber: vi.fn(String),
}));

vi.mock('../../../../utils/format-number.ts', () => ({
  formatNumber: vi.fn(String),
}));

describe('createTopPlayers', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    createUserAvatarMock.mockImplementation((name: string) => {
      const avatar = document.createElement('div');
      avatar.textContent = name.charAt(0);
      return avatar;
    });
  });

  it('creates section with loading skeletons', () => {
    getLeaderboardMock.mockImplementation(() => new Promise(() => {}));

    const section = createTopPlayers();

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('top-players');
    expect(
      section.querySelector(':scope .top-players__title h2')?.textContent,
    ).toBe('Top Players');
    expect(section.querySelectorAll('.top-players__skeleton-row')).toHaveLength(
      5,
    );
  });

  it('renders leaderboard', async () => {
    getLeaderboardMock.mockResolvedValue({
      data: [
        {
          rank: 1,
          playerName: 'Dasha',
          gamesPlayed: 25,
          totalScore: 123_456,
          streakDays: 7,
          favoriteGameName: 'Tukoni',
        },
      ],
    });

    const section = createTopPlayers();

    await vi.waitFor(() => {
      expect(section.querySelector('.top-players__table')).not.toBeNull();
    });

    expect(getLeaderboardMock).toHaveBeenCalledOnce();

    const headers = section.querySelectorAll(':scope thead th');

    expect(headers).toHaveLength(6);
    expect(headers[0].textContent).toBe('Rank');
    expect(headers[1].textContent).toBe('Player');
    expect(headers[2].textContent).toBe('Games Played');
    expect(headers[3].textContent).toBe('Score');
    expect(headers[4].textContent).toBe('Streak');
    expect(headers[5].textContent).toBe('Favorite Game');

    const row = section.querySelector(':scope tbody tr');

    expect(row).not.toBeNull();
    expect(row?.querySelector('td')?.textContent).toBe('#1');
    expect(
      row?.querySelector(':scope .top-players__player-name')?.textContent,
    ).toBe('Dasha');
    expect(row?.querySelectorAll('td')[2].textContent).toBe('25');
    expect(row?.querySelector(':scope .top-players__score')?.textContent).toBe(
      '123456',
    );
    expect(
      row?.querySelector(':scope .top-players__score-mobile')?.textContent,
    ).toBe('123456');
    expect(row?.querySelectorAll('td')[4].textContent).toBe('🔥 7d');
    expect(row?.querySelector('.top-players__favorite')?.textContent).toBe(
      'Tukoni',
    );

    expect(createUserAvatarMock).toHaveBeenCalledWith('Dasha');
  });

  it('renders multiple players', async () => {
    getLeaderboardMock.mockResolvedValue({
      data: [
        {
          rank: 1,
          playerName: 'Dasha',
          gamesPlayed: 25,
          totalScore: 123_456,
          streakDays: 7,
          favoriteGameName: 'Tukoni',
        },
        {
          rank: 2,
          playerName: 'Alex',
          gamesPlayed: 18,
          totalScore: 98_765,
          streakDays: 3,
          favoriteGameName: '2048',
        },
      ],
    });

    const section = createTopPlayers();

    await vi.waitFor(() => {
      expect(section.querySelectorAll(':scope tbody tr')).toHaveLength(2);
    });

    expect(
      section.querySelectorAll('.top-players__player-name')[1].textContent,
    ).toBe('Alex');
    expect(
      section.querySelectorAll('.top-players__favorite')[1].textContent,
    ).toBe('2048');
  });

  it('renders empty state', async () => {
    getLeaderboardMock.mockResolvedValue({
      data: [],
    });

    const section = createTopPlayers();

    await vi.waitFor(() => {
      expect(section.querySelector('.top-players__empty')?.textContent).toBe(
        'No players found.',
      );
    });

    expect(section.querySelector('.top-players__table')).toBeNull();
  });

  it('renders error state', async () => {
    getLeaderboardMock.mockRejectedValue(new Error('Failed'));

    const section = createTopPlayers();

    await vi.waitFor(() => {
      expect(
        section.querySelector('.top-players__error')?.textContent,
      ).toContain('Failed to load leaderboard.');
    });

    expect(
      section.querySelector(':scope .top-players__error button')?.textContent,
    ).toBe('Retry');
  });

  it('retries loading leaderboard', async () => {
    getLeaderboardMock
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce({
        data: [
          {
            rank: 1,
            playerName: 'Dasha',
            gamesPlayed: 25,
            totalScore: 123_456,
            streakDays: 7,
            favoriteGameName: 'Tukoni',
          },
        ],
      });

    const section = createTopPlayers();

    await vi.waitFor(() => {
      expect(section.querySelector('.top-players__error')).not.toBeNull();
    });

    const retryButton = section.querySelector(
      ':scope .top-players__error button',
    );

    if (!(retryButton instanceof HTMLButtonElement)) {
      throw new TypeError('Retry button was not created');
    }

    retryButton.click();

    await vi.waitFor(() => {
      expect(section.querySelector('.top-players__table')).not.toBeNull();
    });

    expect(getLeaderboardMock).toHaveBeenCalledTimes(2);
  });
});
