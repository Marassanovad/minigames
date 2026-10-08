import { describe, expect, it } from 'vitest';
import { formatCompactNumber } from './compact-number';

describe('formatCompactNumber', () => {
  it('returns the number as a string below 1000', () => {
    expect(formatCompactNumber(999)).toBe('999');
  });

  it('formats thousands with K', () => {
    expect(formatCompactNumber(1000)).toBe('1K');
    expect(formatCompactNumber(2500)).toBe('2K');
  });

  it('formats zero', () => {
    expect(formatCompactNumber(0)).toBe('0');
  });
});
