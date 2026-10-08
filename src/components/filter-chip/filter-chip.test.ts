import { describe, expect, it, vi } from 'vitest';
import { createFilterChip } from './filter-chip';

describe('createFilterChip', () => {
  it('creates inactive filter chip', () => {
    const chip = createFilterChip({
      label: 'Action',
      onClick: vi.fn(),
    });

    expect(chip.type).toBe('button');
    expect(chip.className).toBe('filter-chip');
    expect(chip.textContent).toBe('Action');
  });

  it('creates active filter chip', () => {
    const chip = createFilterChip({
      label: 'Action',
      isActive: true,
      onClick: vi.fn(),
    });

    expect(chip.classList.contains('is-active')).toBe(true);
  });

  it('calls click handler', () => {
    const onClick = vi.fn();
    const chip = createFilterChip({
      label: 'Action',
      onClick,
    });

    chip.click();

    expect(onClick).toHaveBeenCalledOnce();
  });
});
