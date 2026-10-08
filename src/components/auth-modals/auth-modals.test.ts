import { describe, expect, it, vi } from 'vitest';
import { createAuthModal } from './auth-modals';

vi.mock('../../firebase', () => ({
  auth: {
    currentUser: undefined,
  },
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  updateProfile: vi.fn(),
}));

describe('createAuthModal', () => {
  it('creates login modal by default', () => {
    const { modal } = createAuthModal();

    expect(modal.className).toBe('auth-modal');
    expect(modal.querySelector('.auth-modal__title')?.textContent).toBe(
      'Welcome Back!',
    );
    expect(modal.querySelector('.auth-modal__description')?.textContent).toBe(
      'Sign in to resume your games and progress.',
    );
    expect(modal.querySelector('.auth-modal__footer-text')?.textContent).toBe(
      "Don't have an account?",
    );
    expect(modal.querySelector('.auth-modal__footer-button')?.textContent).toBe(
      'Register',
    );
  });

  it('creates register modal when requested', () => {
    const { modal } = createAuthModal('register');

    expect(modal.querySelector('.auth-modal__title')?.textContent).toBe(
      'Create Account',
    );
    expect(modal.querySelector('.auth-modal__description')?.textContent).toBe(
      'Join MiniGames to track your score & streak.',
    );

    expect(
      modal.querySelector('input[autocomplete="username"]'),
    ).not.toBeNull();
    expect(
      modal.querySelector('input[autocomplete="new-password"]'),
    ).not.toBeNull();
  });

  it('switches from login to register', () => {
    const onTabChange = vi.fn();
    const { modal } = createAuthModal('login', undefined, onTabChange);

    const button = modal.querySelector(
      '.auth-modal__footer-button',
    ) as HTMLButtonElement;

    button.click();

    expect(onTabChange).toHaveBeenCalledWith('register');
    expect(modal.querySelector('.auth-modal__title')?.textContent).toBe(
      'Create Account',
    );
  });

  it('switches from register to login', () => {
    const onTabChange = vi.fn();
    const { modal } = createAuthModal('register', undefined, onTabChange);

    const button = modal.querySelector(
      '.auth-modal__footer-button',
    ) as HTMLButtonElement;

    button.click();

    expect(onTabChange).toHaveBeenCalledWith('login');
    expect(modal.querySelector('.auth-modal__title')?.textContent).toBe(
      'Welcome Back!',
    );
  });

  it('disables login button initially', () => {
    const { modal } = createAuthModal();
    const buttons = modal.querySelectorAll('button');

    const loginButton = [...buttons].find(
      (button) => button.textContent === 'Login',
    );

    expect(loginButton?.disabled).toBe(true);
  });

  it('enables login button after valid credentials', () => {
    const { modal } = createAuthModal();

    const inputs = modal.querySelectorAll('input');
    const emailInput = inputs[0];
    const passwordInput = inputs[1];

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));

    const loginButton = [...modal.querySelectorAll('button')].find(
      (button) => button.textContent === 'Login',
    );

    expect(loginButton?.disabled).toBe(false);
  });

  it('keeps login button disabled for invalid credentials', () => {
    const { modal } = createAuthModal();

    const inputs = modal.querySelectorAll('input');
    const emailInput = inputs[0];
    const passwordInput = inputs[1];

    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = '123';
    passwordInput.dispatchEvent(new Event('input'));

    const loginButton = [...modal.querySelectorAll('button')].find(
      (button) => button.textContent === 'Login',
    );

    expect(loginButton?.disabled).toBe(true);
  });

  it('disables register button initially', () => {
    const { modal } = createAuthModal('register');

    const registerButton = [...modal.querySelectorAll('button')].find(
      (button) => button.textContent === 'Create Account',
    );

    expect(registerButton?.disabled).toBe(true);
  });

  it('enables register button after valid data', () => {
    const { modal } = createAuthModal('register');

    const inputs = modal.querySelectorAll('input');

    inputs[0].value = 'Dasha';
    inputs[0].dispatchEvent(new Event('input'));

    inputs[1].value = 'test@example.com';
    inputs[1].dispatchEvent(new Event('input'));

    inputs[2].value = 'Password1!';
    inputs[2].dispatchEvent(new Event('input'));

    inputs[3].value = 'Password1!';
    inputs[3].dispatchEvent(new Event('input'));

    const registerButton = [...modal.querySelectorAll('button')].find(
      (button) => button.textContent === 'Create Account',
    );

    expect(registerButton?.disabled).toBe(false);
  });

  it('keeps register button disabled when passwords do not match', () => {
    const { modal } = createAuthModal('register');

    const inputs = modal.querySelectorAll('input');

    inputs[0].value = 'Dasha';
    inputs[0].dispatchEvent(new Event('input'));

    inputs[1].value = 'test@example.com';
    inputs[1].dispatchEvent(new Event('input'));

    inputs[2].value = 'Password1!';
    inputs[2].dispatchEvent(new Event('input'));

    inputs[3].value = 'Password2!';
    inputs[3].dispatchEvent(new Event('input'));

    const registerButton = [...modal.querySelectorAll('button')].find(
      (button) => button.textContent === 'Create Account',
    );

    expect(registerButton?.disabled).toBe(true);
  });
});
