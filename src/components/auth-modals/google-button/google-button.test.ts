import { describe, expect, it, vi } from 'vitest';
import { createGoogleButton } from './google-button';

describe('createGoogleButton', () => {
  it('creates Google button', () => {
    const button = createGoogleButton(vi.fn());

    expect(button.type).toBe('button');
    expect(button.className).toBe('google-button');

    expect(button.querySelector('.google-button__icon')).not.toBeNull();

    expect(button.querySelector('.google-button__text')?.textContent).toBe(
      'Continue with Google',
    );
  });

  it('calls click handler', () => {
    const onClick = vi.fn();
    const button = createGoogleButton(onClick);

    button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });
});
