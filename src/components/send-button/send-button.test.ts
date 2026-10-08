import { describe, expect, it, vi } from 'vitest';
import { createSendButton } from './send-button';

vi.mock('../../assets/icons/send.svg?raw', () => ({
  default: '<svg></svg>',
}));

describe('createSendButton', () => {
  it('creates send button', () => {
    const button = createSendButton(vi.fn());

    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.className).toBe('send-button');
    expect(button.getAttribute('aria-label')).toBe('Send');
  });

  it('renders send icon', () => {
    const button = createSendButton(vi.fn());

    expect(button.querySelector(':scope span')).not.toBeNull();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    const button = createSendButton(onClick);

    button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('sets loading state', () => {
    const button = createSendButton(vi.fn());

    button.setLoading(true);

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('is-loading')).toBe(true);
  });

  it('removes loading state', () => {
    const button = createSendButton(vi.fn());

    button.setLoading(true);
    button.setLoading(false);

    expect(button.disabled).toBe(false);
    expect(button.classList.contains('is-loading')).toBe(false);
  });
});
