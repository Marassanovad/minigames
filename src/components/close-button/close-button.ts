import closeIcon from '../../assets/icons/close.svg?raw';

export function createCloseButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'close-button';
  button.setAttribute('aria-label', 'Close');

  const icon = document.createElement('span');
  icon.innerHTML = closeIcon;

  button.append(icon);

  button.addEventListener('click', onClick);

  return button;
}
