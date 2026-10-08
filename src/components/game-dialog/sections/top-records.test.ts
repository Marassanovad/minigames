import { describe, expect, it, vi } from 'vitest';
import { createTopRecords } from './top-records';

vi.mock('../../../utils/get-medal.ts', () => ({
  getMedal: vi.fn((position: number) => `${position}.`),
}));

vi.mock('../../../utils/format-number.ts', () => ({
  formatNumber: vi.fn(String),
}));

vi.mock('../../../utils/time-ago.ts', () => ({
  getTimeAgo: vi.fn(() => '5 min ago'),
}));

import { getMedal } from '../../../utils/get-medal.ts';
import { formatNumber } from '../../../utils/format-number.ts';
import { getTimeAgo } from '../../../utils/time-ago.ts';

describe('createTopRecords', () => {
  it('creates records section', () => {
    const section = createTopRecords([]);

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('game-dialog__records');
    expect(
      section.querySelector('.game-dialog__records-title')?.textContent,
    ).toBe('🏆 Top Records');
    expect(section.querySelector('.game-dialog__records-list')).not.toBeNull();
  });

  it('renders top records', () => {
    const records = [
      {
        position: 1,
        playerName: 'Dasha',
        score: 123_456,
        achievedAt: '2026-01-01T12:00:00Z',
      },
      {
        position: 2,
        playerName: 'Alex',
        score: 98_765,
        achievedAt: '2026-01-01T11:00:00Z',
      },
    ];

    const section = createTopRecords(records);
    const items = section.querySelectorAll('.game-dialog__record');

    expect(items).toHaveLength(2);
    expect(
      items[0].querySelector('.game-dialog__record-name')?.textContent,
    ).toBe('Dasha');
    expect(
      items[0].querySelector('.game-dialog__record-score')?.textContent,
    ).toBe('123456');
    expect(
      items[0].querySelector('.game-dialog__record-time')?.textContent,
    ).toBe('5 min ago');

    expect(
      items[1].querySelector('.game-dialog__record-name')?.textContent,
    ).toBe('Alex');

    expect(getMedal).toHaveBeenCalledWith(1);
    expect(getMedal).toHaveBeenCalledWith(2);
    expect(formatNumber).toHaveBeenCalledWith(123_456);
    expect(formatNumber).toHaveBeenCalledWith(98_765);
    expect(getTimeAgo).toHaveBeenCalledWith('2026-01-01T12:00:00Z');
    expect(getTimeAgo).toHaveBeenCalledWith('2026-01-01T11:00:00Z');
  });

  it('sets medal as hidden from screen readers', () => {
    const section = createTopRecords([
      {
        position: 1,
        playerName: 'Dasha',
        score: 100,
        achievedAt: '2026-01-01T12:00:00Z',
      },
    ]);

    const medal = section.querySelector('.game-dialog__record-medal');

    expect(medal?.getAttribute('aria-hidden')).toBe('true');
  });
});
