type AuthButtonVariant = 'login' | 'logout' | 'signup';
type AuthButtonTheme = 'light' | 'dark';

const buttonLabels: Record<AuthButtonVariant, string> = {
  login: 'Log In',
  logout: 'Log Out',
  signup: 'Sign Up',
};

export function createAuthButton(
  variant: AuthButtonVariant,
  onClick: () => void,
  theme: AuthButtonTheme = 'light',
): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = `auth-button auth-button--${variant} auth-button--${theme}`;

  button.textContent = buttonLabels[variant];

  button.addEventListener('click', onClick);

  return button;
}
