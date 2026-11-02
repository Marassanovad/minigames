import './achievements.scss';
import { getAchievementImage } from '../../../../data/game-images.ts';
import achievementsData from '../../../../data/achievements.json';

export function createAchievements(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'achievements';

  const title = document.createElement('div');
  title.className = 'achievements__title';

  const bar = document.createElement('div');
  bar.className = 'achievements__title-bar';

  const text = document.createElement('h2');
  text.textContent = 'Achievements';

  title.append(bar, text);

  const list = document.createElement('div');
  list.className = 'achievements__list';

  for (const achievement of achievementsData.data) {
    const item = createAchieve(
      achievement.icon,
      achievement.name,
      achievement.description,
    );

    list.append(item);
  }

  section.append(title, list);
  return section;
}

function createAchieve(
  image: string,
  title: string,
  description: string,
): HTMLElement {
  const box = document.createElement('div');
  box.className = 'achievements__box';

  const icon = document.createElement('img');
  icon.className = 'achievements__icon';
  icon.src = getAchievementImage(image);
  icon.alt = title;

  const tooltip = document.createElement('div');
  tooltip.className = 'achievements__tooltip';

  const header = document.createElement('span');
  header.className = 'achievements__title';
  header.textContent = title;

  const text = document.createElement('span');
  text.className = 'achievements__text';
  text.textContent = description;

  tooltip.append(header, text);

  box.append(icon, tooltip);

  return box;
}
