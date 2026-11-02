import { createHeader } from '../../components/header/header.ts';
import { navigate } from '../../app/router.ts';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { createFooter } from '../../components/footer/footer.ts';
import { createUser } from './sections/user/user.ts';
import { createGames } from './sections/games/games.ts';
import { createAchievements } from './sections/achievements/achievements.ts';

export function renderProfilePage(): HTMLElement {
  const page = document.createElement('main');
  page.className = 'profile-page';

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

  page.append(header);

  if (auth.currentUser) {
    const user = createUser();
    const games = createGames();
    const achievements = createAchievements();

    page.append(user, games, achievements);
  } else {
    const message = document.createElement('h1');
    message.textContent = 'You need to be logged in to view your profile.';

    message.style.cssText = `
        width: 100%;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0;
    `;

    page.append(message);
  }

  const footer = createFooter();
  page.append(footer);

  return page;
}
