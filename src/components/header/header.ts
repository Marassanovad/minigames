import { createAuthButton } from '../auth-button/auth-button';
import { createBurgerMenuButton } from '../burger-menu-button/burger-menu-button';
import './header.scss';
import logoIcon from '../../assets/icons/logo.svg';
import { navigationLinks } from '../../app/navigation-links.ts';

interface HeaderOptions {
  userName?: string;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

export function createHeader({
  userName = '',
  isAuthenticated = false,
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
  onMenuClick = () => {},
}: HeaderOptions = {}): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';

  const logo = createLogo();

  const navActions = document.createElement('div');
  navActions.className = 'header__nav-actions';

  const actions = document.createElement('div');
  actions.className = 'header__actions';

  const navigation = createNavigation();
  navActions.append(navigation);

  if (isAuthenticated) {
    const user = document.createElement('div');
    user.className = 'header__user';

    const userNameElement = document.createElement('span');
    userNameElement.className = 'header__user-name';
    userNameElement.textContent = userName;

    const avatar = createUserAvatar(userName);

    const logoutButton = createAuthButton('logout', onLogout);

    user.append(userNameElement, avatar);
    navActions.append(user, logoutButton);
  } else {
    const loginButton = createAuthButton('login', onLogin);
    const signupButton = createAuthButton('signup', onSignup);

    actions.append(loginButton, signupButton);
    navActions.append(actions);
  }

  const burgerButton = createBurgerMenuButton(onMenuClick);
  burgerButton.className = 'header__burger-menu';
  navActions.append(burgerButton);

  header.append(logo, navActions);

  return header;
}

function createLogo(): HTMLAnchorElement {
  const logo = document.createElement('a');

  logo.className = 'header__logo';
  logo.href = '/';

  const icon = document.createElement('img');
  icon.src = logoIcon;
  icon.alt = '';

  const text = document.createElement('span');
  text.textContent = 'MiniGames';

  logo.append(icon, text);

  return logo;
}

function createNavigation(): HTMLElement {
  const navigation = document.createElement('nav');

  navigation.className = 'header__navigation';
  const currentPath = window.location.pathname;

  navigationLinks.forEach(({ label, href }) => {
    const link = document.createElement('a');

    link.className = 'header__nav-link';
    link.href = href;
    link.textContent = label;

    if (currentPath === href) {
      link.classList.add('is-active');
    }

    navigation.append(link);
  });

  return navigation;
}

function createUserAvatar(userName: string): HTMLDivElement {
  const avatar = document.createElement('div');
  avatar.className = 'header__user-avatar';

  const nameParts = userName.trim().split(/\s+/);

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : (nameParts[0]?.[0] ?? '');

  avatar.textContent = initials.toUpperCase();

  return avatar;
}
