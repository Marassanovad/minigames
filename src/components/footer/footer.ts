import './footer.scss';

import rsSchoolIcon from '../../assets/icons/rs.svg?raw';
import githubIcon from '../../assets/icons/git.svg?raw';
import logoIcon from '../../assets/icons/logo.svg';
import shareIcon from '../../assets/icons/share.svg?raw';
import feedIcon from '../../assets/icons/feed.svg?raw';
import chatIcon from '../../assets/icons/chat.svg?raw';
import { createFooterLink } from '../footer-link/footer-link.ts';
import { navigationLinks } from '../../app/navigation-links.ts';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const top = createFooterTop();
  const bottom = createFooterBottom();

  footer.append(top, bottom);

  return footer;
}

function createFooterTop(): HTMLElement {
  const top = document.createElement('div');
  top.className = 'footer__top';

  const brand = document.createElement('a');
  brand.className = 'footer__top__brand';
  brand.href = '/';

  const logo = document.createElement('div');
  logo.className = 'footer__top__logo';

  const logoImg = document.createElement('img');
  logoImg.src = logoIcon;
  logoImg.alt = '';

  const title = document.createElement('span');
  title.textContent = 'MiniGames';

  logo.append(logoImg, title);

  const text = document.createElement('p');
  text.textContent =
    'Take a short break and have fun. Hundreds of curated casual mini-games right in your web browser. No download required.';

  brand.append(logo, text);

  const links = document.createElement('div');
  links.className = 'footer__top-links';

  const explore = createExploreLinks();
  const company = createCompanyLinks();
  const community = createCommunityLinks();

  links.append(explore, company, community);

  top.append(brand, links);

  return top;
}

function createFooterBottom(): HTMLElement {
  const bottom = document.createElement('div');
  bottom.className = 'footer__bottom';

  const copyright = document.createElement('span');
  copyright.textContent = `© 2026 MiniGames. All rights reserved.`;

  const school = document.createElement('a');
  school.className = 'footer__bottom-link';
  school.href = 'https://app.rs.school';

  const schoolIcon = document.createElement('span');
  schoolIcon.className = 'footer__icon-school';
  schoolIcon.innerHTML = rsSchoolIcon;

  const schoolText = document.createElement('span');
  schoolText.textContent = 'RS School';

  school.append(schoolIcon, schoolText);

  const author = document.createElement('a');
  author.className = 'footer__bottom-link';
  author.href = 'https://github.com/Marassanovad';

  const authorIcon = document.createElement('span');
  authorIcon.className = 'footer__icon-author';
  authorIcon.innerHTML = githubIcon;

  const authorText = document.createElement('span');
  authorText.textContent = '@marassanovad';

  author.append(authorIcon, authorText);

  const designedWithLove = document.createElement('span');
  designedWithLove.textContent = 'Designed with ♥';

  bottom.append(copyright, school, author, designedWithLove);

  return bottom;
}

function createExploreLinks(): HTMLElement {
  const column = document.createElement('div');
  column.className = 'footer__top-column';

  const title = document.createElement('h3');
  title.className = 'footer__title';
  title.textContent = 'Explore';

  const links = document.createElement('div');
  links.className = 'footer__top-column-links';

  navigationLinks.forEach(({ label, href }) => {
    const link = createFooterLink('text', label, href);
    links.append(link);
  });

  column.append(title, links);

  return column;
}

function createCompanyLinks(): HTMLElement {
  const column = document.createElement('div');
  column.className = 'footer__top-column';

  const title = document.createElement('h3');
  title.className = 'footer__title';
  title.textContent = 'Company';

  const links = document.createElement('div');
  links.className = 'footer__top-column-links';

  const about = createFooterLink('text', 'About us', '#');

  const contacts = createFooterLink('text', 'Contact', '#');

  const privacy = createFooterLink('text', 'Privacy Policy', '#');

  const terms = createFooterLink('text', 'Terms of Service', '#');

  links.append(about, contacts, privacy, terms);

  column.append(title, links);

  return column;
}

function createCommunityLinks(): HTMLElement {
  const column = document.createElement('div');
  column.className = 'footer__top-column';

  const title = document.createElement('h3');
  title.className = 'footer__title';
  title.textContent = 'Community';

  const links = document.createElement('div');
  links.className = 'footer__top-column-links footer__top-column-links--icons';

  const share = createFooterLink('icon', 'Share', '#', shareIcon);

  const chat = createFooterLink('icon', 'Chat', '#', chatIcon);

  const feed = createFooterLink('icon', 'Feed', '#', feedIcon);

  links.append(share, chat, feed);

  column.append(title, links);

  return column;
}
