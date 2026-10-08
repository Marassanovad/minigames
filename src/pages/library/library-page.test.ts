import { describe, expect, it, vi } from 'vitest';
import { renderLibraryPage } from './library-page';

const mocks = vi.hoisted(() => ({
  getRouteState: vi.fn(),
  navigate: vi.fn(),
  signOut: vi.fn(),
  createHeader: vi.fn(),
  createFooter: vi.fn(),
  createPaginationControl: vi.fn(),
  createPageTitle: vi.fn(),
  createFilters: vi.fn(),
  createGameLibrary: vi.fn(),
  createAuthModal: vi.fn(),
  createGameDialog: vi.fn(),
  createSnackbar: vi.fn(),
  auth: {
    currentUser: undefined as
      | {
          email: string;
        }
      | undefined,
  },
}));

vi.mock('../../app/router.ts', () => ({
  getRouteState: mocks.getRouteState,
  navigate: mocks.navigate,
}));

vi.mock('firebase/auth', () => ({
  signOut: mocks.signOut,
}));

vi.mock('../../firebase', () => ({
  auth: mocks.auth,
}));

vi.mock('../../components/header/header', () => ({
  createHeader: mocks.createHeader,
}));

vi.mock('../../components/footer/footer', () => ({
  createFooter: mocks.createFooter,
}));

vi.mock('../../components/pagination-control/pagination-control', () => ({
  createPaginationControl: mocks.createPaginationControl,
}));

vi.mock('./sections/page-title/page-title', () => ({
  createPageTitle: mocks.createPageTitle,
}));

vi.mock('./sections/filters/filters', () => ({
  createFilters: mocks.createFilters,
}));

vi.mock('./sections/game-library/game-library', () => ({
  createGameLibrary: mocks.createGameLibrary,
}));

vi.mock('../../components/auth-modals/auth-modals.ts', () => ({
  createAuthModal: mocks.createAuthModal,
}));

vi.mock('../../components/game-dialog/game-dialog.ts', () => ({
  createGameDialog: mocks.createGameDialog,
}));

vi.mock('../../components/snackbar/snackbar.ts', () => ({
  createSnackbar: mocks.createSnackbar,
}));

function createMocks() {
  const authModal = {
    modal: document.createElement('div'),
    open: vi.fn(),
  };

  mocks.createHeader.mockReturnValue(document.createElement('header'));
  mocks.createFooter.mockReturnValue(document.createElement('footer'));
  mocks.createPageTitle.mockReturnValue(document.createElement('section'));
  mocks.createFilters.mockReturnValue(document.createElement('section'));
  mocks.createGameLibrary.mockReturnValue(document.createElement('section'));
  mocks.createPaginationControl.mockImplementation(
    ({ currentPage, totalPages }) => {
      const control = document.createElement('div');
      control.dataset.currentPage = String(currentPage);
      control.dataset.totalPages = String(totalPages);
      return control;
    },
  );
  mocks.createAuthModal.mockReturnValue(authModal);

  return authModal;
}

describe('renderLibraryPage', () => {
  it('creates library page with all sections', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
    });

    const authModal = createMocks();
    const page = renderLibraryPage();

    expect(page.tagName).toBe('MAIN');
    expect(page.className).toBe('library-page');
    expect(page.children).toHaveLength(7);
    expect(authModal.modal.parentElement).toBe(page);
  });

  it('uses route state for filter, sort and page', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
      category: 'action',
      sort: 'popular',
      page: 3,
    });

    createMocks();
    renderLibraryPage();

    expect(mocks.createGameLibrary).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: 'action',
        sort: 'popular',
        page: 3,
        itemsPerPage: 6,
      }),
    );

    expect(mocks.createFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        activeFilter: 'action',
        activeSort: 'popular',
      }),
    );
  });

  it('uses default filter, sort and page', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
    });

    createMocks();
    renderLibraryPage();

    expect(mocks.createGameLibrary).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: 'all',
        sort: 'rating-desc',
        page: 1,
        itemsPerPage: 6,
      }),
    );
  });

  it('opens auth modal from route', async () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
      auth: 'login',
    });

    const authModal = createMocks();
    renderLibraryPage();

    await new Promise<void>((resolve) => {
      queueMicrotask(resolve);
    });

    expect(authModal.open).toHaveBeenCalledWith('login');
  });

  it('creates game dialog from route', async () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
      game: 'tukoni-forest-keepers',
    });

    createMocks();

    const gameDialog = document.createElement('dialog');
    Object.defineProperty(gameDialog, 'open', {
      value: false,
      writable: true,
    });
    gameDialog.showModal = vi.fn();

    mocks.createGameDialog.mockReturnValue(gameDialog);

    const page = renderLibraryPage();

    expect(mocks.createGameDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        gameSlug: 'tukoni-forest-keepers',
      }),
    );
    expect(page.contains(gameDialog)).toBe(true);

    await new Promise<void>((resolve) => {
      queueMicrotask(resolve);
    });

    expect(gameDialog.open).toBe(false);
  });

  it('shows snackbar and removes auth parameter for authenticated user', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
      auth: 'login',
    });

    mocks.auth.currentUser = {
      email: 'test@example.com',
    };

    createMocks();
    renderLibraryPage();

    expect(mocks.createSnackbar).toHaveBeenCalledWith(
      'You are already signed in.',
    );

    mocks.auth.currentUser = undefined;
  });

  it('navigates when filter changes', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
    });

    createMocks();
    renderLibraryPage();

    const options = mocks.createFilters.mock.calls[0]?.[0];

    if (!options) {
      throw new TypeError('Filter options were not provided');
    }

    options.onFilterChange('action');

    expect(mocks.navigate).toHaveBeenCalledWith({
      path: '/library',
      category: 'action',
      sort: 'rating-desc',
      page: 1,
    });
  });

  it('navigates when sort changes', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
    });

    createMocks();
    renderLibraryPage();

    const options = mocks.createFilters.mock.calls[0]?.[0];

    if (!options) {
      throw new TypeError('Filter options were not provided');
    }

    options.onSortChange('popular');

    expect(mocks.navigate).toHaveBeenCalledWith({
      path: '/library',
      category: undefined,
      sort: 'popular',
      page: 1,
    });
  });

  it('navigates when pagination changes', () => {
    mocks.getRouteState.mockReturnValue({
      path: '/library',
      category: 'action',
      sort: 'popular',
      page: 1,
    });

    createMocks();
    renderLibraryPage();

    const options = mocks.createPaginationControl.mock.calls[0]?.[0];

    if (!options) {
      throw new TypeError('Pagination options were not provided');
    }

    options.onPageChange(2);

    expect(mocks.navigate).toHaveBeenCalledWith({
      path: '/library',
      category: 'action',
      sort: 'popular',
      page: 2,
    });
  });
});
