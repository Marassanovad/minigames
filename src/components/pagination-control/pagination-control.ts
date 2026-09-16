import chevronBackwardIcon from '../../assets/icons/left.svg?raw';
import chevronForwardIcon from '../../assets/icons/right.svg?raw';
import './pagination-control.scss';

interface PaginationControlOptions {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function createPaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlOptions): HTMLDivElement {
  // const container = document.createElement('div');
  //
  // container.className = 'pagination-control';

  const controls = document.createElement('div');

  controls.className = 'pagination-control';

  const prevButton = createArrowButton('Previous page', chevronBackwardIcon);

  prevButton.disabled = currentPage === 1;

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  });

  controls.append(prevButton);

  const pages = getVisiblePages(currentPage, totalPages);

  pages.forEach((page) => {
    const pageButton = createPageButton(page, page === currentPage);

    pageButton.addEventListener('click', () => {
      onPageChange(page);
    });

    controls.append(pageButton);
  });

  const nextButton = createArrowButton('Next page', chevronForwardIcon);

  nextButton.disabled = currentPage === totalPages;

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  });

  controls.append(nextButton);

  return controls;
}

function createPageButton(page: number, isActive: boolean): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'pagination-control__page';
  button.textContent = String(page);

  if (isActive) {
    button.classList.add('is-active');
  }

  return button;
}

function createArrowButton(label: string, icon: string): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'pagination-control__arrow';
  button.setAttribute('aria-label', label);

  const iconElement = document.createElement('span');

  iconElement.className = 'pagination-control__icon';
  iconElement.innerHTML = icon;

  button.append(iconElement);

  return button;
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const maxVisiblePages = 4;

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.min(
    Math.max(currentPage - 1, 1),
    totalPages - maxVisiblePages + 1,
  );

  return Array.from(
    { length: maxVisiblePages },
    (_, index) => startPage + index,
  );
}
