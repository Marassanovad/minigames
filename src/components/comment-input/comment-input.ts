import './comment-input.scss';

export function createCommentInput(placeholder: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'comment-input-wrapper';

  const textarea = document.createElement('textarea');

  textarea.className = 'comment-input';
  textarea.placeholder = placeholder;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 88)}px`;
  });

  wrapper.append(textarea);

  return wrapper;
}
