import mailIcon from '../../assets/icons/mail.svg?raw';
import './text-input-field.scss';

interface TextInputFieldOptions {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function createTextInputField({
  value = '',
  placeholder = 'e.g. alex@minigames.com',
  onChange,
  onValidChange,
}: TextInputFieldOptions = {}): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'text-input-field-container';

  const wrapper = document.createElement('div');
  wrapper.className = 'text-input-field';

  const icon = document.createElement('span');
  icon.className = 'text-input-field__icon';
  icon.innerHTML = mailIcon;

  const input = document.createElement('input');

  input.type = 'email';
  input.className = 'text-input-field__input';
  input.placeholder = placeholder;
  input.value = value;
  input.autocomplete = 'email';

  const errorMessage = document.createElement('span');
  errorMessage.className = 'text-input-field__error';
  errorMessage.textContent = 'Please enter a valid email address';
  errorMessage.hidden = true;

  let hasBeenTouched = false;

  function validate(): boolean {
    const email = input.value.trim();

    if (!email) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function updateValidation(): void {
    const isValid = validate();

    wrapper.classList.toggle('is-error', hasBeenTouched && !isValid);

    wrapper.classList.toggle('is-valid', hasBeenTouched && isValid);

    errorMessage.hidden = !hasBeenTouched || isValid;

    onValidChange?.(isValid);
  }

  wrapper.classList.toggle('is-empty', input.value === '');

  input.addEventListener('input', () => {
    wrapper.classList.toggle('is-empty', input.value === '');

    onChange?.(input.value);

    if (hasBeenTouched) {
      updateValidation();
    }
  });

  input.addEventListener('blur', () => {
    hasBeenTouched = true;
    updateValidation();
  });

  wrapper.append(icon, input);

  container.append(wrapper, errorMessage);

  return container;
}
