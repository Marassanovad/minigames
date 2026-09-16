import choseIcon from '../../assets/icons/chose.svg?raw';

export type SortOption =
  'rating-asc' | 'rating-desc' | 'name-asc' | 'name-desc';

interface SortOptionItem {
  value: SortOption;
  label: string;
}

interface SortOptionsProps {
  value?: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: SortOptionItem[] = [
  {
    value: 'rating-asc',
    label: 'Rating ↑',
  },
  {
    value: 'rating-desc',
    label: 'Rating ↓',
  },
  {
    value: 'name-asc',
    label: 'Name A→Z',
  },
  {
    value: 'name-desc',
    label: 'Name Z→A',
  },
];

export function createSortOptions({
  value = 'rating-desc',
  onChange,
}: SortOptionsProps): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'sort-options';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sort-options__trigger';

  const triggerText = document.createElement('span');
  triggerText.className = 'sort-options__trigger-text';

  trigger.append(triggerText);

  const dropdown = document.createElement('div');
  dropdown.className = 'sort-options__dropdown';
  dropdown.hidden = true;

  function getCurrentOption(): SortOptionItem {
    return (
      SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[1]
    );
  }

  function updateTrigger(): void {
    triggerText.textContent = `Sort by: ${getCurrentOption().label}`;
  }

  function renderDropdown(): void {
    dropdown.replaceChildren();

    SORT_OPTIONS.forEach((option, index) => {
      const item = document.createElement('button');

      item.type = 'button';
      item.className = 'sort-options__item';

      const checkIcon = document.createElement('span');
      checkIcon.className = 'sort-options__item-icon';
      checkIcon.innerHTML = choseIcon;

      if (option.value !== value) {
        checkIcon.classList.add('is-hidden');
      }

      const label = document.createElement('span');
      label.className = 'sort-options__item-label';
      label.textContent = option.label;

      item.append(checkIcon, label);

      if (option.value === value) {
        item.classList.add('is-selected');
      }

      item.addEventListener('click', () => {
        value = option.value;

        updateTrigger();
        renderDropdown();
        closeDropdown();

        onChange(value);
      });

      dropdown.append(item);

      if (index < SORT_OPTIONS.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'sort-options__divider';
        dropdown.append(divider);
      }
    });
  }

  function openDropdown(): void {
    dropdown.hidden = false;

    requestAnimationFrame(() => {
      dropdown.classList.add('is-visible');
    });

    trigger.classList.add('is-open');
  }

  function closeDropdown(): void {
    dropdown.classList.remove('is-visible');
    trigger.classList.remove('is-open');

    setTimeout(() => {
      if (!dropdown.classList.contains('is-visible')) {
        dropdown.hidden = true;
      }
    }, 200);
  }

  trigger.addEventListener('click', () => {
    if (dropdown.hidden) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  updateTrigger();
  renderDropdown();

  wrapper.append(trigger, dropdown);

  return wrapper;
}
