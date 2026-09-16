type AuthTab = 'login' | 'register';

export function createAuthTabSwitcher(
  activeTab: AuthTab,
  onChange: (tab: AuthTab) => void,
): HTMLDivElement {
  const switcher = document.createElement('div');

  switcher.className = 'auth-tab-switcher';

  const loginButton = createTabButton('Log In');
  const registerButton = createTabButton('Register');

  setActiveTab(activeTab);

  loginButton.addEventListener('click', () => {
    setActiveTab('login');
    onChange('login');
  });

  registerButton.addEventListener('click', () => {
    setActiveTab('register');
    onChange('register');
  });

  switcher.append(loginButton, registerButton);

  return switcher;

  function setActiveTab(tab: AuthTab): void {
    loginButton.classList.toggle('is-active', tab === 'login');
    registerButton.classList.toggle('is-active', tab === 'register');
  }
}

function createTabButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'auth-tab-switcher__tab';
  button.textContent = text;

  return button;
}
