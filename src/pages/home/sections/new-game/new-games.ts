import gamesData from '../../../../data/all-games-seed.json';
import { createGameCard } from '../../../../components/game-card/game-card';
import type { GameCardPosition } from '../../../../components/game-card/game-card';
import { createPaginationControl } from '../../../../components/pagination-control/pagination-control';
import type { Game } from '../../../../types/game';
import './new-games.scss';

const VISIBLE_CARDS = 5;

const cardPositions: GameCardPosition[] = [
  'far',
  'near',
  'selected',
  'near',
  'far',
];

export function createNewGames(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'new-games';

  const header = document.createElement('div');
  header.className = 'new-games__header';

  const title = document.createElement('div');
  title.className = 'new-games__title';

  const bar = document.createElement('div');
  bar.className = 'new-games__title-bar';

  const text = document.createElement('h2');
  text.textContent = 'New Games';

  title.append(bar, text);

  const featuredGames = gamesData.data.filter(
    (game) => game.featured,
  ) as Game[];

  let currentIndex = 0;

  const pagination = createPaginationControl({
    currentPage: currentIndex + 1,
    totalPages: featuredGames.length,
    onPageChange: (page) => {
      currentIndex = page - 1;
      renderCards();
    },
    hidePages: true,
    isLoop: true,
  });

  header.append(title, pagination);

  const track = document.createElement('div');
  track.className = 'new-games__track';

  renderCards();

  section.append(header, track);

  return section;

  function renderCards(): void {
    track.replaceChildren();

    const visibleGames = getVisibleGames(featuredGames, currentIndex);

    visibleGames.forEach((game, index) => {
      const relativeIndex = index - 2;

      track.append(
        createGameCard({
          game,
          position: cardPositions[index],
          onClick: () => {
            currentIndex =
              (currentIndex + relativeIndex + featuredGames.length) %
              featuredGames.length;

            renderCards();
          },
        }),
      );
    });
  }
}

function getVisibleGames(games: Game[], currentIndex: number): Game[] {
  return Array.from({ length: VISIBLE_CARDS }, (_, offset) => {
    const relativeIndex = offset - 2;

    const index = (currentIndex + relativeIndex + games.length) % games.length;

    return games[index];
  });
}
