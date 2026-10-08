import { describe, expect, it } from 'vitest';
import { createUserAvatar } from './create-avatar';

describe('createUserAvatar', () => {
  it('creates avatar with image', () => {
    const avatar = createUserAvatar('Dasha User', 'avatar.jpg');
    const image = avatar.querySelector('img');

    expect(image).not.toBeNull();
    expect(image?.alt).toBe('Dasha User');
    expect(image?.src).toContain('avatar.jpg');
  });

  it('creates avatar with initials without image', () => {
    const avatar = createUserAvatar('Dasha User');

    expect(avatar.textContent).toBe('DU');
  });

  it('creates avatar with initials from one word', () => {
    const avatar = createUserAvatar('Dasha');

    expect(avatar.textContent).toBe('D');
  });

  it('uses U when username has no initials', () => {
    const avatar = createUserAvatar(' '.repeat(3));

    expect(avatar.textContent).toBe('U');
  });

  it('uses initials when image fails to load', () => {
    const avatar = createUserAvatar('Dasha User', 'avatar.jpg');
    const image = avatar.querySelector('img');

    image?.dispatchEvent(new Event('error'));

    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar.textContent).toBe('DU');
  });
});
