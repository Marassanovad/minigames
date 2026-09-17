import type { Game } from '../../types/game';
import './game-card.scss';
import { getGameImage } from '../../data/game-images.ts';
import starIcon from '../../assets/icons/star.svg?raw';
import likeIcon from '../../assets/icons/like.svg?raw';

export type GameCardPosition = 'far' | 'near' | 'selected';

interface GameCardOptions {
  game: Game;
  position: GameCardPosition;
  onClick?: () => void;
}

export function createGameCard({
  game,
  position,
  onClick,
}: GameCardOptions): HTMLElement {
  const card = document.createElement('article');

  card.className = `game-card game-card--${position}`;

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  const image = document.createElement('img');
  image.className = 'game-card__image';
  image.src = getGameImage(game.cardImage);
  image.alt = game.name;

  const overlay = document.createElement('div');
  overlay.className = 'game-card__overlay';

  const name = document.createElement('h3');
  name.className = 'game-card__name';
  name.textContent = game.name;

  const stats = document.createElement('div');
  stats.className = 'game-card__stats';

  const rating = document.createElement('span');
  rating.className = 'game-card__rating';
  rating.innerHTML = starIcon;
  rating.insertAdjacentText('beforeend', `${game.rating}`);

  const likes = document.createElement('span');
  likes.className = 'game-card__likes';
  likes.innerHTML = likeIcon;
  likes.insertAdjacentText('beforeend', formatLikes(game.likesCount));

  stats.append(rating, likes);
  overlay.append(name, stats);
  card.append(image, overlay);

  return card;
}

function formatLikes(likesCount: number): string {
  if (likesCount >= 1000) {
    return `${(likesCount / 1000).toFixed(1)}K`;
  }

  return String(likesCount);
}
