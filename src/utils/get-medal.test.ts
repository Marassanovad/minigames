import { describe, expect, it } from 'vitest';
import { getMedal } from './get-medal';

describe('getMedal', () => {
  it('returns gold medal for first place', () => {
    expect(getMedal(1)).toBe('🥇');
  });

  it('returns silver medal for second place', () => {
    expect(getMedal(2)).toBe('🥈');
  });

  it('returns bronze medal for third place', () => {
    expect(getMedal(3)).toBe('🥉');
  });

  it('returns position with dot for other places', () => {
    expect(getMedal(4)).toBe('4.');
    expect(getMedal(10)).toBe('10.');
  });
});
