import './game-library.scss';

import gamesData from '../../../../data/all-games-seed.json';
import type { SortOption } from '../../../../components/sort-options/sort-options';
import type { Game } from '../../../../types/game';
import { createGameCard } from './game-card/game-library-card.ts';
import { createGameDialog } from '../../../../components/game-dialog/game-dialog.ts';
import gameDetailsData from '../../../../data/game-tukoni-forest-keepers.json';
import commentsData from '../../../../data/comments-tukoni-forest-keepers.json';

interface GameLibraryOptions {
  filter: string;
  sort: SortOption;
  page?: number;
  itemsPerPage?: number;
}

export function createGameLibrary({
  filter,
  sort,
  page = 1,
  itemsPerPage = 6,
}: GameLibraryOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-library';

  const games = gamesData.data as Game[];

  const filteredGames = filterGames(games, filter);
  const sortedGames = sortGames(filteredGames, sort);

  const startIndex = (page - 1) * itemsPerPage;
  const pageGames = sortedGames.slice(startIndex, startIndex + itemsPerPage);

  for (const game of pageGames) {
    const card = createGameCard({
      game,
      onDetail: () => {
        const gameDetails = gameDetailsData.data;
        const dialog = createGameDialog({
          game: { ...gameDetails, comments: commentsData.data },
        });
        document.body.append(dialog);
        dialog.showModal();
        dialog.addEventListener('click', (event: MouseEvent) => {
          if (event.target === dialog) {
            dialog.close();
          }
        });
        dialog.addEventListener(
          'close',
          () => {
            dialog.remove();
          },
          { once: true },
        );
      },
    });

    section.append(card);
  }

  return section;
}

export function getGameLibraryTotalPages(
  filter: string,
  itemsPerPage = 6,
): number {
  const games = gamesData.data as Game[];
  const filteredGames = filterGames(games, filter);

  return Math.ceil(filteredGames.length / itemsPerPage);
}

function filterGames(games: Game[], filter: string): Game[] {
  return filter === 'all'
    ? games
    : games.filter((game) => game.category === filter);
}

function sortGames(games: Game[], sort: SortOption): Game[] {
  return games.toSorted((firstGame, secondGame) => {
    switch (sort) {
      case 'rating-asc': {
        return firstGame.rating - secondGame.rating;
      }

      case 'rating-desc': {
        return secondGame.rating - firstGame.rating;
      }

      case 'name-asc': {
        return firstGame.name.localeCompare(secondGame.name);
      }

      case 'name-desc': {
        return secondGame.name.localeCompare(firstGame.name);
      }

      default: {
        return 0;
      }
    }
  });
}
