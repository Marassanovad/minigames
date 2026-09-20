export interface NavigationLink {
  label: string;
  href: string;
}

export const navigationLinks: NavigationLink[] = [
  {
    label: 'Home',
    href: '/minigames/',
  },
  {
    label: 'Library',
    href: '/minigames/library',
  },
  {
    label: 'Tournaments',
    href: '/minigames/tournaments',
  },
  {
    label: 'Community',
    href: '/minigames/community',
  },
];
