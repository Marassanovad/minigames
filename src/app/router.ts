import { renderHomePage } from '../pages/home/home-page';
import { renderLibraryPage } from '../pages/library/library-page';

const BASE_PATH = '/minigames';

const routes: Record<string, () => HTMLElement> = {
  '/': renderHomePage,
  '/library': renderLibraryPage,
};

export function initRouter(): void {
  const app = document.querySelector<HTMLElement>('#app');

  if (!app) {
    return;
  }

  renderPage(app);

  document.addEventListener('click', handleNavigation);
  window.addEventListener('popstate', () => renderPage(app));
}

function getRoutePath(): string {
  const pathname = window.location.pathname;

  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) {
    return '/';
  }

  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length);
  }

  return pathname;
}

function renderPage(app: HTMLElement): void {
  const path = getRoutePath();
  const render = routes[path] ?? renderHomePage;

  app.replaceChildren(render());
}

function handleNavigation(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest('a');

  if (!link || link.target === '_blank') {
    return;
  }

  if (link.origin !== window.location.origin) {
    return;
  }

  const href = link.getAttribute('href');

  if (!href || !href.startsWith('/')) {
    return;
  }

  event.preventDefault();

  const path = href === '/' ? '' : href;
  const url = `${BASE_PATH}${path}`;

  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
