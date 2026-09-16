import likeIcon from '../../assets/icons/like.svg?raw';

type FavoriteButtonVariant = 'icon' | 'text';

interface FavoriteButtonOptions {
  variant: FavoriteButtonVariant;
  isFavorite: boolean;
  onClick: () => void;
}

export function createFavoriteButton({
  variant,
  isFavorite,
  onClick,
}: FavoriteButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = `favorite-button favorite-button--${variant}`;

  if (isFavorite) {
    button.classList.add('is-favorite');
  }

  const icon = document.createElement('span');

  icon.className = 'favorite-button__icon';
  icon.innerHTML = likeIcon;

  button.append(icon);

  if (variant === 'text') {
    const text = document.createElement('span');

    text.className = 'favorite-button__text';
    text.textContent = isFavorite ? 'Remove from Favorite' : 'Add to Favorite';

    button.append(text);
  }

  button.setAttribute(
    'aria-label',
    isFavorite ? 'Remove from favorite' : 'Add to favorite',
  );

  button.addEventListener('click', onClick);

  return button;
}
