import './filters.scss';
import { createFilterChip } from '../../../../components/filter-chip/filter-chip';
import { createSortOptions } from '../../../../components/sort-options/sort-options';
import type { SortOption } from '../../../../components/sort-options/sort-options';
import categoriesData from '../../../../data/categories.json';

interface GameCategory {
  slug: string;
  label: string;
  isDefault: boolean;
}

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
  const categories = categoriesData.data as GameCategory[];
  let activeFilter =
    categories.find((category) => category.isDefault)?.slug ??
    categories[0]?.slug ??
    'all';
  const dropdown = createSortOptions({
    value: 'rating-desc',
    onChange: (sort) => {
      onSortChange?.(sort);
    },
  });
  section.append(chips, dropdown);
  renderChips();
  return section;

  function renderChips(): void {
    chips.replaceChildren();
    categories.forEach((category) => {
      const chip = createFilterChip({
        label: category.label,
        isActive: category.slug === activeFilter,
        onClick: () => {
          activeFilter = category.slug;
          renderChips();
          onFilterChange?.(activeFilter);
        },
      });
      chips.append(chip);
    });
  }
}
