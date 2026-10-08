import { describe, expect, it } from 'vitest';
import { createDivider } from './divider';

describe('createDivider', () => {
  it('creates divider with default text', () => {
    const divider = createDivider();

    expect(divider.className).toBe('divider');
    expect(divider.querySelectorAll('.divider__line')).toHaveLength(2);
    expect(divider.querySelector('.divider__label')?.textContent).toBe('OR');
  });

  it('creates divider with custom text', () => {
    const divider = createDivider('OR ELSE');

    expect(divider.querySelector('.divider__label')?.textContent).toBe(
      'OR ELSE',
    );
  });
});
