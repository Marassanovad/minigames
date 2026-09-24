import './google-button.scss'
import googleIcon from '../../../assets/icons/goggle.svg?raw';

export function createGoogleButton(onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'google-button';

    const icon = document.createElement('span');
    icon.className = 'google-button__icon';
    icon.innerHTML = googleIcon;

    const text = document.createElement('span');
    text.className = 'google-button__text';
    text.textContent = 'Continue with Google';

    button.append(icon, text);

    button.addEventListener('click', onClick);

    return button;
}