import mailIcon from '../../../assets/icons/mail.svg?raw';
import userIcon from '../../../assets/icons/person.svg?raw';
import passwordIcon from '../../../assets/icons/lock.svg?raw';
import eyeIcon from '../../../assets/icons/eye.svg?raw';
import './text-input-field.scss';

type TextInputType = 'text' | 'email' | 'password';

interface TextInputFieldOptions {
  label?: string;
  type?: TextInputType;
  icon?: TextInputType;
  value?: string;
  placeholder?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  errorMessage?: string;
  validate?: (value: string) => boolean;
  onChange?: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export interface TextInputFieldElement extends HTMLDivElement {
  validate: () => boolean;
}

const icons: Record<TextInputType, string> = {
  email: mailIcon,
  text: userIcon,
  password: passwordIcon,
};

function createPasswordToggle(input: HTMLInputElement): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'text-input-field__password-toggle';
  button.setAttribute('aria-label', 'Show password');
  button.innerHTML = eyeIcon;

  button.addEventListener('click', () => {
    const isPasswordVisible = input.type === 'text';

    input.type = isPasswordVisible ? 'password' : 'text';

    button.setAttribute(
      'aria-label',
      isPasswordVisible ? 'Show password' : 'Hide password',
    );

    button.setAttribute('aria-pressed', String(!isPasswordVisible));
  });

  return button;
}

export function createTextInputField({
  label = '',
  type = 'text',
  icon = 'email',
  value = '',
  placeholder = '',
  autocomplete,
  errorMessage = 'Please enter a valid data',
  validate,
  onChange,
  onValidChange,
}: TextInputFieldOptions = {}): TextInputFieldElement {
  const container = document.createElement('div') as TextInputFieldElement;

  container.className = 'text-input-field-container';

  if (label) {
    const labelElement = document.createElement('label');
    labelElement.className = 'text-input-field__label';
    labelElement.textContent = label;

    container.append(labelElement);
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'text-input-field';

  const iconElement = document.createElement('span');
  iconElement.className = 'text-input-field__icon';
  iconElement.innerHTML = icons[icon];

  const input = document.createElement('input');

  input.type = type;
  input.className = 'text-input-field__input';
  input.placeholder = placeholder;
  input.value = value;
  input.autocomplete = autocomplete ?? '';

  const errorMessageElement = document.createElement('span');
  errorMessageElement.className = 'text-input-field__error';
  errorMessageElement.textContent = errorMessage;
  errorMessageElement.hidden = true;

  let hasBeenTouched = false;

  function isInputValid(): boolean {
    const inputValue = input.value.trim();
    const validationResult = validate?.(inputValue);

    return (
      validationResult ??
      (inputValue.length > 0 &&
        (type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)))
    );
  }

  function isValidationSuccessful(): boolean {
    const isValid = isInputValid();

    wrapper.classList.toggle('is-error', hasBeenTouched && !isValid);

    wrapper.classList.toggle('is-valid', hasBeenTouched && isValid);

    errorMessageElement.hidden = !hasBeenTouched || isValid;

    onValidChange?.(isValid);

    return isValid;
  }

  container.validate = () => {
    hasBeenTouched = true;
    return isValidationSuccessful();
  };

  wrapper.classList.toggle('is-empty', input.value === '');

  input.addEventListener('input', () => {
    wrapper.classList.toggle('is-empty', input.value === '');

    onChange?.(input.value);

    isValidationSuccessful();
  });

  input.addEventListener('change', () => {
    isValidationSuccessful();
  });

  input.addEventListener('blur', () => {
    hasBeenTouched = true;
    isValidationSuccessful();
  });

  const passwordToggle =
    type === 'password' ? createPasswordToggle(input) : undefined;

  wrapper.append(iconElement, input);

  if (passwordToggle) {
    wrapper.append(passwordToggle);
  }

  container.append(wrapper, errorMessageElement);

  return container;
}
