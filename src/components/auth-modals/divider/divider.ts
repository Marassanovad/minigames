import './divider.scss';

export function createDivider(text = 'OR'): HTMLDivElement {
  const divider = document.createElement('div');
  divider.className = 'divider';

  const lineLeft = document.createElement('span');
  lineLeft.className = 'divider__line';

  const label = document.createElement('span');
  label.className = 'divider__label';
  label.textContent = text;

  const lineRight = document.createElement('span');
  lineRight.className = 'divider__line';

  divider.append(lineLeft, label, lineRight);

  return divider;
}
