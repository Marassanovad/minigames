import './comment-input.scss';

export interface CommentInputElement extends HTMLDivElement {
  getValue: () => string;
  clear: () => void;
  setLoading: (isLoading: boolean) => void;
  focus: () => void;
}

export function createCommentInput(
  placeholder: string,
  onSubmit?: () => void,
): CommentInputElement {
  const wrapper = document.createElement('div') as CommentInputElement;
  wrapper.className = 'comment-input-wrapper';

  const textarea = document.createElement('textarea');

  textarea.className = 'comment-input';
  textarea.placeholder = placeholder;
  textarea.rows = 1;

  const updateHeight = (): void => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 88)}px`;
  };

  textarea.addEventListener('input', updateHeight);

  textarea.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onSubmit?.();
  });

  wrapper.getValue = (): string => textarea.value;

  wrapper.clear = (): void => {
    textarea.value = '';
    updateHeight();
  };

  wrapper.setLoading = (isLoading: boolean): void => {
    textarea.disabled = isLoading;
  };

  wrapper.focus = (): void => {
    textarea.focus();
  };

  wrapper.append(textarea);

  return wrapper;
}
