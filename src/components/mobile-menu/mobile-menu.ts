export function createMobileMenu(
  content: string,
  href: string,
): HTMLAnchorElement {
  const link = document.createElement('a');

  link.className = `mobile-menu`;
  link.href = href;

  link.textContent = content;

  return link;
}
