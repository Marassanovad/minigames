import chevronBackwardIcon from '../../assets/icons/left.svg?raw';
import chevronForwardIcon from '../../assets/icons/right.svg?raw';
import './pagination-control.scss';

interface PaginationControlOptions {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hidePages?: boolean;
  isLoop?: boolean;
}

export function createPaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  hidePages = false,
  isLoop = false,
}: PaginationControlOptions): HTMLDivElement {
  const controls = document.createElement('div');

  controls.className = 'pagination-control';

  let activePage = currentPage;

  const prevButton = createArrowButton('Previous page', chevronBackwardIcon);

  prevButton.disabled = !isLoop && activePage === 1;

  prevButton.addEventListener('click', () => {
    if (isLoop) {
      activePage = activePage === 1 ? totalPages : activePage - 1;

      onPageChange(activePage);
      return;
    }

    if (activePage > 1) {
      activePage -= 1;
      onPageChange(activePage);
    }
  });

  controls.append(prevButton);

  if (!hidePages) {
    const pages = getVisiblePages(activePage, totalPages);

    pages.forEach((page) => {
      const pageButton = createPageButton(page, page === activePage);

      pageButton.addEventListener('click', () => {
        activePage = page;
        onPageChange(activePage);
      });

      controls.append(pageButton);
    });
  }

  const nextButton = createArrowButton('Next page', chevronForwardIcon);

  nextButton.disabled = !isLoop && activePage === totalPages;

  nextButton.addEventListener('click', () => {
    if (isLoop) {
      activePage = activePage === totalPages ? 1 : activePage + 1;

      onPageChange(activePage);
      return;
    }

    if (activePage < totalPages) {
      activePage += 1;
      onPageChange(activePage);
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
