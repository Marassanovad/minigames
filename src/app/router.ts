import { renderHomePage } from '../pages/home/home-page';
import { renderLibraryPage } from '../pages/library/library-page';

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

function renderPage(app: HTMLElement): void {
  const path = window.location.pathname;
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

  event.preventDefault();

  window.history.pushState({}, '', link.pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
