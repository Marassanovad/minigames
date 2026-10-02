import './library-page.scss';

import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { createPaginationControl } from '../../components/pagination-control/pagination-control';
import { createPageTitle } from './sections/page-title/page-title';
import { createFilters } from './sections/filters/filters';
import { createGameLibrary } from './sections/game-library/game-library';
import { createAuthModal } from '../../components/auth-modals/auth-modals.ts';
import { createGameDialog } from '../../components/game-dialog/game-dialog.ts';

import type { SortOption } from '../../types/sort.ts';

import { getRouteState, navigate } from '../../app/router.ts';

const ITEMS_PER_PAGE = 6;

export function renderLibraryPage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'library-page';

  const route = getRouteState();

  let activeFilter = route.category ?? 'all';

  let activeSort: SortOption =
    (route.sort as SortOption | undefined) ?? 'rating-desc';

  let currentPage = route.page ?? 1;

  let totalPages = 1;

  const authModal = createAuthModal(
    'login',
    () => {
      navigate({
        path: '/library',
        category: activeFilter === 'all' ? undefined : activeFilter,
        sort: activeSort,
        page: currentPage,
        auth: undefined,
        game: route.game,
      });
    },
    (tab) => {
      navigate({
        path: '/library',
        category: activeFilter === 'all' ? undefined : activeFilter,
        sort: activeSort,
        page: currentPage,
        auth: tab,
        game: route.game,
      });
    },
  );

  const header = createHeader({
    onLogin: () => {
      navigate({
        path: '/library',
        category: activeFilter === 'all' ? undefined : activeFilter,
        sort: activeSort,
        page: currentPage,
        auth: 'login',
        game: route.game,
      });
    },

    onSignup: () => {
      navigate({
        path: '/library',
        category: activeFilter === 'all' ? undefined : activeFilter,
        sort: activeSort,
        page: currentPage,
        auth: 'register',
        game: route.game,
      });
    },
  });

  const title = createPageTitle();

  const library = createGameLibrary({
    filter: activeFilter,
    sort: activeSort,
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,

    onTotalPagesChange: (pages) => {
      totalPages = pages;
      updatePagination();
    },
  });

  const paginationSection = document.createElement('section');
  paginationSection.className = 'pagination-section';

  let pagination = createPagination();

  const filters = createFilters({
    activeFilter,
    activeSort,

    onFilterChange: (filter) => {
      activeFilter = filter;
      currentPage = 1;

      navigate({
        path: '/library',
        category: filter === 'all' ? undefined : filter,
        sort: activeSort,
        page: currentPage,
      });
    },

    onSortChange: (sort) => {
      activeSort = sort;
      currentPage = 1;

      navigate({
        path: '/library',
        category: activeFilter === 'all' ? undefined : activeFilter,
        sort,
        page: currentPage,
      });
    },
  });

  const footer = createFooter();

  const gameDialog = route.game
    ? createGameDialog({
        gameSlug: route.game,

        onClose: () => {
          navigate({
            path: '/library',
            category: activeFilter === 'all' ? undefined : activeFilter,
            sort: activeSort,
            page: currentPage,
            game: undefined,
            auth: undefined,
          });
        },
      })
    : undefined;

  page.append(
    header,
    title,
    filters,
    library,
    paginationSection,
    footer,
    authModal.modal,
  );

  if (gameDialog) {
    page.append(gameDialog);

    queueMicrotask(() => {
      if (!gameDialog.open) {
        gameDialog.showModal();
      }
    });
  }

  if (route.auth) {
    queueMicrotask(() => {
      authModal.open(route.auth!);
    });
  }

  return page;

  function updatePagination(): void {
    const newPagination = createPagination();

    pagination.replaceWith(newPagination);
    pagination = newPagination;
  }

  function createPagination(): HTMLDivElement {
    const control = createPaginationControl({
      currentPage,
      totalPages,

      onPageChange: (page) => {
        currentPage = page;

        navigate({
          path: '/library',
          category: activeFilter === 'all' ? undefined : activeFilter,
          sort: activeSort,
          page: currentPage,
        });
      },
    });

    paginationSection.replaceChildren(control);

    return control;
  }
}
