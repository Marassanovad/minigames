import { describe, expect, it, vi } from 'vitest';
import { getTimeAgo } from './time-ago';

describe('getTimeAgo', () => {
  it('returns just now for less than one minute', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));

    expect(getTimeAgo('2026-01-01T11:59:30Z')).toBe('just now');
  });

  it('returns minutes ago', () => {
    vi.setSystemTime(new Date('2026-01-01T12:10:00Z'));

    expect(getTimeAgo('2026-01-01T12:05:00Z')).toBe('5 min ago');
  });

  it('returns hours ago', () => {
    vi.setSystemTime(new Date('2026-01-01T14:00:00Z'));

    expect(getTimeAgo('2026-01-01T13:00:00Z')).toBe('1 hour ago');
    expect(getTimeAgo('2026-01-01T11:00:00Z')).toBe('3 hours ago');
  });

  it('returns days ago', () => {
    vi.setSystemTime(new Date('2026-01-04T12:00:00Z'));

    expect(getTimeAgo('2026-01-03T12:00:00Z')).toBe('1 day ago');
    expect(getTimeAgo('2026-01-01T12:00:00Z')).toBe('3 days ago');
  });

  it('returns weeks ago', () => {
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));

    expect(getTimeAgo('2026-01-08T12:00:00Z')).toBe('1 week ago');
  });

  it('returns months ago', () => {
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));

    expect(getTimeAgo('2026-05-01T12:00:00Z')).toBe('1 month ago');
    expect(getTimeAgo('2026-02-01T12:00:00Z')).toBe('4 months ago');
  });

  it('returns years ago', () => {
    vi.setSystemTime(new Date('2027-01-01T12:00:00Z'));

    expect(getTimeAgo('2025-01-01T12:00:00Z')).toBe('2 years ago');
  });
});
