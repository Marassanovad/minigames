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
  globalThis.addEventListener('popstate', () => renderPage(app));
}

function renderPage(app: HTMLElement): void {
  const pathname = globalThis.location.pathname;

  const path =
    pathname === BASE_PATH || pathname === `${BASE_PATH}/`
      ? '/'
      : pathname.replace(BASE_PATH, '');

  const render = routes[path] ?? renderHomePage;

  app.replaceChildren(render());
}

function handleNavigation(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest('a');

  if (!link || link.target === '_blank' || (link.origin !== globalThis.location.origin)) {
    return;
  }

  event.preventDefault();

  globalThis.history.pushState({}, '', link.pathname);
  globalThis.dispatchEvent(new PopStateEvent('popstate'));
}
