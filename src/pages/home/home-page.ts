import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { createHero } from './sections/hero/hero.ts';
import { createNewGames } from './sections/new-game/new-games.ts';
import { createDeveloper } from './sections/developer/developer.ts';
import { createTopPlayers } from './sections/top-players/top-players.ts';
import { createAuthModal } from '../../components/auth-modals/auth-modals.ts';

export function renderHomePage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'home-page';

  const authModal = createAuthModal();

  const header = createHeader({
    onLogin: () => {
      authModal.open('login');
    },

    onSignup: () => {
      authModal.open('register');
    },
  });

  const hero = createHero();
  const games = createNewGames();
  const players = createTopPlayers();
  const developer = createDeveloper();
  const footer = createFooter();

  page.append(header, hero, games, players, developer, footer, authModal.modal);

  return page;
}
