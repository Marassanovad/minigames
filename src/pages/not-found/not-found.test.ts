import { describe, expect, it, vi } from 'vitest';
import { renderNotFoundPage } from './not-found';

const navigateMock = vi.hoisted(() => vi.fn());
const createHeaderMock = vi.hoisted(() => vi.fn());
const createFooterMock = vi.hoisted(() => vi.fn());

vi.mock('../../app/router', () => ({
  navigate: navigateMock,
}));

vi.mock('../../components/header/header', () => ({
  createHeader: createHeaderMock,
}));

vi.mock('../../components/footer/footer', () => ({
  createFooter: createFooterMock,
}));

describe('renderNotFoundPage', () => {
  it('creates not found page with header, content and footer', () => {
    createHeaderMock.mockReturnValue(document.createElement('header'));
    createFooterMock.mockReturnValue(document.createElement('footer'));

    const page = renderNotFoundPage();

    expect(page.tagName).toBe('MAIN');
    expect(page.className).toBe('not-found-page');
    expect(page.children).toHaveLength(3);
  });

  it('renders 404 title and message', () => {
    createHeaderMock.mockReturnValue(document.createElement('header'));
    createFooterMock.mockReturnValue(document.createElement('footer'));

    const page = renderNotFoundPage();

    expect(
      page.querySelector(':scope .not-found-page__title')?.textContent,
    ).toBe('404');

    expect(
      page.querySelector(':scope .not-found-page__message')?.textContent,
    ).toBe('The requested URL does not exist.');
  });

  it('renders return home button', () => {
    createHeaderMock.mockReturnValue(document.createElement('header'));
    createFooterMock.mockReturnValue(document.createElement('footer'));

    const page = renderNotFoundPage();
    const button = page.querySelector(':scope .not-found-page__button');

    expect(button?.textContent).toBe('Return to Home Page');
  });

  it('navigates to home when button is clicked', () => {
    createHeaderMock.mockReturnValue(document.createElement('header'));
    createFooterMock.mockReturnValue(document.createElement('footer'));

    const page = renderNotFoundPage();
    const button = page.querySelector(':scope .not-found-page__button');

    if (!(button instanceof HTMLButtonElement)) {
      throw new TypeError('Home button was not created');
    }

    button.click();

    expect(navigateMock).toHaveBeenCalledWith({
      path: '/',
    });
  });
});
