import { describe, expect, it, vi } from 'vitest';
import { createHero } from './hero';

const navigateMock = vi.hoisted(() => vi.fn());
const createPlayOrDetailsButtonMock = vi.hoisted(() => vi.fn());

vi.mock('../../../../app/router.ts', () => ({
  navigate: navigateMock,
}));

vi.mock(
  '../../../../components/play-or-details-button/play-or-details-button.ts',
  () => ({
    createPlayOrDetailsButton: createPlayOrDetailsButtonMock,
  }),
);

describe('createHero', () => {
  it('creates hero section', () => {
    createPlayOrDetailsButtonMock.mockImplementation(({ title, onClick }) => {
      const button = document.createElement('button');
      button.textContent = title;
      button.addEventListener('click', onClick);
      return button;
    });

    const section = createHero();

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('hero');
  });

  it('renders title and description', () => {
    const section = createHero();

    expect(section.querySelector('.hero__title')?.textContent).toBe(
      'Take a Short Break& Have Fun',
    );
    expect(section.querySelector(':scope .hero__title br')).not.toBeNull();
    expect(section.querySelector('.hero__description')?.textContent).toBe(
      'Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle, match 3, farm, and board classics.',
    );
  });

  it('creates Browse Library button', () => {
    createHero();

    expect(createPlayOrDetailsButtonMock).toHaveBeenCalledWith({
      variant: 'details',
      title: 'Browse Library',
      onClick: expect.any(Function),
    });
  });

  it('navigates to library when button is clicked', () => {
    createHero();

    const options = createPlayOrDetailsButtonMock.mock.calls[0]?.[0];

    if (!options) {
      throw new TypeError('Button options were not provided');
    }

    options.onClick();

    expect(navigateMock).toHaveBeenCalledWith({
      path: '/library',
    });
  });
});
