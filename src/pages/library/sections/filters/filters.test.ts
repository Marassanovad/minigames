import { describe, expect, it, vi } from 'vitest';
import { createFilters } from './filters';

const getCategoriesMock = vi.hoisted(() => vi.fn());
const createFilterChipMock = vi.hoisted(() => vi.fn());
const createSortOptionsMock = vi.hoisted(() => vi.fn());

vi.mock('../../../../api/catalog-api.ts', () => ({
  getCategories: getCategoriesMock,
}));

vi.mock('../../../../components/filter-chip/filter-chip', () => ({
  createFilterChip: createFilterChipMock,
}));

vi.mock('../../../../components/sort-options/sort-options', () => ({
  createSortOptions: createSortOptionsMock,
}));

function createCategories() {
  return [
    {
      slug: 'all',
      label: 'All',
      isDefault: true,
    },
    {
      slug: 'action',
      label: 'Action',
      isDefault: false,
    },
  ];
}

describe('createFilters', () => {
  it('creates filters section with loading state', () => {
    getCategoriesMock.mockImplementation(() => new Promise(() => {}));
    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    const section = createFilters();

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('filters');
    expect(section.querySelector(':scope .filters__loading')?.textContent).toBe(
      'Loading categories...',
    );
  });

  it('loads categories and creates filter chips', async () => {
    getCategoriesMock.mockResolvedValue({
      data: createCategories(),
    });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    createFilterChipMock.mockImplementation(({ label, isActive, onClick }) => {
      const chip = document.createElement('button');
      chip.textContent = label;
      chip.dataset.active = String(isActive);
      chip.addEventListener('click', onClick);
      return chip;
    });

    const section = createFilters();

    await vi.waitFor(() => {
      expect(
        section.querySelectorAll(':scope .filters__chips button'),
      ).toHaveLength(2);
    });

    expect(createFilterChipMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'All',
        isActive: true,
      }),
    );

    expect(createFilterChipMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Action',
        isActive: false,
      }),
    );
  });

  it('uses active filter instead of default category', async () => {
    getCategoriesMock.mockResolvedValue({
      data: createCategories(),
    });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    createFilterChipMock.mockImplementation(({ label, isActive }) => {
      const chip = document.createElement('button');
      chip.textContent = label;
      chip.dataset.active = String(isActive);
      return chip;
    });

    createFilters({
      activeFilter: 'action',
    });

    await vi.waitFor(() => {
      expect(createFilterChipMock).toHaveBeenCalled();
    });

    expect(createFilterChipMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Action',
        isActive: true,
      }),
    );
  });

  it('uses first category when there is no default category', async () => {
    getCategoriesMock.mockResolvedValue({
      data: [
        {
          slug: 'action',
          label: 'Action',
          isDefault: false,
        },
        {
          slug: 'puzzle',
          label: 'Puzzle',
          isDefault: false,
        },
      ],
    });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    createFilterChipMock.mockImplementation(({ label, isActive }) => {
      const chip = document.createElement('button');
      chip.textContent = label;
      chip.dataset.active = String(isActive);
      return chip;
    });

    createFilters();

    await vi.waitFor(() => {
      expect(createFilterChipMock).toHaveBeenCalled();
    });

    expect(createFilterChipMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Action',
        isActive: true,
      }),
    );
  });

  it('shows empty state when categories are empty', async () => {
    getCategoriesMock.mockResolvedValue({
      data: [],
    });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    const section = createFilters();

    await vi.waitFor(() => {
      expect(section.querySelector(':scope .filters__empty')?.textContent).toBe(
        'No categories found.',
      );
    });
  });

  it('shows error state when categories fail to load', async () => {
    getCategoriesMock.mockRejectedValue(new TypeError('Failed'));

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    const section = createFilters();

    await vi.waitFor(() => {
      expect(
        section.querySelector(':scope .filters__error')?.textContent,
      ).toContain('Failed to load categories.');
    });
  });

  it('retries loading categories', async () => {
    getCategoriesMock
      .mockRejectedValueOnce(new TypeError('Failed'))
      .mockResolvedValueOnce({
        data: createCategories(),
      });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    createFilterChipMock.mockImplementation(({ label }) => {
      const chip = document.createElement('button');
      chip.textContent = label;
      return chip;
    });

    const section = createFilters();

    await vi.waitFor(() => {
      expect(section.querySelector(':scope .filters__error')).not.toBeNull();
    });

    const retryButton = section.querySelector(':scope .filters__error button');

    if (!(retryButton instanceof HTMLButtonElement)) {
      throw new TypeError('Retry button was not created');
    }

    retryButton.click();

    await vi.waitFor(() => {
      expect(
        section.querySelectorAll(':scope .filters__chips button'),
      ).toHaveLength(2);
    });

    expect(getCategoriesMock).toHaveBeenCalledTimes(2);
  });

  it('calls onFilterChange when a category is clicked', async () => {
    getCategoriesMock.mockResolvedValue({
      data: createCategories(),
    });

    createSortOptionsMock.mockReturnValue(document.createElement('select'));

    createFilterChipMock.mockImplementation(({ label, onClick }) => {
      const chip = document.createElement('button');
      chip.textContent = label;
      chip.addEventListener('click', onClick);
      return chip;
    });

    const onFilterChange = vi.fn();

    createFilters({
      onFilterChange,
    });

    await vi.waitFor(() => {
      expect(createFilterChipMock).toHaveBeenCalled();
    });

    const actionChip = createFilterChipMock.mock.calls.find(
      ([options]) => options.label === 'Action',
    )?.[0];

    if (!actionChip) {
      throw new TypeError('Action filter options were not provided');
    }

    actionChip.onClick();

    expect(onFilterChange).toHaveBeenCalledWith('action');
  });

  it('passes sort changes to onSortChange', () => {
    createSortOptionsMock.mockImplementation(({ onChange }) => {
      const select = document.createElement('select');
      select.addEventListener('change', () => {
        onChange('popular');
      });
      return select;
    });

    const onSortChange = vi.fn();

    const section = createFilters({
      onSortChange,
    });

    const select = section.querySelector(':scope select');

    if (!(select instanceof HTMLSelectElement)) {
      throw new TypeError('Sort options were not created');
    }

    select.dispatchEvent(new Event('change'));

    expect(onSortChange).toHaveBeenCalledWith('popular');
  });
});
