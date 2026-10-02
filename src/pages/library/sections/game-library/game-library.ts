import './game-library.scss';
import { getGames } from '../../../../api/game-api';
import type { Game } from '../../../../types/game.ts';
import type { SortOption } from '../../../../types/sort.ts';
import { createGameCard } from './game-card/game-library-card.ts';
import { navigate } from '../../../../app/router.ts';

interface GameLibraryOptions {
  filter: string;
  sort: SortOption;
  page?: number;
  itemsPerPage?: number;
  onTotalPagesChange?: (totalPages: number) => void;
}

export function createGameLibrary({
  filter,
  sort,
  page = 1,
  itemsPerPage = 6,
  onTotalPagesChange,
}: GameLibraryOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-library';

  loadGames();

  return section;

  async function loadGames(): Promise<void> {
    showLoading();

    try {
      const response = await getGames({
        page,
        limit: itemsPerPage,
        category: filter === 'all' ? undefined : filter,
        sort,
      });

      onTotalPagesChange?.(response.meta.totalPages);

      if (response.data.length === 0) {
        showEmpty();
        return;
      }

      const games = response.data.map((game): Game => ({
        ...game,
        featured: false,
      }));

      renderGames(games);
    } catch {
      showError();
    }
  }

  function renderGames(games: Game[]): void {
    section.replaceChildren();

    for (const game of games) {
      const card = createGameCard({
        game,
        onDetail: () => {
          navigate({
            path: '/library',
            category: filter === 'all' ? undefined : filter,
            sort,
            page,
            game: game.slug,
          });
        },
      });

      section.append(card);
    }
  }

  function showLoading(): void {
    section.replaceChildren();

    for (let index = 0; index < 6; index += 1) {
      const skeleton = document.createElement('div');
      skeleton.className = 'game-library__skeleton';
      section.append(skeleton);
    }
  }

  function showEmpty(): void {
    section.replaceChildren();

    const empty = document.createElement('div');
    empty.className = 'game-library__empty';
    empty.textContent = 'No games found.';

    section.append(empty);
  }

  function showError(): void {
    section.replaceChildren();

    const error = document.createElement('div');
    error.className = 'game-library__error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load games.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';

    retryButton.addEventListener('click', () => {
      void loadGames();
    });

    error.append(message, retryButton);
    section.append(error);
  }
}
