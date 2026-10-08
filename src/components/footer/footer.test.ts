import { describe, expect, it } from 'vitest';
import { createFooter } from './footer';

describe('createFooter', () => {
  it('creates footer', () => {
    const footer = createFooter();

    expect(footer.tagName).toBe('FOOTER');
    expect(footer.className).toBe('footer');
  });

  it('creates brand section', () => {
    const footer = createFooter();
    const brand = footer.querySelector('.footer__top__brand');

    expect(brand?.getAttribute('href')).toBe('/');
    expect(brand?.querySelector('img')).not.toBeNull();
    expect(brand?.querySelector('span')?.textContent).toBe('MiniGames');
    expect(brand?.querySelector('p')?.textContent).toContain(
      'Take a short break and have fun.',
    );
  });

  it('creates footer link columns', () => {
    const footer = createFooter();
    const columns = footer.querySelectorAll('.footer__top-column');

    expect(columns).toHaveLength(3);
    expect(columns[0].querySelector('h3')?.textContent).toBe('Explore');
    expect(columns[1].querySelector('h3')?.textContent).toBe('Company');
    expect(columns[2].querySelector('h3')?.textContent).toBe('Community');
  });

  it('creates company links', () => {
    const footer = createFooter();
    const company = footer.querySelectorAll('.footer__top-column')[1];
    const links = company.querySelectorAll('a');

    expect(links).toHaveLength(4);
    expect(links[0].textContent).toBe('About us');
    expect(links[1].textContent).toBe('Contact');
    expect(links[2].textContent).toBe('Privacy Policy');
    expect(links[3].textContent).toBe('Terms of Service');
  });

  it('creates community links', () => {
    const footer = createFooter();
    const community = footer.querySelectorAll('.footer__top-column')[2];
    const links = community.querySelectorAll('a');

    expect(links).toHaveLength(3);
    expect(links[0].getAttribute('href')).toBe('#');
    expect(links[1].getAttribute('href')).toBe('#');
    expect(links[2].getAttribute('href')).toBe('#');

    expect(links[0].querySelector('svg')).not.toBeNull();
    expect(links[1].querySelector('svg')).not.toBeNull();
    expect(links[2].querySelector('svg')).not.toBeNull();
  });

  it('creates bottom section', () => {
    const footer = createFooter();
    const bottom = footer.querySelector('.footer__bottom');

    expect(bottom).not.toBeNull();
    expect(bottom?.textContent).toContain(
      '© 2026 MiniGames. All rights reserved.',
    );
    expect(bottom?.textContent).toContain('RS School');
    expect(bottom?.textContent).toContain('@marassanovad');
    expect(bottom?.textContent).toContain('Designed with ♥');
  });

  it('creates school and author links', () => {
    const footer = createFooter();
    const links = footer.querySelectorAll('.footer__bottom-link');

    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe(
      'https://rs.school/courses/short-track',
    );
    expect(links[1].getAttribute('href')).toBe(
      'https://github.com/Marassanovad',
    );
  });
});
