import likeIcon from '../../assets/icons/like.svg?raw';
import './comment-like-button.scss';

export function createCommentLikeButton(
  likesCount: number,
  isLiked: boolean,
  onClick: () => void,
): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'comment-like-button';
  button.setAttribute('aria-label', 'Like comment');

  if (isLiked) {
    button.classList.add('is-liked');
  }

  const icon = document.createElement('span');
  icon.innerHTML = likeIcon;

  const count = document.createElement('span');
  count.textContent = String(likesCount);

  button.append(icon, count);

  button.addEventListener('click', onClick);

  return button;
}
