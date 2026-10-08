import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAppSession, getAppSession, saveAppSession } from './app-session';

describe('app-session', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('saves and returns a valid session', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));

    saveAppSession('Dasha', 'dasha@example.com', 'avatar.jpg');

    expect(getAppSession()).toEqual({
      displayName: 'Dasha',
      email: 'dasha@example.com',
      authenticatedAt: Date.now(),
      avatarUrl: 'avatar.jpg',
    });
  });

  it('saves a session without an avatar', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));

    saveAppSession('Dasha', 'dasha@example.com');

    expect(getAppSession()).toEqual({
      displayName: 'Dasha',
      email: 'dasha@example.com',
      authenticatedAt: Date.now(),
    });
  });

  it('returns undefined when there is no session', () => {
    expect(getAppSession()).toBeUndefined();
  });

  it('clears an expired session', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));

    saveAppSession('Dasha', 'dasha@example.com');

    vi.setSystemTime(new Date('2026-01-01T12:05:00Z'));

    expect(getAppSession()).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });

  it('clears an invalid session', () => {
    localStorage.setItem(
      'minigames:rss:app-session',
      JSON.stringify({
        displayName: 'Dasha',
        authenticatedAt: Date.now(),
      }),
    );

    expect(getAppSession()).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });

  it('clears a malformed session', () => {
    localStorage.setItem('minigames:rss:app-session', 'invalid json');

    expect(getAppSession()).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });

  it('clears the session explicitly', () => {
    saveAppSession('Dasha', 'dasha@example.com');

    clearAppSession();

    expect(getAppSession()).toBeUndefined();
  });
});
