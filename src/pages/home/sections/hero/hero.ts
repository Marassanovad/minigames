import './hero.scss';
import { createPlayOrDetailsButton } from '../../../../components/play-or-details-button/play-or-details-button.ts';

export function createHero(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero';

  const content = document.createElement('div');
  content.className = 'hero__content';

  const title = document.createElement('h1');
  title.className = 'hero__title';
  title.append(
    document.createTextNode('Take a Short Break'),
    document.createElement('br'),
    document.createTextNode('& Have Fun'),
  );

  const description = document.createElement('p');
  description.className = 'hero__description';
  description.textContent =
    'Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle, match 3, farm, and board classics.';

  const button = createPlayOrDetailsButton({
    variant: 'details',
    title: 'Browse Library',
    onClick: () => {},
  });

  content.append(title, description, button);
  section.append(content);

  return section;
}
