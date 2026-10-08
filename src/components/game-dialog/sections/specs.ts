import type { GameDetailsSpecs } from '../../../types/game.ts';

export function createSpecs(specs: GameDetailsSpecs): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-dialog__specs';

  const items = [
    ['Genre', specs.genre],
    ['Players', specs.players],
    ['Duration', specs.duration],
    ['Price', specs.price],
  ];
  for (const [label, value] of items) {
    const item = document.createElement('div');
    item.className = 'game-dialog__spec';

    const itemLabel = document.createElement('span');
    itemLabel.className = 'game-dialog__spec-label';
    itemLabel.textContent = label;

    const itemValue = document.createElement('span');
    itemValue.className = 'game-dialog__spec-value';
    itemValue.textContent = value;

    item.append(itemLabel, itemValue);
    container.append(item);
  }
  return container;
}
