import './menu-link.scss';

export function createMenuLink(
  content: string,
  href: string,
  isActive = false,
): HTMLAnchorElement {
  const link = document.createElement('a');

  link.className = `menu-link`;
  link.href = href;

  link.textContent = content;

  if (isActive) {
    link.classList.add('is-active');
  }

  link.addEventListener('click', () => {
    globalThis.location.assign(href);
  });

  return link;
}
