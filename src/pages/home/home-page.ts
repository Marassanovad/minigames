export function renderHomePage(): HTMLElement {
  const page = document.createElement('main');

  page.innerHTML = `
    <div>
      <p>MiniGames</p>
      <p>Home page</p>
    </div>
  `;

  return page;
}
