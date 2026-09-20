import closeIcon from '../../assets/icons/close.svg?raw';
import './burger-close-button.scss';

export function createBurgerCloseButton(
  onClick: () => void,
): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'burger-close-button';
  button.setAttribute('aria-label', 'Close');

  const icon = document.createElement('span');
  icon.innerHTML = closeIcon;

  button.append(icon);

  button.addEventListener('click', onClick);

  return button;
}
