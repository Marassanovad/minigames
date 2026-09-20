import './developer.scss';
import developerImage from '../../../../assets/icons/developer.svg';
import { createPlayOrDetailsButton } from '../../../../components/play-or-details-button/play-or-details-button.ts';

export function createDeveloper(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'developer';

  const image = document.createElement('img');
  image.className = 'developer__image';
  image.src = developerImage;
  image.alt = 'Developer';

  const content = document.createElement('div');
  content.className = 'developer__content';

  const title = document.createElement('h1');
  title.className = 'developer__title';
  title.textContent = 'Are You a Game Developer?';

  const description = document.createElement('p');
  description.className = 'developer__description';
  description.textContent =
    "Want to see your game on MiniGames? We're always looking for fun,\n" +
    'engaging mini games to add to our platform. Submit your game\n' +
    'and reach thousands of players!';

  const button = createPlayOrDetailsButton({
    variant: 'details',
    title: 'Submit Form',
    onClick: () => {},
  });

  const details = document.createElement('p');
  details.className = 'developer__details';
  details.textContent = 'or contact us at developers@minigames.com';

  content.append(title, description, button, details);
  section.append(image, content);

  return section;
}
