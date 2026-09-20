import { renderHomePage } from '../pages/home/home-page';
import { renderLibraryPage } from '../pages/library/library-page';

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

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

  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || '/';
  }

  return pathname || '/';
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

  const linkPath = link.pathname;

  if (!linkPath.startsWith(BASE_PATH)) {
    return;
  }

  event.preventDefault();

  const routePath = linkPath.slice(BASE_PATH.length) || '/';

  window.history.pushState({}, '', `${BASE_PATH}${routePath}`);

  window.dispatchEvent(new PopStateEvent('popstate'));
}
