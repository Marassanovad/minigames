import { createPlayOrDetailsButton } from '../../components/play-or-details-button/play-or-details-button.ts';

export function renderHomePage(): HTMLElement {
  const page = document.createElement('main');

  page.innerHTML = `
    <div>
      <p>MiniGames</p>
      <p>Home page</p>
    </div>
  `;

  const detailsButton = createPlayOrDetailsButton({
    variant: 'play',
    onClick: () => {
      // open game details
    },
  });

  page.appendChild(detailsButton);
  return page;
}
