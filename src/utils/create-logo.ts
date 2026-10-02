import logoIcon from '../assets/icons/logo.svg';

export function createLogo(): HTMLAnchorElement {
  const logo = document.createElement('a');

  logo.href = '/';

  const icon = document.createElement('img');
  icon.src = logoIcon;
  icon.alt = '';

  const text = document.createElement('span');
  text.textContent = 'MiniGames';

  logo.append(icon, text);

  return logo;
}
