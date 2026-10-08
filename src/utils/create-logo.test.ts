import { describe, expect, it } from 'vitest';
import { createLogo } from './create-logo';

describe('createLogo', () => {
  it('creates logo link', () => {
    const logo = createLogo();

    expect(logo.tagName).toBe('A');
    expect(logo.getAttribute('href')).toBe('/');
  });

  it('creates logo image', () => {
    const logo = createLogo();
    const image = logo.querySelector('img');

    expect(image).not.toBeNull();
    expect(image?.alt).toBe('');
  });

  it('creates logo text', () => {
    const logo = createLogo();
    const text = logo.querySelector('span');

    expect(text?.textContent).toBe('MiniGames');
  });
});
