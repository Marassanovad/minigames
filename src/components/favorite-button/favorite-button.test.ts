import { describe, expect, it, vi } from 'vitest';
import { createFavoriteButton } from './favorite-button';

describe('createFavoriteButton', () => {
  it('creates favorite button with favorite state', () => {
    const button = createFavoriteButton({
      isFavorite: true,
      onClick: vi.fn(),
    });

    expect(button.type).toBe('button');
    expect(button.className).toBe('favorite-button is-favorite');
    expect(button.getAttribute('aria-label')).toBe('Remove from favorite');
    expect(button.querySelector('.favorite-button__text')?.textContent).toBe(
      'Remove from Favorite',
    );
  });

  it('creates favorite button with non-favorite state', () => {
    const button = createFavoriteButton({
      isFavorite: false,
      onClick: vi.fn(),
    });

    expect(button.classList.contains('is-favorite')).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Add to favorite');
    expect(button.querySelector('.favorite-button__text')?.textContent).toBe(
      'Add to Favorite',
    );
  });

  it('updates favorite state', () => {
    const button = createFavoriteButton({
      isFavorite: false,
      onClick: vi.fn(),
    });

    button.setFavorite(true);

    expect(button.classList.contains('is-favorite')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Remove from favorite');
    expect(button.querySelector('.favorite-button__text')?.textContent).toBe(
      'Remove from Favorite',
    );
  });

  it('shows loading state', () => {
    const button = createFavoriteButton({
      isFavorite: true,
      onClick: vi.fn(),
    });

    button.setLoading(true);

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('is-loading')).toBe(true);
    expect(button.querySelector('.favorite-button__text')?.textContent).toBe(
      'Loading...',
    );
  });

  it('restores state after loading', () => {
    const button = createFavoriteButton({
      isFavorite: true,
      onClick: vi.fn(),
    });

    button.setLoading(true);
    button.setLoading(false);

    expect(button.disabled).toBe(false);
    expect(button.classList.contains('is-loading')).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Remove from favorite');
    expect(button.querySelector('.favorite-button__text')?.textContent).toBe(
      'Remove from Favorite',
    );
  });

  it('calls click handler', () => {
    const onClick = vi.fn();
    const button = createFavoriteButton({
      isFavorite: false,
      onClick,
    });

    button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });
});
