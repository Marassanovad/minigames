import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRouteState, navigate } from './router';

vi.mock('../pages/home/home-page', () => ({
  renderHomePage: vi.fn(() => document.createElement('div')),
}));

vi.mock('../pages/library/library-page', () => ({
  renderLibraryPage: vi.fn(() => document.createElement('div')),
}));

vi.mock('../pages/not-found/not-found.ts', () => ({
  renderNotFoundPage: vi.fn(() => document.createElement('div')),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('../firebase', () => ({
  auth: {},
}));

describe('getRouteState', () => {
  beforeEach(() => {
    globalThis.history.replaceState({}, '', '/minigames/');
  });

  it('returns route path', () => {
    globalThis.history.replaceState({}, '', '/minigames/library');

    expect(getRouteState()).toEqual({
      path: '/library',
      category: undefined,
      sort: undefined,
      page: undefined,
      game: undefined,
      auth: undefined,
    });
  });

  it('returns query parameters', () => {
    globalThis.history.replaceState(
      {},
      '',
      '/minigames/?category=action&sort=popular&page=2&game=test&auth=login',
    );

    expect(getRouteState()).toEqual({
      path: '/',
      category: 'action',
      sort: 'popular',
      page: 2,
      game: 'test',
      auth: 'login',
    });
  });

  it('ignores invalid auth mode', () => {
    globalThis.history.replaceState({}, '', '/minigames/?auth=invalid');

    expect(getRouteState().auth).toBeUndefined();
  });
});

describe('navigate', () => {
  beforeEach(() => {
    globalThis.history.replaceState(
      {},
      '',
      '/minigames/?category=old&sort=old&page=5&game=old&auth=login',
    );

    vi.spyOn(globalThis, 'dispatchEvent');
  });

  it('navigates to a path with query parameters', () => {
    navigate({
      path: '/library',
      category: 'action',
      sort: 'popular',
      page: 2,
      game: 'test',
      auth: 'register',
    });

    expect(globalThis.location.pathname).toBe('/minigames/library');
    expect(globalThis.location.search).toBe(
      '?category=action&sort=popular&page=2&game=test&auth=register',
    );
    expect(globalThis.dispatchEvent).toHaveBeenCalled();
  });

  it('removes undefined query parameters', () => {
    navigate({
      path: '/home',
    });

    expect(globalThis.location.pathname).toBe('/minigames/home');
    expect(globalThis.location.search).toBe('');
  });

  it('keeps current path when path is not provided', () => {
    globalThis.history.replaceState({}, '', '/minigames/library');

    navigate({
      category: 'puzzle',
    });

    expect(globalThis.location.pathname).toBe('/minigames/library');
    expect(globalThis.location.search).toBe('?category=puzzle');
  });
});
