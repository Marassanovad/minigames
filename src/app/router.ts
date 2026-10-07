import { renderHomePage } from '../pages/home/home-page';
import { renderLibraryPage } from '../pages/library/library-page';
import { renderNotFoundPage } from '../pages/not-found/not-found.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const BASE_PATH = '/minigames';

const routes: Record<string, () => HTMLElement> = {
  '/': renderHomePage,
  '/home': renderHomePage,
  '/library': renderLibraryPage,
};

export interface RouteState {
  path: string;
  category?: string;
  sort?: string;
  page?: number;
  game?: string;
  auth?: 'login' | 'register';
}

export async function initRouter(): Promise<void> {
  const app = document.querySelector<HTMLElement>('#app');

  if (!app) {
    return;
  }

  renderPage(app);

  onAuthStateChanged(auth, () => {
    renderPage(app);
  });

  document.addEventListener('click', handleNavigation);

  globalThis.addEventListener('popstate', () => {
    renderPage(app);
  });
}

export function getRouteState(): RouteState {
  const url = new URL(globalThis.location.href);

  const page = url.searchParams.get('page');

  return {
    path: getRoutePath(url.pathname),
    category: url.searchParams.get('category') ?? undefined,
    sort: url.searchParams.get('sort') ?? undefined,
    page: page ? Number(page) : undefined,
    game: url.searchParams.get('game') ?? undefined,
    auth: getAuthMode(url.searchParams.get('auth')),
  };
}

export function navigate(state: Partial<RouteState>): void {
  const url = new URL(globalThis.location.href);

  if (state.path !== undefined) {
    url.pathname = getFullPath(state.path);
  }

  setQueryParameter(url, 'category', state.category);

  setQueryParameter(url, 'sort', state.sort);

  setQueryParameter(url, 'page', state.page?.toString());

  setQueryParameter(url, 'game', state.game);

  setQueryParameter(url, 'auth', state.auth);

  globalThis.history.pushState({}, '', url);

  globalThis.dispatchEvent(new PopStateEvent('popstate'));
}

function renderPage(app: HTMLElement): void {
  const path = getRoutePath(globalThis.location.pathname);
  const render = routes[path] ?? renderNotFoundPage;

  app.replaceChildren(render());
}

function handleNavigation(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest('a');

  if (
    !link ||
    link.target === '_blank' ||
    link.origin !== globalThis.location.origin
  ) {
    return;
  }

  event.preventDefault();

  const url = new URL(link.href, globalThis.location.href);

  globalThis.history.pushState({}, '', url);

  globalThis.dispatchEvent(new PopStateEvent('popstate'));
}

function getRoutePath(pathname: string): string {
  return pathname === BASE_PATH || pathname === `${BASE_PATH}/`
    ? '/'
    : pathname.replace(BASE_PATH, '') || '/';
}

function getFullPath(path: string): string {
  return path === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

function setQueryParameter(
  url: URL,
  key: string,
  value: string | undefined,
): void {
  if (value === undefined) {
    url.searchParams.delete(key);
    return;
  }
  url.searchParams.set(key, value);
}

function getAuthMode(value: string | null): 'login' | 'register' | undefined {
  return value === 'login' || value === 'register' ? value : undefined;
}
