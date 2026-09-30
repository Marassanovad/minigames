import './filters.scss';
import { createFilterChip } from '../../../../components/filter-chip/filter-chip';
import { createSortOptions } from '../../../../components/sort-options/sort-options';
import type { Category } from '../../../../types/category';
import type { SortOption } from '../../../../types/sort.ts';
import { getCategories } from '../../../../api/catalog-api.ts';

interface FiltersOptions {
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: SortOption) => void;
}

export function createFilters({
  onFilterChange,
  onSortChange,
}: FiltersOptions = {}): HTMLElement {
  const section = document.createElement('section');
  section.className = 'filters';

  const chips = document.createElement('div');
  chips.className = 'filters__chips';

  const dropdown = createSortOptions({
    value: 'rating-desc',
    onChange: (sort) => {
      onSortChange?.(sort);
    },
  });

  section.append(chips, dropdown);

  void loadCategories();

  return section;

  async function loadCategories(): Promise<void> {
    showLoading();

    try {
      const response = await getCategories();

      if (response.data.length === 0) {
        showEmpty();
        return;
      }

      const defaultCategory =
        response.data.find((category) => category.isDefault) ??
        response.data[0];

      renderChips(response.data, defaultCategory.slug);
      onFilterChange?.(defaultCategory.slug);
    } catch {
      showError();
    }
  }

  function renderChips(categories: Category[], activeFilter: string): void {
    chips.replaceChildren();

    for (const category of categories) {
      const chip = createFilterChip({
        label: category.label,
        isActive: category.slug === activeFilter,
        onClick: () => {
          renderChips(categories, category.slug);
          onFilterChange?.(category.slug);
        },
      });

      chips.append(chip);
    }
  }

  function showLoading(): void {
    chips.replaceChildren();

    const loading = document.createElement('div');
    loading.className = 'filters__loading';
    loading.textContent = 'Loading categories...';

    chips.append(loading);
  }

  function showEmpty(): void {
    chips.replaceChildren();

    const empty = document.createElement('div');
    empty.className = 'filters__empty';
    empty.textContent = 'No categories found.';

    chips.append(empty);
  }

  function showError(): void {
    chips.replaceChildren();

    const error = document.createElement('div');
    error.className = 'filters__error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load categories.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
      void loadCategories();
    });

    error.append(message, retryButton);
    chips.append(error);
  }
}
