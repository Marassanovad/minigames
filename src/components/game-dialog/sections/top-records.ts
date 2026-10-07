import type { GameDetailsRecord } from '../../../types/game.ts';
import { getMedal } from '../../../utils/get-medal.ts';
import { formatNumber } from '../../../utils/format-number.ts';
import { getTimeAgo } from '../../../utils/time-ago.ts';

export function createTopRecords(records: GameDetailsRecord[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'game-dialog__records';

  const title = document.createElement('h3');
  title.className = 'game-dialog__records-title';
  title.textContent = '🏆 Top Records';

  const list = document.createElement('ol');
  list.className = 'game-dialog__records-list';

  for (const record of records) {
    const item = document.createElement('li');
    item.className = 'game-dialog__record';

    const player = document.createElement('div');
    player.className = 'game-dialog__record-player';

    const medal = document.createElement('span');
    medal.className = 'game-dialog__record-medal';
    medal.textContent = getMedal(record.position);
    medal.setAttribute('aria-hidden', 'true');

    const playerName = document.createElement('span');
    playerName.className = 'game-dialog__record-name';
    playerName.textContent = record.playerName;
    player.append(medal, playerName);

    const result = document.createElement('div');
    result.className = 'game-dialog__record-result';

    const score = document.createElement('span');
    score.className = 'game-dialog__record-score';
    score.textContent = formatNumber(record.score);

    const timeAgo = document.createElement('span');
    timeAgo.className = 'game-dialog__record-time';
    timeAgo.textContent = getTimeAgo(record.achievedAt);

    result.append(score, timeAgo);
    item.append(player, result);
    list.append(item);
  }
  section.append(title, list);
  return section;
}
