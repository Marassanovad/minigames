import likeIcon from '../../assets/icons/like.svg?raw';
import './favorite-button.scss';

interface FavoriteButtonOptions {
  isFavorite: boolean;
  onClick: () => void;
}

export interface FavoriteButtonElement extends HTMLButtonElement {
  setFavorite: (isFavorite: boolean) => void;
  setLoading: (isLoading: boolean) => void;
}

export function createFavoriteButton({
  isFavorite,
  onClick,
}: FavoriteButtonOptions): FavoriteButtonElement {
  const button = document.createElement('button') as FavoriteButtonElement;

  button.type = 'button';
  button.className = 'favorite-button';

  const icon = document.createElement('span');
  icon.className = 'favorite-button__icon';
  icon.innerHTML = likeIcon;

  const text = document.createElement('span');
  text.className = 'favorite-button__text';

  button.append(icon, text);

  let favoriteState = isFavorite;

  const updateState = (): void => {
    button.classList.toggle('is-favorite', favoriteState);

    button.setAttribute(
      'aria-label',
      favoriteState ? 'Remove from favorite' : 'Add to favorite',
    );

    text.textContent = favoriteState
      ? 'Remove from Favorite'
      : 'Add to Favorite';
  };

  button.setFavorite = (isNewFavoriteState: boolean): void => {
    favoriteState = isNewFavoriteState;
    updateState();
  };

  button.setLoading = (isLoading: boolean): void => {
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);

    if (isLoading) {
      text.textContent = 'Loading...';
    } else {
      updateState();
    }
  };

  button.addEventListener('click', onClick);

  updateState();

  return button;
}
