import { describe, expect, it, vi } from 'vitest';
import { createTextInputField } from './text-input-field';

describe('createTextInputField', () => {
  it('creates input with default options', () => {
    const field = createTextInputField();
    const input = field.querySelector('input');

    expect(input).not.toBeNull();
    expect(input?.type).toBe('text');
    expect(input?.value).toBe('');
    expect(field.querySelector('.text-input-field__label')).toBeNull();
  });

  it('creates input with label and options', () => {
    const field = createTextInputField({
      label: 'Email',
      type: 'email',
      value: 'test@example.com',
      placeholder: 'Enter email',
      autocomplete: 'email',
    });
    const input = field.querySelector('input');

    expect(field.querySelector('label')?.textContent).toBe('Email');
    expect(input?.type).toBe('email');
    expect(input?.value).toBe('test@example.com');
    expect(input?.placeholder).toBe('Enter email');
    expect(input?.autocomplete).toBe('email');
  });

  it('validates required text input', () => {
    const field = createTextInputField();

    expect(field.validate()).toBe(false);
    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-error'),
    ).toBe(true);
  });

  it('validates email input', () => {
    const field = createTextInputField({
      type: 'email',
      value: 'test@example.com',
    });

    expect(field.validate()).toBe(true);
    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-valid'),
    ).toBe(true);
  });

  it('rejects invalid email input', () => {
    const field = createTextInputField({
      type: 'email',
      value: 'invalid-email',
    });

    expect(field.validate()).toBe(false);
    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-error'),
    ).toBe(true);
  });

  it('uses custom validation', () => {
    const validate = vi.fn((value: string) => value === 'valid');

    const field = createTextInputField({
      value: 'valid',
      validate,
    });

    expect(field.validate()).toBe(true);
    expect(validate).toHaveBeenCalledWith('valid');
  });

  it('calls onChange and onValidChange on input', () => {
    const onChange = vi.fn();
    const onValidChange = vi.fn();

    const field = createTextInputField({
      onChange,
      onValidChange,
    });
    const input = field.querySelector('input')!;

    input.value = 'Dasha';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith('Dasha');
    expect(onValidChange).toHaveBeenCalledWith(true);
    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-valid'),
    ).toBe(false);
  });

  it('validates on blur', () => {
    const field = createTextInputField();
    const input = field.querySelector('input')!;

    input.dispatchEvent(new Event('blur'));

    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-error'),
    ).toBe(true);
    expect(
      (field.querySelector('.text-input-field__error') as HTMLElement)?.hidden,
    ).toBe(false);
  });

  it('validates on change', () => {
    const field = createTextInputField({
      value: 'Dasha',
    });
    const input = field.querySelector('input')!;

    input.dispatchEvent(new Event('change'));

    expect(
      field.querySelector('.text-input-field')?.classList.contains('is-valid'),
    ).toBe(false);
  });

  it('toggles password visibility', () => {
    const field = createTextInputField({
      type: 'password',
    });
    const input = field.querySelector('input')!;
    const button = field.querySelector(
      '.text-input-field__password-toggle',
    ) as HTMLButtonElement;

    expect(button).not.toBeNull();
    expect(input.type).toBe('password');
    expect(button.getAttribute('aria-label')).toBe('Show password');

    button.click();

    expect(input.type).toBe('text');
    expect(button.getAttribute('aria-label')).toBe('Hide password');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();

    expect(input.type).toBe('password');
    expect(button.getAttribute('aria-label')).toBe('Show password');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
