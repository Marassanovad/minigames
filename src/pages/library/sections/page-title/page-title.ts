import './page-title.scss';

export function createPageTitle(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page-title';
  const h1 = document.createElement('h1');
  h1.textContent = 'Game Library';
  const p = document.createElement('p');
  p.textContent = 'Browse our collection of casual mini-games';

  section.append(h1, p);
  return section;
}
