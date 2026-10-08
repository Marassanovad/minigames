import { describe, expect, it, vi } from 'vitest';
import { createAuthButton } from './auth-button';

describe('createAuthButton', () => {
  it('creates login button', () => {
    const button = createAuthButton('login', vi.fn());

    expect(button.type).toBe('button');
    expect(button.textContent).toBe('Log In');
    expect(button.className).toBe(
      'auth-button auth-button--login auth-button--light',
    );
  });

  it('creates logout button', () => {
    const button = createAuthButton('logout', vi.fn());

    expect(button.textContent).toBe('Log Out');
  });

  it('creates signup button with dark theme', () => {
    const button = createAuthButton('signup', vi.fn(), 'dark');

    expect(button.textContent).toBe('Sign Up');
    expect(button.className).toBe(
      'auth-button auth-button--signup auth-button--dark',
    );
  });

  it('calls click handler', () => {
    const onClick = vi.fn();
    const button = createAuthButton('login', onClick);

    button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });
});
