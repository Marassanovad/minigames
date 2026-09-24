import './mobile-menu.scss';

import { navigationLinks } from '../../../data/navigation-links';
import logoIcon from '../../../assets/icons/logo.svg';
import { createBurgerCloseButton } from '../burger-close-button.ts';
import { createMenuLink } from '../../menu-link/menu-link.ts';
import { createAuthButton } from '../../auth-button/auth-button.ts';

interface MobileMenuOptions {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
}

export function createMobileMenu({
  isAuthenticated,
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
}: MobileMenuOptions): HTMLElement {
  const menu = document.createElement('aside');
  menu.className = 'mobile-menu';

  const header = document.createElement('div');
  header.className = 'mobile-menu__header';

  const logo = createLogo();

  const closeButton = createBurgerCloseButton(() => {
    closeMenu(menu);
  });

  header.append(logo, closeButton);

  const nav = document.createElement('nav');
  nav.className = 'mobile-menu__nav';

  for (const { label, href } of navigationLinks) {
    const isActive = globalThis.location.pathname === href;

    const link = createMenuLink(label, href, isActive);
    nav.append(link);
  }

  const actions = document.createElement('div');
  actions.className = 'mobile-menu__actions';

  if (isAuthenticated) {
    const logout = createAuthButton('logout', onLogout, 'dark');
    actions.append(logout);
  } else {
    const login = createAuthButton('login', onLogin, 'dark');

    const signup = createAuthButton('signup', onSignup, 'light');

    actions.append(login, signup);
  }

  menu.append(header, nav, actions);

  return menu;
}

export function openMenu(menu: HTMLElement): void {
  menu.classList.add('mobile-menu--open');
  document.body.classList.add('menu-open');
}

export function closeMenu(menu: HTMLElement): void {
  menu.classList.remove('mobile-menu--open');
  document.body.classList.remove('menu-open');
}

function createLogo(): HTMLAnchorElement {
  const logo = document.createElement('a');

  logo.className = 'mobile-menu__logo';
  logo.href = '/';

  const icon = document.createElement('img');
  icon.src = logoIcon;
  icon.alt = '';

  const text = document.createElement('span');
  text.textContent = 'MiniGames';

  logo.append(icon, text);

  return logo;
}
