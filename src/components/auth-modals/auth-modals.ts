import './auth-modals.scss';
import {
  createAuthTabSwitcher,
  type AuthTab,
} from './auth-tab-switcher/auth-tab-switcher';
import { createTextInputField } from './text-input-field/text-input-field';
import { createPlayOrDetailsButton } from '../play-or-details-button/play-or-details-button.ts';
import { createTextLink } from '../text-link/text-link.ts';
import { createDivider } from './divider/divider.ts';
import { createGoogleButton } from './google-button/google-button.ts';

interface AuthModal {
  modal: HTMLDialogElement;
  open: (tab: AuthTab) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Z][A-Za-z0-9]{1,29}$/;
const PASSWORD_SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_DIGIT_REGEX = /\d/;

function isValidEmail(value: string): boolean {
  return value.length > 0 && EMAIL_REGEX.test(value);
}

function isValidUsername(value: string): boolean {
  return USERNAME_REGEX.test(value);
}

function isValidRegisterPassword(value: string): boolean {
  return (
    value.length >= 6 &&
    PASSWORD_UPPERCASE_REGEX.test(value) &&
    PASSWORD_DIGIT_REGEX.test(value) &&
    PASSWORD_SPECIAL_CHARACTER_REGEX.test(value)
  );
}

function isValidLoginPassword(value: string): boolean {
  return value.length >= 6;
}

export function createAuthModal(
  initialTab: AuthTab = 'login',
  onClose?: () => void,
  onTabChange?: (tab: AuthTab) => void,
): AuthModal {
  const modal = document.createElement('dialog');
  modal.className = 'auth-modal';
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
  modal.addEventListener('close', () => {
    onClose?.();
  });
  let activeTab = initialTab;
  const container = document.createElement('div');
  container.className = 'auth-modal__container';
  const content = document.createElement('div');
  content.className = 'auth-modal__content';
  const tabSwitcherContainer = document.createElement('div');
  tabSwitcherContainer.className = 'auth-modal__tabs';
  const headerContainer = document.createElement('div');
  headerContainer.className = 'auth-modal__header';
  const title = document.createElement('h2');
  title.className = 'auth-modal__title';
  const description = document.createElement('p');
  description.className = 'auth-modal__description';
  headerContainer.append(title, description);
  const form = document.createElement('form');
  form.className = 'auth-modal__form';
  const footer = document.createElement('div');
  footer.className = 'auth-modal__footer';
  const footerText = document.createElement('span');
  footerText.className = 'auth-modal__footer-text';
  const footerButton = createTextLink('', '');
  footer.append(footerText, footerButton);

  function render(): void {
    tabSwitcherContainer.replaceChildren();
    const tabSwitcher = createAuthTabSwitcher(activeTab, (tab: AuthTab) => {
      activeTab = tab;
      onTabChange?.(tab);
      render();
    });
    tabSwitcherContainer.append(tabSwitcher);
    title.textContent =
      activeTab === 'login' ? 'Welcome Back!' : 'Create Account';
    description.textContent =
      activeTab === 'login'
        ? 'Sign in to resume your games and progress.'
        : 'Join MiniGames to track your score & streak.';
    form.replaceChildren();
    if (activeTab === 'login') {
      renderLogin();
    } else {
      renderRegister();
    }
  }

  function renderLogin(): void {
    let isEmailValid = false;
    let isPasswordValid = false;
    const emailField = createTextInputField({
      label: 'Email',
      type: 'email',
      icon: 'email',
      placeholder: 'e.g. alex@minigames.com',
      autocomplete: 'email',
      errorMessage: 'Please enter a valid email address',
      validate: isValidEmail,
      onValidChange: (isValid) => {
        isEmailValid = isValid;
        updateSubmitButton();
      },
    });
    const passwordField = createTextInputField({
      label: 'Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Enter your password',
      autocomplete: 'current-password',
      errorMessage: 'Password must be at least 6 characters long',
      validate: isValidLoginPassword,
      onValidChange: (isValid) => {
        isPasswordValid = isValid;
        updateSubmitButton();
      },
    });
    const forgotPassword = createTextLink('', '');
    forgotPassword.textContent = 'Forgot password?';
    const loginButton = createPlayOrDetailsButton({
      variant: 'play',
      title: 'Login',
      onClick: () => {},
    });
    const divider = createDivider();
    const googleButton = createGoogleButton(() => {});

    function updateSubmitButton(): void {
      loginButton.disabled = !(isEmailValid && isPasswordValid);
    }

    loginButton.disabled = true;
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
    let isUsernameValid = false;
    let isEmailValid = false;
    let isPasswordValid = false;
    let isConfirmPasswordValid = false;
    let passwordValue = '';
    let confirmPasswordValue = '';
    const usernameField = createTextInputField({
      label: 'Username',
      type: 'text',
      icon: 'text',
      placeholder: 'Enter your username',
      autocomplete: 'username',
      errorMessage:
        'Username must be 2–30 characters, start with an uppercase English letter, and contain only English letters and digits',
      validate: isValidUsername,
      onValidChange: (isValid) => {
        isUsernameValid = isValid;
        updateSubmitButton();
      },
    });
    const emailField = createTextInputField({
      label: 'Email',
      type: 'email',
      icon: 'email',
      placeholder: 'e.g. alex@minigames.com',
      autocomplete: 'email',
      errorMessage: 'Please enter a valid email address',
      validate: isValidEmail,
      onValidChange: (isValid) => {
        isEmailValid = isValid;
        updateSubmitButton();
      },
    });
    const confirmPasswordField = createTextInputField({
      label: 'Confirm Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Confirm your password',
      autocomplete: 'new-password',
      errorMessage: 'Passwords do not match',
      validate: (value) => value.length > 0 && value === passwordValue,
      onChange: (value) => {
        confirmPasswordValue = value;
        updateSubmitButton();
      },
      onValidChange: (isValid) => {
        isConfirmPasswordValid = isValid;
        updateSubmitButton();
      },
    });
    const passwordField = createTextInputField({
      label: 'Password',
      type: 'password',
      icon: 'password',
      placeholder: 'Enter your password',
      autocomplete: 'new-password',
      errorMessage:
        'Password must be at least 6 characters and contain an uppercase English letter, a digit, and a special character',
      validate: isValidRegisterPassword,
      onChange: (value) => {
        passwordValue = value;
        if (confirmPasswordValue.length > 0) {
          confirmPasswordField.validate();
        }
        updateSubmitButton();
      },
      onValidChange: (isValid) => {
        isPasswordValid = isValid;
        updateSubmitButton();
      },
    });
    const registerButton = createPlayOrDetailsButton({
      variant: 'play',
      title: 'Create Account',
      onClick: () => {},
    });
    const divider = createDivider();
    const googleButton = createGoogleButton(() => {});

    function updateSubmitButton(): void {
      registerButton.disabled = !(
        isUsernameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      );
    }

    registerButton.disabled = true;
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
    onTabChange?.(activeTab);
    render();
  });
  content.append(tabSwitcherContainer, headerContainer, form, footer);
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
}
