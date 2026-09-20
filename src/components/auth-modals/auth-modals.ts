import './auth-modals.scss';
import googleIcon from '../../assets/icons/goggle.svg?raw';
import {
  createAuthTabSwitcher,
  type AuthTab,
} from './auth-tab-switcher/auth-tab-switcher';
import { createTextInputField } from './text-input-field/text-input-field';
import { createPlayOrDetailsButton } from '../play-or-details-button/play-or-details-button.ts';
import { createTextLink } from '../text-link/text-link.ts';
import { createDivider } from './divider/divider.ts';

interface AuthModal {
  modal: HTMLDialogElement;
  open: (tab: AuthTab) => void;
}

export function createAuthModal(initialTab: AuthTab = 'login'): AuthModal {
  const modal = document.createElement('dialog');
  modal.className = 'auth-modal';

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  let activeTab = initialTab;

  const container = document.createElement('div');
  container.className = 'auth-modal__container';

  const content = document.createElement('div');
  content.className = 'auth-modal__content';

  const tabSwitcherContainer = document.createElement('div');
  tabSwitcherContainer.className = 'auth-modal__tabs';

  const header_container = document.createElement('div');
  header_container.className = 'auth-modal__header';

  const title = document.createElement('h2');
  title.className = 'auth-modal__title';

  const description = document.createElement('p');
  description.className = 'auth-modal__description';

  header_container.append(title, description);

  const form = document.createElement('form');
  form.className = 'auth-modal__form';

  const footer = document.createElement('div');
  footer.className = 'auth-modal__footer';

  const footerText = document.createElement('span');
  footerText.className = 'auth-modal__footer-text';

  const footerButton = createTextLink('', '');

  footer.append(footerText, footerButton);

  function render(): void {
    tabSwitcherContainer.innerHTML = '';

    const tabSwitcher = createAuthTabSwitcher(activeTab, (tab: AuthTab) => {
      activeTab = tab;
      render();
    });

    tabSwitcherContainer.append(tabSwitcher);

    title.textContent =
      activeTab === 'login' ? 'Welcome Back!' : 'Create Account';

    description.textContent =
      activeTab === 'login'
        ? 'Sign in to resume your games and progress.'
        : 'Join MiniGames to track your score & streak.';

    form.innerHTML = '';

    if (activeTab === 'login') {
      renderLogin();
    } else {
      renderRegister();
    }
  }

  function renderLogin(): void {
    const emailField = createTextInputField({
      label: 'Email',
      type: 'email',
      icon: 'email',
      placeholder: 'e.g. alex@minigames.com',
      autocomplete: 'email',
    });

    const passwordField = createTextInputField({
      label: 'Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Enter your password',
      autocomplete: 'current-password',
    });

    const forgotPassword = createTextLink('', '');
    forgotPassword.textContent = 'Forgot password?';

    const loginButton = createPlayOrDetailsButton({
      variant: 'play',
      title: 'Login',
      onClick: () => {},
    });

    const divider = createDivider();

    const googleButton = createGoogleButton(() => {
      console.log('Login with Google');
    });

    form.append(
      emailField,
      passwordField,
      forgotPassword,
      loginButton,
      divider,
      googleButton,
    );

    footerText.textContent = "Don't have an account?";

    footerButton.textContent = 'Register';
  }

  function renderRegister(): void {
    const usernameField = createTextInputField({
      label: 'Username',
      type: 'text',
      icon: 'text',
      placeholder: 'Enter your username',
      autocomplete: 'username',
    });

    const emailField = createTextInputField({
      label: 'Email',
      type: 'email',
      icon: 'email',
      placeholder: 'e.g. alex@minigames.com',
      autocomplete: 'email',
    });

    const passwordField = createTextInputField({
      label: 'Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Enter your password',
      autocomplete: 'new-password',
    });

    const confirmPasswordField = createTextInputField({
      label: 'Confirm Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Confirm your password',
      autocomplete: 'new-password',
    });

    const registerButton = createPlayOrDetailsButton({
      variant: 'play',
      title: 'Login',
      onClick: () => {},
    });

    const divider = createDivider();

    const googleButton = createGoogleButton(() => {
      console.log('Login with Google');
    });

    form.append(
      usernameField,
      emailField,
      passwordField,
      confirmPasswordField,
      registerButton,
      divider,
      googleButton,
    );

    footerText.textContent = 'Already have an account?';

    footerButton.textContent = 'Log In';
  }

  footerButton.addEventListener('click', () => {
    activeTab = activeTab === 'login' ? 'register' : 'login';

    render();
  });

  content.append(tabSwitcherContainer, header_container, form, footer);

  container.append(content);
  modal.append(container);

  render();

  return {
    modal,

    open: (tab: AuthTab) => {
      activeTab = tab;

      render();

      if (!modal.open) {
        modal.showModal();
      }
    },
  };

  function createGoogleButton(onClick: () => void): HTMLButtonElement {
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
}
