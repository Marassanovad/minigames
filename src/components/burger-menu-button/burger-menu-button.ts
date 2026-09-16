import burgerMenuIcon from '../../assets/icons/burger-menu.svg?raw';

export function createBurgerMenuButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'burger-menu-button';
  button.setAttribute('aria-label', 'Open Menu');

  const icon = document.createElement('span');
  icon.innerHTML = burgerMenuIcon;

  button.append(icon);

  button.addEventListener('click', onClick);

  return button;
}
