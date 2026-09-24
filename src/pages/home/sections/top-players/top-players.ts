import leaderboardData from '../../../../data/leaderboard.json';
import './top-players.scss';

interface TopPlayer {
  rank: number;
  playerName: string;
  gamesPlayed: number;
  totalScore: number;
  streakDays: number;
  favoriteGameSlug: string;
  favoriteGameName: string;
}

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
  const table = document.createElement('table');
  table.className = 'top-players__table';
  table.append(
    createTableHeader(),
    createTableBody(leaderboardData.data as TopPlayer[]),
  );
  tableWrapper.append(table);
  section.append(title, tableWrapper);

  return section;
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

function createTableBody(players: TopPlayer[]): HTMLTableSectionElement {
  const tbody = document.createElement('tbody');
  for (const player of players) {
    const row = document.createElement('tr');
    const rank = document.createElement('td');
    rank.textContent = (`#` + player.rank);

    const playerName = document.createElement('td');
    const containerAvatar = document.createElement('div');
    containerAvatar.className = 'top-players__container-avatar';
    const avatar = createUserAvatar(player.playerName);
    const name = document.createElement('span');
    name.className = 'top-players__player-name';
    name.textContent = player.playerName;
    containerAvatar.append(avatar, name);
    playerName.append(containerAvatar);

    const totalGames = document.createElement('td');
    const score = document.createElement('span');
    score.className = 'top-players__score';
    score.textContent = formatNumber(player.totalScore);
    const scoreMobile = document.createElement('span');
    scoreMobile.className = 'top-players__score-mobile';
    scoreMobile.textContent = formatCompactNumber(player.totalScore);
    totalGames.append(score, scoreMobile);

    const streak = document.createElement('td');
    streak.textContent = (`🔥 ` + player.streakDays + `d`);

    const gamesPlayed = document.createElement('td');
    gamesPlayed.textContent = String(player.gamesPlayed);

    const favoriteGame = document.createElement('td');
    const containerFavorite = document.createElement('div');
    containerFavorite.className = 'top-players__favorite';
    containerFavorite.textContent = player.favoriteGameName;
    favoriteGame.append(containerFavorite);

    row.append(rank, playerName, gamesPlayed, totalGames, streak, favoriteGame);
    tbody.append(row);
  }
  return tbody;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

function createUserAvatar(username: string): HTMLDivElement {
  const avatar = document.createElement('div');
  avatar.className = 'top-players__avatar';

  const nameParts = username.trim().split(/\s+/);

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : (nameParts[0]?.[0] ?? '');

  avatar.textContent = initials.toUpperCase();

  return avatar;
}

function formatCompactNumber(value: number): string {
  return value >= 1000 ? `${Math.floor(value / 1000)}K` : String(value);
}
