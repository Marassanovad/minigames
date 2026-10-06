import './auth-modals.scss';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase';
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
  let activeTab = initialTab;
  let isAuthPending = false;
  modal.addEventListener('click', (event) => {
    if (!isAuthPending && event.target === modal) {
      modal.close();
    }
  });
  modal.addEventListener('cancel', (event) => {
    if (isAuthPending) {
      event.preventDefault();
    }
  });
  modal.addEventListener('close', () => {
    onClose?.();
  });

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
  const form = document.createElement('div');
  form.className = 'auth-modal__form';
  const authError = document.createElement('p');
  authError.className = 'auth-modal__error';
  authError.hidden = true;
  const footer = document.createElement('div');
  footer.className = 'auth-modal__footer';
  const footerText = document.createElement('span');
  footerText.className = 'auth-modal__footer-text';
  const footerButton = document.createElement('button');
  footerButton.type = 'button';
  footerButton.className = 'auth-modal__footer-button';
  footer.append(footerText, footerButton);

  function setAuthPending(isPending: boolean): void {
    isAuthPending = isPending;
    for (const element of modal.querySelectorAll<
      HTMLInputElement | HTMLButtonElement
    >('input, button')) {
      element.disabled = isPending;
    }
  }

  function showAuthError(message: string): void {
    authError.textContent = message;
    authError.hidden = false;
  }

  function hideAuthError(): void {
    authError.textContent = '';
    authError.hidden = true;
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
      onClick: async () => {
        const email =
          emailField.querySelector<HTMLInputElement>('input')?.value.trim() ??
          '';
        const password =
          passwordField.querySelector<HTMLInputElement>('input')?.value ?? '';

        hideAuthError();

        try {
          setAuthPending(true);
          loginButton.textContent = 'Loading...';
          await signInWithEmailAndPassword(auth, email, password);
          setAuthPending(false);
          modal.close();
        } catch (error) {
          console.error('Login failed:', error);
          setAuthPending(false);
          loginButton.textContent = 'Login';
          updateSubmitButton();

          showAuthError('Invalid email or password. Please try again.');
        }
      },
    });
    const divider = createDivider();
    const googleButton = createGoogleButton(() => {});

    function updateSubmitButton(): void {
      loginButton.disabled =
        isAuthPending || !(isEmailValid && isPasswordValid);
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
      onClick: async () => {
        const username =
          usernameField
            .querySelector<HTMLInputElement>('input')
            ?.value.trim() ?? '';
        const email =
          emailField.querySelector<HTMLInputElement>('input')?.value.trim() ??
          '';
        const password =
          passwordField.querySelector<HTMLInputElement>('input')?.value ?? '';

        hideAuthError();

        try {
          setAuthPending(true);
          registerButton.textContent = 'Loading...';
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          await updateProfile(userCredential.user, { displayName: username });
          setAuthPending(false);
          modal.close();
        } catch (error) {
          console.error('Registration failed:', error);
          setAuthPending(false);
          registerButton.textContent = 'Create Account';
          updateSubmitButton();

          showAuthError(getAuthErrorMessage(error));
        }
      },
    });
    const divider = createDivider();
    const googleButton = createGoogleButton(() => {});

    function updateSubmitButton(): void {
      registerButton.disabled =
        isAuthPending ||
        !(
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

  function render(): void {
    tabSwitcherContainer.replaceChildren();
    const tabSwitcher = createAuthTabSwitcher(activeTab, (tab: AuthTab) => {
      if (isAuthPending) {
        return;
      }
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

  footerButton.addEventListener('click', () => {
    if (isAuthPending) {
      return;
    }
    activeTab = activeTab === 'login' ? 'register' : 'login';
    onTabChange?.(activeTab);
    render();
  });
  content.append(
    tabSwitcherContainer,
    headerContainer,
    form,
    authError,
    footer,
  );
  container.append(content);
  modal.append(container);
  render();
  return {
    modal,
    open: (tab: AuthTab) => {
      activeTab = tab;
      setAuthPending(false);
      render();
      if (!modal.open) {
        modal.showModal();
      }
    },
  };
}

function getAuthErrorMessage(error: unknown): string {
  return error instanceof Error &&
    error.message.includes('auth/email-already-in-use')
    ? 'This email is already registered. Please log in instead.'
    : 'Something went wrong. Please try again.';
}
