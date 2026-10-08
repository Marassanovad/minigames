import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHeader } from './header';

const authStateCallback = vi.fn();

vi.mock('../../firebase', () => ({
  auth: {
    currentUser: undefined,
  },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_, callback) => {
    authStateCallback.mockImplementation(callback);
  }),
}));

vi.mock('../../data/navigation-links.ts', () => ({
  navigationLinks: [
    { label: 'Home', href: '/minigames/' },
    { label: 'Library', href: '/minigames/library' },
  ],
}));

vi.mock('../auth-button/auth-button', () => ({
  createAuthButton: vi.fn((type, onClick) => {
    const button = document.createElement('button');
    button.textContent = type;
    button.addEventListener('click', onClick);
    return button;
  }),
}));

vi.mock('../burger-menu-button/burger-menu-button', () => ({
  createBurgerMenuButton: vi.fn(() => document.createElement('button')),
}));

vi.mock('../burger-menu-button/mobile-menu/mobile-menu.ts', () => ({
  closeMenu: vi.fn(),
  createMobileMenu: vi.fn(() => document.createElement('div')),
  openMenu: vi.fn(),
}));

vi.mock('../../utils/create-avatar.ts', () => ({
  createUserAvatar: vi.fn((name) => {
    const avatar = document.createElement('div');
    avatar.textContent = name;
    return avatar;
  }),
}));

vi.mock('../../utils/create-logo.ts', () => ({
  createLogo: vi.fn(() => document.createElement('a')),
}));

describe('createHeader', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  it('creates header with navigation', () => {
    const header = createHeader();

    expect(header.tagName).toBe('HEADER');
    expect(header.className).toBe('header');
    expect(header.querySelector('.header__logo')).not.toBeNull();
    expect(header.querySelectorAll('.header__nav-link')).toHaveLength(2);
  });

  it('marks current home link as active', () => {
    globalThis.history.replaceState({}, '', '/minigames/');

    const header = createHeader();
    const links = header.querySelectorAll('.header__nav-link');

    expect(links[0].classList.contains('is-active')).toBe(true);
    expect(links[1].classList.contains('is-active')).toBe(false);
  });

  it('creates login and signup buttons for guest', () => {
    const header = createHeader();

    authStateCallback(JSON.parse('null'));

    const actions = header.querySelector('.header__actions');

    expect(actions?.textContent).toContain('login');
    expect(actions?.textContent).toContain('signup');
  });

  it('creates authenticated user state', () => {
    const header = createHeader();

    authStateCallback({
      displayName: 'Dasha User',
      email: 'dasha@example.com',
      photoURL: 'avatar.jpg',
    });

    expect(header.querySelector('.header__user-name')?.textContent).toBe(
      'Dasha User',
    );
    expect(header.querySelector('.header__user-avatar')).not.toBeNull();
    expect(header.querySelector('.header__actions')?.textContent).toContain(
      'logout',
    );
  });

  it('uses email username when display name is empty', () => {
    const header = createHeader();

    authStateCallback({
      displayName: ' '.repeat(3),
      email: 'dasha@example.com',
      photoURL: undefined,
    });

    expect(header.querySelector('.header__user-name')?.textContent).toBe(
      'dasha',
    );
  });

  it('uses User when display name and email are unavailable', () => {
    const header = createHeader();

    authStateCallback({
      displayName: undefined,
      email: undefined,
      photoURL: undefined,
    });

    expect(header.querySelector('.header__user-name')?.textContent).toBe(
      'User',
    );
  });

  it('calls login handler', () => {
    const onLogin = vi.fn();
    const header = createHeader({ onLogin });

    authStateCallback(JSON.parse('null'));

    const loginButton = [...header.querySelectorAll('button')].find(
      (button) => button.textContent === 'login',
    );

    loginButton?.click();

    expect(onLogin).toHaveBeenCalledOnce();
  });

  it('calls signup handler', () => {
    const onSignup = vi.fn();
    const header = createHeader({ onSignup });

    authStateCallback(JSON.parse('null'));

    const signupButton = [...header.querySelectorAll('button')].find(
      (button) => button.textContent === 'signup',
    );

    signupButton?.click();

    expect(onSignup).toHaveBeenCalledOnce();
  });

  it('calls logout handler', () => {
    const onLogout = vi.fn();
    const header = createHeader({ onLogout });

    authStateCallback({
      displayName: 'Dasha',
      email: 'dasha@example.com',
      photoURL: undefined,
    });

    const logoutButton = [...header.querySelectorAll('button')].find(
      (button) => button.textContent === 'logout',
    );

    logoutButton?.click();

    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('subscribes to auth state changes', async () => {
    const { onAuthStateChanged } = await import('firebase/auth');

    createHeader();

    expect(onAuthStateChanged).toHaveBeenCalledOnce();
  });
});
