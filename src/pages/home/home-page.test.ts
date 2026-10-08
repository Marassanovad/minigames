import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHomePage } from './home-page';

const { navigateMock, getRouteStateMock, openMock, signOutMock, auth } =
  vi.hoisted(() => ({
    navigateMock: vi.fn(),
    getRouteStateMock: vi.fn(),
    openMock: vi.fn(),
    signOutMock: vi.fn(),
    auth: {
      currentUser: undefined as
        { email: string; displayName?: string } | undefined,
    },
  }));

vi.mock('../../components/footer/footer', () => ({
  createFooter: vi.fn(() => document.createElement('footer')),
}));

vi.mock('../../components/header/header', () => ({
  createHeader: vi.fn(() => document.createElement('header')),
}));

vi.mock('./sections/hero/hero.ts', () => ({
  createHero: vi.fn(() => document.createElement('section')),
}));

vi.mock('./sections/new-game/new-games.ts', () => ({
  createNewGames: vi.fn(() => document.createElement('section')),
}));

vi.mock('./sections/developer/developer.ts', () => ({
  createDeveloper: vi.fn(() => document.createElement('section')),
}));

vi.mock('./sections/top-players/top-players.ts', () => ({
  createTopPlayers: vi.fn(() => document.createElement('section')),
}));

vi.mock('../../components/auth-modals/auth-modals.ts', () => ({
  createAuthModal: vi.fn(() => ({
    modal: document.createElement('dialog'),
    open: openMock,
  })),
}));

vi.mock('../../app/router.ts', () => ({
  getRouteState: getRouteStateMock,
  navigate: navigateMock,
}));

vi.mock('firebase/auth', () => ({
  signOut: signOutMock,
}));

vi.mock('../../firebase', () => ({
  auth,
}));

vi.mock('../../components/snackbar/snackbar.ts', () => ({
  createSnackbar: vi.fn(),
}));

import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { createHero } from './sections/hero/hero.ts';
import { createNewGames } from './sections/new-game/new-games.ts';
import { createDeveloper } from './sections/developer/developer.ts';
import { createTopPlayers } from './sections/top-players/top-players.ts';
import { createAuthModal } from '../../components/auth-modals/auth-modals.ts';
import { createSnackbar } from '../../components/snackbar/snackbar.ts';

describe('renderHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    auth.currentUser = undefined;

    getRouteStateMock.mockReturnValue({
      path: '/',
      auth: undefined,
    });
  });

  it('creates home page with all sections', () => {
    const page = renderHomePage();

    expect(page.tagName).toBe('MAIN');
    expect(page.className).toBe('home-page');
    expect(page.children).toHaveLength(7);

    expect(createHeader).toHaveBeenCalledOnce();
    expect(createHero).toHaveBeenCalledOnce();
    expect(createNewGames).toHaveBeenCalledOnce();
    expect(createTopPlayers).toHaveBeenCalledOnce();
    expect(createDeveloper).toHaveBeenCalledOnce();
    expect(createFooter).toHaveBeenCalledOnce();
    expect(createAuthModal).toHaveBeenCalledWith(
      'login',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('opens login modal when route has login auth', async () => {
    getRouteStateMock.mockReturnValue({
      path: '/',
      auth: 'login',
    });

    renderHomePage();

    await new Promise<void>((resolve) => {
      queueMicrotask(resolve);
    });

    expect(openMock).toHaveBeenCalledWith('login');
  });

  it('opens register modal when route has register auth', async () => {
    getRouteStateMock.mockReturnValue({
      path: '/',
      auth: 'register',
    });

    renderHomePage();

    await new Promise<void>((resolve) => {
      queueMicrotask(resolve);
    });

    expect(openMock).toHaveBeenCalledWith('register');
  });

  it('removes auth parameter for authenticated user', () => {
    auth.currentUser = {
      email: 'dasha@example.com',
    };

    getRouteStateMock.mockReturnValue({
      path: '/',
      auth: 'login',
    });

    const replaceState = vi.spyOn(globalThis.history, 'replaceState');

    renderHomePage();

    expect(replaceState).toHaveBeenCalledOnce();
    expect(globalThis.location.search).toBe('');
    expect(createSnackbar).toHaveBeenCalledWith('You are already signed in.');
    expect(openMock).not.toHaveBeenCalled();

    replaceState.mockRestore();
  });

  it('does not open auth modal for authenticated user', () => {
    auth.currentUser = {
      email: 'dasha@example.com',
    };

    getRouteStateMock.mockReturnValue({
      path: '/',
      auth: 'register',
    });

    renderHomePage();

    expect(openMock).not.toHaveBeenCalled();
  });

  it('navigates to login when login handler is called', () => {
    renderHomePage();

    const options = vi.mocked(createHeader).mock.calls[0]?.[0];

    if (!options) {
      throw new Error('Header options were not provided');
    }

    options.onLogin?.();

    expect(navigateMock).toHaveBeenCalledWith({
      path: '/',
      auth: 'login',
    });
  });

  it('navigates to register when signup handler is called', () => {
    renderHomePage();

    const options = vi.mocked(createHeader).mock.calls[0]?.[0];

    if (!options) {
      throw new Error('Header options were not provided');
    }

    options.onSignup?.();

    expect(navigateMock).toHaveBeenCalledWith({
      path: '/',
      auth: 'register',
    });
  });

  it('signs out when logout handler is called', async () => {
    signOutMock.mockResolvedValue(undefined);

    renderHomePage();

    const options = vi.mocked(createHeader).mock.calls[0]?.[0];

    if (!options) {
      throw new Error('Header options were not provided');
    }

    options.onLogout?.();

    expect(signOutMock).toHaveBeenCalledWith(auth);
  });
});
