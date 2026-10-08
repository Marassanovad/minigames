import { describe, expect, it } from 'vitest';
import { formatNumber } from './format-number';

describe('formatNumber', () => {
  it('formats thousands with commas', () => {
    expect(formatNumber(1_234_567)).toBe('1,234,567');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });
});
