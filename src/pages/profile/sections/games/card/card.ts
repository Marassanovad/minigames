import './card.scss';
import { getGameImage } from '../../../../../data/game-images.ts';

export function createCard(
  image: string,
  name: string,
  onClick: () => void,
): HTMLElement {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.addEventListener('click', onClick);

  const imageElement = document.createElement('img');
  imageElement.className = 'card__image';
  imageElement.src = getGameImage(image);
  imageElement.alt = name;

  const title = document.createElement('span');
  title.className = 'card__title';
  title.textContent = name;

  card.append(imageElement, title);

  return card;
}
