import './games.scss';
import { createPaginationControl } from '../../../../components/pagination-control/pagination-control.ts';
import { navigate } from '../../../../app/router.ts';
import gamesData from '../../../../data/all-games-seed.json';
import { createCard } from './card/card.ts';

export function createGames(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'games';

  const header = document.createElement('div');
  header.className = 'games__header';

  const title = document.createElement('div');
  title.className = 'games__title';

  const bar = document.createElement('div');
  bar.className = 'games__title-bar';

  const text = document.createElement('h2');
  text.textContent = 'My Games';

  title.append(bar, text);

  const pagination = createPaginationControl({
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
    hidePages: true,
    isLoop: true,
  });

  header.append(title, pagination);

  const gamesList = document.createElement('div');
  gamesList.className = 'games__list';

  const games = gamesData.data
    .toSorted((a, b) => b.likesCount - a.likesCount)
    .slice(0, 3);

  for (const game of games) {
    const card = createCard(game.cardImage, game.name, () => {
      navigate({
        path: '/library',
        game: game.slug,
      });
    });

    gamesList.append(card);
  }

  section.append(header, gamesList);
  return section;
}
