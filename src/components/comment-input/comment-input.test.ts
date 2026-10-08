import { describe, expect, it, vi } from 'vitest';
import { createCommentInput } from './comment-input';

describe('createCommentInput', () => {
  it('creates comment input with placeholder', () => {
    const input = createCommentInput('Write a comment...');

    expect(input.tagName).toBe('DIV');
    expect(input.className).toBe('comment-input-wrapper');

    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    expect(textarea?.placeholder).toBe('Write a comment...');
    expect(textarea?.rows).toBe(1);
  });

  it('returns textarea value', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    textarea.value = 'Hello world';

    expect(input.getValue()).toBe('Hello world');
  });

  it('clears textarea value', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    textarea.value = 'Hello world';
    input.clear();

    expect(input.getValue()).toBe('');
  });

  it('sets loading state', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    input.setLoading(true);

    expect(textarea.disabled).toBe(true);

    input.setLoading(false);

    expect(textarea.disabled).toBe(false);
  });

  it('focuses textarea', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    const focusSpy = vi.spyOn(textarea, 'focus');

    input.focus();

    expect(focusSpy).toHaveBeenCalledOnce();
  });

  it('submits on Enter', () => {
    const onSubmit = vi.fn();
    const input = createCommentInput('Write a comment...', onSubmit);
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true,
    });

    textarea.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('does not submit on Shift+Enter', () => {
    const onSubmit = vi.fn();
    const input = createCommentInput('Write a comment...', onSubmit);
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        cancelable: true,
      }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit on other keys', () => {
    const onSubmit = vi.fn();
    const input = createCommentInput('Write a comment...', onSubmit);
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    textarea.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'a',
        cancelable: true,
      }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('updates textarea height on input', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 50,
    });

    textarea.dispatchEvent(new Event('input'));

    expect(textarea.style.height).toBe('50px');
  });

  it('limits textarea height to 88px', () => {
    const input = createCommentInput('Write a comment...');
    const textarea = input.querySelector<HTMLTextAreaElement>(
      ':scope .comment-input',
    );

    if (!textarea) {
      throw new TypeError('Textarea was not created');
    }

    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 120,
    });

    textarea.dispatchEvent(new Event('input'));

    expect(textarea.style.height).toBe('88px');
  });
});
