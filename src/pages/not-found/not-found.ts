import './not-found.scss';
import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { navigate } from '../../app/router';

export function renderNotFoundPage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'not-found-page';

  const header = createHeader();

  const content = document.createElement('section');
  content.className = 'not-found-page__content';

  const title = document.createElement('h1');
  title.className = 'not-found-page__title';
  title.textContent = '404';

  const message = document.createElement('p');
  message.className = 'not-found-page__message';
  message.textContent = 'The requested URL does not exist.';

  const homeButton = document.createElement('button');
  homeButton.className = 'not-found-page__button';
  homeButton.type = 'button';
  homeButton.textContent = 'Return to Home Page';

  homeButton.addEventListener('click', () => {
    navigate({
      path: '/',
    });
  });

  content.append(title, message, homeButton);

  const footer = createFooter();

  page.append(header, content, footer);

  return page;
}
