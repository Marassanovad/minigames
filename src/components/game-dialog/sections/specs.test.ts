import { describe, expect, it } from 'vitest';
import { createSpecs } from './specs';

describe('createSpecs', () => {
  it('creates specs container', () => {
    const container = createSpecs({
      genre: 'Action',
      players: '1-2',
      duration: '10 min',
      price: 'Free',
    });

    expect(container.tagName).toBe('DIV');
    expect(container.className).toBe('game-dialog__specs');
    expect(container.querySelectorAll('.game-dialog__spec')).toHaveLength(4);
  });

  it('renders all specs', () => {
    const container = createSpecs({
      genre: 'Action',
      players: '1-2',
      duration: '10 min',
      price: '$4.99',
    });

    const items = container.querySelectorAll('.game-dialog__spec');

    expect(
      items[0].querySelector('.game-dialog__spec-label')?.textContent,
    ).toBe('Genre');
    expect(
      items[0].querySelector('.game-dialog__spec-value')?.textContent,
    ).toBe('Action');

    expect(
      items[1].querySelector('.game-dialog__spec-label')?.textContent,
    ).toBe('Players');
    expect(
      items[1].querySelector('.game-dialog__spec-value')?.textContent,
    ).toBe('1-2');

    expect(
      items[2].querySelector('.game-dialog__spec-label')?.textContent,
    ).toBe('Duration');
    expect(
      items[2].querySelector('.game-dialog__spec-value')?.textContent,
    ).toBe('10 min');

    expect(
      items[3].querySelector('.game-dialog__spec-label')?.textContent,
    ).toBe('Price');
    expect(
      items[3].querySelector('.game-dialog__spec-value')?.textContent,
    ).toBe('$4.99');
  });
});
