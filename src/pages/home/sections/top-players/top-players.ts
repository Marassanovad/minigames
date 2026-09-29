import type { LeaderboardPlayer } from '../../../../types/leaderboard';
import './top-players.scss';
import { getLeaderboard } from '../../../../api/catalog-api.ts';
import { formatCompactNumber } from '../../../../utils/compact-number.ts';
import { formatNumber } from '../../../../utils/format-number.ts';
import { createUserAvatar } from '../../../../utils/create-avatar.ts';

export function createTopPlayers(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'top-players';

  const title = document.createElement('div');
  title.className = 'top-players__title';

  const bar = document.createElement('span');
  bar.className = 'top-players__title-bar';

  const text = document.createElement('h2');
  text.textContent = 'Top Players';

  title.append(bar, text);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'top-players__table-wrapper';

  section.append(title, tableWrapper);

  loadLeaderboard();

  return section;

  async function loadLeaderboard(): Promise<void> {
    showLoading();

    try {
      const response = await getLeaderboard();

      if (response.data.length === 0) {
        showEmpty();
        return;
      }

      const table = document.createElement('table');
      table.className = 'top-players__table';

      table.append(createTableHeader(), createTableBody(response.data));

      tableWrapper.replaceChildren(table);
    } catch {
      showError();
    }
  }

  function showLoading(): void {
    tableWrapper.replaceChildren();

    const loading = document.createElement('div');
    loading.className = 'top-players__loading';

    for (let index = 0; index < 5; index += 1) {
      const row = document.createElement('div');
      row.className = 'top-players__skeleton-row';
      loading.append(row);
    }

    tableWrapper.append(loading);
  }

  function showEmpty(): void {
    tableWrapper.replaceChildren();

    const empty = document.createElement('div');
    empty.className = 'top-players__empty';
    empty.textContent = 'No players found.';

    tableWrapper.append(empty);
  }

  function showError(): void {
    tableWrapper.replaceChildren();

    const error = document.createElement('div');
    error.className = 'top-players__error';

    const message = document.createElement('p');
    message.textContent = 'Failed to load leaderboard.';

    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
      void loadLeaderboard();
    });

    error.append(message, retryButton);
    tableWrapper.append(error);
  }
}

function createTableHeader(): HTMLTableSectionElement {
  const thead = document.createElement('thead');
  const row = document.createElement('tr');

  const headers = [
    'Rank',
    'Player',
    'Games Played',
    'Score',
    'Streak',
    'Favorite Game',
  ];

  for (const headerText of headers) {
    const header = document.createElement('th');
    header.scope = 'col';
    header.textContent = headerText;
    row.append(header);
  }

  thead.append(row);

  return thead;
}

function createTableBody(
  players: LeaderboardPlayer[],
): HTMLTableSectionElement {
  const tbody = document.createElement('tbody');

  for (const player of players) {
    const row = document.createElement('tr');

    const rank = document.createElement('td');
    rank.textContent = `#${player.rank}`;

    const playerName = document.createElement('td');

    const containerAvatar = document.createElement('div');
    containerAvatar.className = 'top-players__container-avatar';

    const avatar = createUserAvatar(player.playerName);
    avatar.className = 'top-players__avatar';

    const name = document.createElement('span');
    name.className = 'top-players__player-name';
    name.textContent = player.playerName;

    containerAvatar.append(avatar, name);
    playerName.append(containerAvatar);

    const gamesPlayed = document.createElement('td');
    gamesPlayed.textContent = String(player.gamesPlayed);

    const scoreCell = document.createElement('td');

    const score = document.createElement('span');
    score.className = 'top-players__score';
    score.textContent = formatNumber(player.totalScore);

    const scoreMobile = document.createElement('span');
    scoreMobile.className = 'top-players__score-mobile';
    scoreMobile.textContent = formatCompactNumber(player.totalScore);

    scoreCell.append(score, scoreMobile);

    const streak = document.createElement('td');
    streak.textContent = `🔥 ${player.streakDays}d`;

    const favoriteGame = document.createElement('td');

    const containerFavorite = document.createElement('div');
    containerFavorite.className = 'top-players__favorite';
    containerFavorite.textContent = player.favoriteGameName;

    favoriteGame.append(containerFavorite);

    row.append(rank, playerName, gamesPlayed, scoreCell, streak, favoriteGame);

    tbody.append(row);
  }

  return tbody;
}
