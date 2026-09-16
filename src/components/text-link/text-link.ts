import './text-link.scss';

export function createTextLink(
  content: string,
  href: string,
): HTMLAnchorElement {
  const link = document.createElement('a');

  link.className = `text-link`;
  link.href = href;

  link.textContent = content;

  return link;
}
