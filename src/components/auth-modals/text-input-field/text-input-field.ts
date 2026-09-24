import mailIcon from '../../../assets/icons/mail.svg?raw';
import userIcon from '../../../assets/icons/person.svg?raw';
import passwordIcon from '../../../assets/icons/lock.svg?raw';
import './text-input-field.scss';

type TextInputType = 'text' | 'email' | 'password';

interface TextInputFieldOptions {
  label?: string;
  type?: TextInputType;
  icon?: TextInputType;
  value?: string;
  placeholder?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  onChange?: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

const icons: Record<TextInputType, string> = {
  email: mailIcon,
  text: userIcon,
  password: passwordIcon,
};

export function createTextInputField({
  label = '',
  type = 'text',
  icon = 'email',
  value = '',
  placeholder = '',
  autocomplete,
  onChange,
  onValidChange,
}: TextInputFieldOptions = {}): HTMLDivElement {
  const container = document.createElement('div');
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

  const errorMessage = document.createElement('span');
  errorMessage.className = 'text-input-field__error';
  errorMessage.textContent = 'Please enter a valid data';
  errorMessage.hidden = true;

  let hasBeenTouched = false;

  function isInputValid(): boolean {
    const inputValue = input.value.trim();

    return (
      inputValue.length > 0 &&
      (type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue))
    );
  }

  function updateValidation(): void {
    const isValid = isInputValid();

    wrapper.classList.toggle('is-error', hasBeenTouched && !isValid);

    wrapper.classList.toggle('is-valid', hasBeenTouched && isValid);

    errorMessage.hidden = type !== 'email' || !hasBeenTouched || isValid;

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

  wrapper.append(iconElement, input);
  container.append(wrapper, errorMessage);

  return container;
}
