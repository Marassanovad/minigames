import sendIcon from '../../assets/icons/send.svg?raw';
import './send-button.scss';

export interface SendButtonElement extends HTMLButtonElement {
  setLoading: (isLoading: boolean) => void;
}

export function createSendButton(onClick: () => void): SendButtonElement {
  const button = document.createElement('button') as SendButtonElement;

  button.type = 'button';
  button.className = 'send-button';
  button.setAttribute('aria-label', 'Send');

  const icon = document.createElement('span');
  icon.innerHTML = sendIcon;

  button.append(icon);

  button.addEventListener('click', onClick);

  button.setLoading = (isLoading: boolean): void => {
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);
  };

  return button;
}
