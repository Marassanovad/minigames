import { renderHomePage } from '../pages/home/home-page';

export function initRouter(): void {
  const app = document.querySelector('#app');

  if (!app) {
    return;
  }

  app.append(renderHomePage());
}
