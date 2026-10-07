import { createAuthButton } from '../auth-button/auth-button';
import { createBurgerMenuButton } from '../burger-menu-button/burger-menu-button';
import './header.scss';
import { navigationLinks } from '../../data/navigation-links.ts';
import {
  closeMenu,
  createMobileMenu,
  openMenu,
} from '../burger-menu-button/mobile-menu/mobile-menu.ts';
import { createUserAvatar } from '../../utils/create-avatar.ts';
import { createLogo } from '../../utils/create-logo.ts';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface HeaderOptions {
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

export function createHeader({
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
  onMenuClick = () => {},
}: HeaderOptions = {}): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';

  const logo = createLogo();
  logo.className = 'header__logo';

  const navActions = document.createElement('div');
  navActions.className = 'header__nav-actions';

  const navigation = createNavigation();
  navActions.append(navigation);

  const actions = document.createElement('div');
  actions.className = 'header__actions';

  const mobileMenu = createMobileMenu({
    isAuthenticated: auth.currentUser !== null,
    onLogin: () => {
      closeMenu(mobileMenu);
      onLogin();
    },
    onSignup: () => {
      closeMenu(mobileMenu);
      onSignup();
    },
    onLogout: () => {
      closeMenu(mobileMenu);
      onLogout();
    },
  });

  const burgerButton = createBurgerMenuButton(() => {
    openMenu(mobileMenu);
    onMenuClick();
  });
  burgerButton.classList.add('header__burger-menu');

  navActions.append(actions, burgerButton);

  document.body.append(mobileMenu);

  header.append(logo, navActions);

  onAuthStateChanged(auth, (currentUser) => {
    actions.replaceChildren();

    const isAuthenticated = currentUser !== null;

    if (isAuthenticated) {
      const profileName =
        currentUser.displayName?.trim() ||
        currentUser.email?.split('@', 1)[0] ||
        'User';

      const user = document.createElement('div');
      user.className = 'header__user';

      const usernameElement = document.createElement('span');
      usernameElement.className = 'header__user-name';
      usernameElement.textContent = profileName;

      const avatar = createUserAvatar(profileName, currentUser.photoURL);
      avatar.className = 'header__user-avatar';

      const logoutButton = createAuthButton('logout', onLogout);

      user.append(usernameElement, avatar);
      actions.append(user, logoutButton);
    } else {
      const loginButton = createAuthButton('login', onLogin);
      const signupButton = createAuthButton('signup', onSignup);

      actions.append(loginButton, signupButton);
    }
  });

  return header;
}

function createNavigation(): HTMLElement {
  const navigation = document.createElement('nav');
  navigation.className = 'header__navigation';
  const currentPath = globalThis.location.pathname;
  for (const { label, href } of navigationLinks) {
    const link = document.createElement('a');
    link.className = 'header__nav-link';
    link.href = href;
    link.textContent = label;
    const homePaths = ['/minigames', '/minigames/', '/minigames/home'];
    const isHome = href === '/minigames/' && homePaths.includes(currentPath);
    if (currentPath === href || isHome) {
      link.classList.add('is-active');
    }
    navigation.append(link);
  }
  return navigation;
}
