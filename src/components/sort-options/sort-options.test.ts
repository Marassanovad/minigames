import { describe, expect, it, vi } from 'vitest';
import { createSortOptions } from './sort-options';

vi.mock('../../assets/icons/chose.svg?raw', () => ({
  default: '<svg></svg>',
}));

describe('createSortOptions', () => {
  it('creates sort options with default value', () => {
    const wrapper = createSortOptions({
      onChange: vi.fn(),
    });

    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.className).toBe('sort-options');
    expect(
      wrapper.querySelector(':scope .sort-options__trigger-text')?.textContent,
    ).toBe('Sort by: Rating ↓');
  });

  it('uses provided sort value', () => {
    const wrapper = createSortOptions({
      value: 'name-asc',
      onChange: vi.fn(),
    });

    expect(
      wrapper.querySelector(':scope .sort-options__trigger-text')?.textContent,
    ).toBe('Sort by: Name A→Z');

    expect(
      wrapper.querySelector(':scope .sort-options__item.is-selected')
        ?.textContent,
    ).toBe('Name A→Z');
  });

  it('falls back to rating descending for invalid value', () => {
    const wrapper = createSortOptions({
      value: 'invalid' as 'rating-desc',
      onChange: vi.fn(),
    });

    expect(
      wrapper.querySelector(':scope .sort-options__trigger-text')?.textContent,
    ).toBe('Sort by: Rating ↓');
  });

  it('renders all sort options and dividers', () => {
    const wrapper = createSortOptions({
      onChange: vi.fn(),
    });

    expect(wrapper.querySelectorAll(':scope .sort-options__item')).toHaveLength(
      4,
    );

    expect(
      wrapper.querySelectorAll(':scope .sort-options__divider'),
    ).toHaveLength(3);
  });

  it('marks only current option as selected', () => {
    const wrapper = createSortOptions({
      value: 'name-desc',
      onChange: vi.fn(),
    });

    expect(
      wrapper.querySelectorAll(':scope .sort-options__item.is-selected'),
    ).toHaveLength(1);

    expect(
      wrapper.querySelector(':scope .sort-options__item.is-selected')
        ?.textContent,
    ).toBe('Name Z→A');
  });

  it('opens dropdown when trigger is clicked', () => {
    const wrapper = createSortOptions({
      onChange: vi.fn(),
    });

    const trigger = wrapper.querySelector(':scope .sort-options__trigger');

    if (!(trigger instanceof HTMLButtonElement)) {
      throw new TypeError('Sort trigger was not created');
    }

    const dropdown = wrapper.querySelector(':scope .sort-options__dropdown');

    if (!(dropdown instanceof HTMLDivElement)) {
      throw new TypeError('Sort dropdown was not created');
    }

    trigger.click();

    expect(dropdown.hidden).toBe(false);
    expect(trigger.classList.contains('is-open')).toBe(true);
  });

  it('closes dropdown when trigger is clicked again', () => {
    vi.useFakeTimers();

    const wrapper = createSortOptions({
      onChange: vi.fn(),
    });

    const trigger = wrapper.querySelector(':scope .sort-options__trigger');

    if (!(trigger instanceof HTMLButtonElement)) {
      throw new TypeError('Sort trigger was not created');
    }

    const dropdown = wrapper.querySelector(':scope .sort-options__dropdown');

    if (!(dropdown instanceof HTMLDivElement)) {
      throw new TypeError('Sort dropdown was not created');
    }

    trigger.click();

    expect(dropdown.hidden).toBe(false);
    expect(trigger.classList.contains('is-open')).toBe(true);

    trigger.click();

    expect(dropdown.classList.contains('is-visible')).toBe(false);
    expect(trigger.classList.contains('is-open')).toBe(false);

    vi.advanceTimersByTime(200);

    vi.useRealTimers();
  });

  it('changes selected option and calls onChange', () => {
    const onChange = vi.fn();

    const wrapper = createSortOptions({
      onChange,
    });

    const options = wrapper.querySelectorAll(':scope .sort-options__item');

    const nameAscOption = options[2];

    if (!(nameAscOption instanceof HTMLButtonElement)) {
      throw new TypeError('Sort option was not created');
    }

    nameAscOption.click();

    expect(onChange).toHaveBeenCalledWith('name-asc');
    expect(
      wrapper.querySelector(':scope .sort-options__trigger-text')?.textContent,
    ).toBe('Sort by: Name A→Z');

    expect(
      wrapper.querySelector(':scope .sort-options__item.is-selected')
        ?.textContent,
    ).toBe('Name A→Z');
  });

  it('shows check icon only for selected option', () => {
    const wrapper = createSortOptions({
      value: 'name-asc',
      onChange: vi.fn(),
    });

    const icons = wrapper.querySelectorAll(':scope .sort-options__item-icon');

    expect(icons).toHaveLength(4);
    expect(icons[0]?.classList.contains('is-hidden')).toBe(true);
    expect(icons[1]?.classList.contains('is-hidden')).toBe(true);
    expect(icons[2]?.classList.contains('is-hidden')).toBe(false);
    expect(icons[3]?.classList.contains('is-hidden')).toBe(true);
  });
});
