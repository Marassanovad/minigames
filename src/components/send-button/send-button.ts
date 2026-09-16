import sendIcon from '../../assets/icons/send.svg?raw';
import './send-button.scss';

export function createSendButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'send-button';
  button.setAttribute('aria-label', 'Send');

  const icon = document.createElement('span');
  icon.innerHTML = sendIcon;

  button.append(icon);

  button.addEventListener('click', onClick);

  return button;
}
