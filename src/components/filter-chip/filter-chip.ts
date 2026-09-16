interface FilterChipOptions {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export function createFilterChip({
  label,
  isActive = false,
  onClick,
}: FilterChipOptions): HTMLButtonElement {
  const chip = document.createElement('button');

  chip.type = 'button';
  chip.className = 'filter-chip';
  chip.textContent = label;

  if (isActive) {
    chip.classList.add('is-active');
  }

  chip.addEventListener('click', onClick);

  return chip;
}
