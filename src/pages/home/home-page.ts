import { createFooter } from '../../components/footer/footer';
import { createHeader } from '../../components/header/header';
import { createHero } from './sections/hero/hero.ts';
import { createNewGames } from './sections/new-game/new-games.ts';
import { createDeveloper } from './sections/developer/developer.ts';
import { createTopPlayers } from './sections/top-players/top-players.ts';
import { createAuthModal } from '../../components/auth-modals/auth-modals.ts';
import { getRouteState, navigate } from '../../app/router.ts';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export function renderHomePage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'home-page';
  const route = getRouteState();
  const authModal = createAuthModal(
    'login',
    () => {
      navigate({ path: '/', auth: undefined });
    },
    (tab) => {
      navigate({ path: '/', auth: tab });
    },
  );
  const header = createHeader({
    onLogin: () => {
      navigate({ path: '/', auth: 'login' });
    },
    onSignup: () => {
      navigate({ path: '/', auth: 'register' });
    },
    onLogout: async () => {
      await signOut(auth);
    },
  });
  const hero = createHero();
  const games = createNewGames();
  const players = createTopPlayers();
  const developer = createDeveloper();
  const footer = createFooter();
  page.append(header, hero, games, players, developer, footer, authModal.modal);
  if (route.auth) {
    queueMicrotask(() => {
      authModal.open(route.auth!);
    });
  }
  return page;
}
