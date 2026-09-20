import './footer-link.scss';

type FooterLinkVariant = 'text' | 'icon';

export function createFooterLink(
  variant: FooterLinkVariant,
  content: string,
  href: string,
  icon?: string,
): HTMLAnchorElement {
  const link = document.createElement('a');

  link.className = `footer-link footer-link--${variant}`;
  link.href = href;

  if (variant === 'text') {
    link.textContent = content;
  } else if (icon) {
    const iconElement = document.createElement('span');
    iconElement.innerHTML = icon;

    link.append(iconElement);
  }

  return link;
}
