import { describe, expect, it, vi } from 'vitest';
import { createAuthTabSwitcher } from './auth-tab-switcher';

describe('createAuthTabSwitcher', () => {
  it('sets login tab as active initially', () => {
    const switcher = createAuthTabSwitcher('login', vi.fn());
    const buttons = switcher.querySelectorAll('button');

    expect(buttons[0].textContent).toBe('Log In');
    expect(buttons[1].textContent).toBe('Register');
    expect(buttons[0].classList.contains('is-active')).toBe(true);
    expect(buttons[1].classList.contains('is-active')).toBe(false);
  });

  it('sets register tab as active initially', () => {
    const switcher = createAuthTabSwitcher('register', vi.fn());
    const buttons = switcher.querySelectorAll('button');

    expect(buttons[0].classList.contains('is-active')).toBe(false);
    expect(buttons[1].classList.contains('is-active')).toBe(true);
  });

  it('switches to register tab', () => {
    const onChange = vi.fn();
    const switcher = createAuthTabSwitcher('login', onChange);
    const buttons = switcher.querySelectorAll('button');

    buttons[1].click();

    expect(buttons[0].classList.contains('is-active')).toBe(false);
    expect(buttons[1].classList.contains('is-active')).toBe(true);
    expect(onChange).toHaveBeenCalledWith('register');
  });

  it('switches to login tab', () => {
    const onChange = vi.fn();
    const switcher = createAuthTabSwitcher('register', onChange);
    const buttons = switcher.querySelectorAll('button');

    buttons[0].click();

    expect(buttons[0].classList.contains('is-active')).toBe(true);
    expect(buttons[1].classList.contains('is-active')).toBe(false);
    expect(onChange).toHaveBeenCalledWith('login');
  });
});
