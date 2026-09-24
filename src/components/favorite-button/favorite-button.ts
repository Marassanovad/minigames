import likeIcon from '../../assets/icons/like.svg?raw';
import './favorite-button.scss';

type FavoriteButtonVariant = 'icon' | 'text';

interface FavoriteButtonOptions {
  variant: FavoriteButtonVariant;
  isFavorite: boolean;
  onClick: () => void;
}

export interface FavoriteButtonElement extends HTMLButtonElement {
  setFavorite: (isFavorite: boolean) => void;
}

export function createFavoriteButton({
  variant,
  isFavorite,
  onClick,
}: FavoriteButtonOptions): FavoriteButtonElement {
  const button = document.createElement('button') as FavoriteButtonElement;

  button.type = 'button';
  button.className = `favorite-button favorite-button--${variant}`;

  const icon = document.createElement('span');
  icon.className = 'favorite-button__icon';
  icon.innerHTML = likeIcon;

  button.append(icon);

  let favoriteState = isFavorite;

  const updateState = (): void => {
    button.classList.toggle('is-favorite', favoriteState);
    button.setAttribute(
      'aria-label',
      favoriteState ? 'Remove from favorite' : 'Add to favorite',
    );

    if (variant !== 'text') {
      return;
    }

    const text = button.querySelector('.favorite-button__text');

    if (text instanceof HTMLSpanElement) {
      text.textContent = favoriteState
        ? 'Remove from Favorite'
        : 'Add to Favorite';
    }
  };

  button.setFavorite = (isFavorite: boolean): void => {
    favoriteState = isFavorite;
    updateState();
  };

  if (variant === 'text') {
    const text = document.createElement('span');

    text.className = 'favorite-button__text';
    button.append(text);
  }

  button.addEventListener('click', onClick);

  updateState();

  return button;
}
