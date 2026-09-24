import './game-library-card.scss';

import type { Game } from '../../../../../types/game';
import { getGameImage } from '../../../../../data/game-images';
import { createPlayOrDetailsButton } from '../../../../../components/play-or-details-button/play-or-details-button';
import starIcon from '../../../../../assets/icons/star.svg?raw';
import likeIcon from '../../../../../assets/icons/like.svg?raw';

interface GameCardOptions {
  game: Game;
  onDetail?: () => void;
}

export function createGameCard({
  game,
  onDetail,
}: GameCardOptions): HTMLElement {
  const card = document.createElement('article');
  card.className = 'library_game-card';

  const image = document.createElement('img');
  image.className = 'library_game-card__image';
  image.src = getGameImage(game.cardImage);
  image.alt = game.name;

  const content = document.createElement('div');
  content.className = 'library_game-card__content';

  const titleContent = document.createElement('div');
  titleContent.className = 'library_game-card__title';

  const name = document.createElement('h3');
  name.className = 'library_game-card__name';
  name.textContent = game.name;

  const genre = document.createElement('div');
  genre.className = 'library_game-card__genre';
  genre.textContent = game.category;

  const priceTitle = document.createElement('p');
  priceTitle.className =
    'library_game-card__price library_game-card__price--title';
  priceTitle.textContent = game.price;

  if (game.price === 'Free') {
    priceTitle.classList.add('free');
  }

  titleContent.append(name, genre, priceTitle);

  const description = document.createElement('p');
  description.className = 'library_game-card__description';
  description.textContent = game.shortDescription;

  const stats = document.createElement('div');
  stats.className = 'library_game-card__stats';

  const rating = document.createElement('span');
  rating.className = 'library_game-card__rating';
  rating.innerHTML = starIcon;
  rating.insertAdjacentText('beforeend', `${game.rating}`);

  const likes = document.createElement('span');
  likes.className = 'library_game-card__likes';
  likes.innerHTML = likeIcon;
  likes.insertAdjacentText('beforeend', formatLikes(game.likesCount));

  const priceStats = document.createElement('p');
  priceStats.className =
    'library_game-card__price library_game-card__price--stats';
  priceStats.textContent = game.price;

  if (game.price === 'Free') {
    priceStats.classList.add('free');
  }

  const button = createPlayOrDetailsButton({
    variant: 'details',
    onClick: () => {
      onDetail?.();
    },
  });

  stats.append(rating, likes, priceStats, button);

  content.append(titleContent, description, stats);

  card.append(image, content);

  return card;
}

function formatLikes(likesCount: number): string {
  return likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : String(likesCount);
}
