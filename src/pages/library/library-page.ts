import './library-page.scss';

import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { createPaginationControl } from '../../components/pagination-control/pagination-control';
import { createPageTitle } from './sections/page-title/page-title';
import { createFilters } from './sections/filters/filters';
import {
  createGameLibrary,
  getGameLibraryTotalPages,
} from './sections/game-library/game-library';
import type { SortOption } from '../../components/sort-options/sort-options';

const ITEMS_PER_PAGE = 6;

export function renderLibraryPage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'library-page';

  const header = createHeader();
  const title = createPageTitle();

  let activeFilter = 'all';
  let activeSort: SortOption = 'rating-desc';
  let currentPage = 1;

  let library = createGameLibrary({
    filter: activeFilter,
    sort: activeSort,
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const paginationSection = document.createElement('section');
  paginationSection.className = 'pagination-section';

  let pagination = createPagination();

  const filters = createFilters({
    onFilterChange: (filter) => {
      activeFilter = filter;
      currentPage = 1;

      updateLibrary();
    },

    onSortChange: (sort) => {
      activeSort = sort;
      currentPage = 1;

      updateLibrary();
    },
  });

  const footer = createFooter();

  page.append(header, title, filters, library, paginationSection, footer);

  return page;

  function updateLibrary(): void {
    const newLibrary = createGameLibrary({
      filter: activeFilter,
      sort: activeSort,
      page: currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
    });

    library.replaceWith(newLibrary);
    library = newLibrary;

    const newPagination = createPagination();

    pagination.replaceWith(newPagination);
    pagination = newPagination;
  }

  function createPagination(): HTMLDivElement {
    const totalPages = getGameLibraryTotalPages(activeFilter, ITEMS_PER_PAGE);

    const control = createPaginationControl({
      currentPage,
      totalPages,
      onPageChange: (page) => {
        currentPage = page;
        updateLibrary();
      },
    });

    paginationSection.replaceChildren(control);

    return control;
  }
}
