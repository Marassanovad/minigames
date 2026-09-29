import { getGames } from '../../../../api/game-api';
import { createGameCard } from '../../../../components/game-card/game-card';
import type { GameCardPosition } from '../../../../components/game-card/game-card';
import { createPaginationControl } from '../../../../components/pagination-control/pagination-control';
import type { Game, GamesResponse } from '../../../../types/game.ts';
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

  const track = document.createElement('div');
  track.className = 'new-games__track';

  const paginationContainer = document.createElement('div');

  header.append(title, paginationContainer);
  section.append(header, track);

  let featuredGames: Game[] = [];
  let currentIndex = 0;

  renderLoading();

  loadFeaturedGames();

  return section;

  async function loadFeaturedGames(): Promise<void> {
    try {
      const response: GamesResponse = await getGames({
        featured: true,
      });

      featuredGames = response.data.map((game) => ({
        ...game,
        featured: true,
      }));

      if (featuredGames.length === 0) {
        renderEmpty();
        return;
      }

      currentIndex = 0;

      renderPagination();
      renderCards();
    } catch {
      renderError();
    }
  }

  function renderLoading(): void {
    paginationContainer.replaceChildren();
    track.replaceChildren();

    for (let index = 0; index < VISIBLE_CARDS; index += 1) {
      const skeleton = document.createElement('div');

      skeleton.className = 'new-games__skeleton';

      track.append(skeleton);
    }
  }

  function renderError(): void {
    paginationContainer.replaceChildren();
    track.replaceChildren();

    const error = document.createElement('div');
    error.className = 'new-games__error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load games. Please try again.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';

    retryButton.addEventListener('click', () => {
      renderLoading();
      loadFeaturedGames();
    });

    error.append(message, retryButton);
    track.append(error);
  }

  function renderEmpty(): void {
    paginationContainer.replaceChildren();
    track.replaceChildren();

    const empty = document.createElement('div');
    empty.className = 'new-games__empty';

    empty.textContent = 'No featured games found.';

    track.append(empty);
  }

  function renderPagination(): void {
    paginationContainer.replaceChildren();

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

    paginationContainer.append(pagination);
  }

  function renderCards(): void {
    track.replaceChildren();

    const visibleGames = getVisibleGames(featuredGames, currentIndex);

    for (const [index, game] of visibleGames.entries()) {
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
    }
  }
}

function getVisibleGames(games: Game[], currentIndex: number): Game[] {
  return Array.from({ length: VISIBLE_CARDS }, (_, offset) => {
    const relativeIndex = offset - 2;

    const index = (currentIndex + relativeIndex + games.length) % games.length;

    return games[index];
  });
}
