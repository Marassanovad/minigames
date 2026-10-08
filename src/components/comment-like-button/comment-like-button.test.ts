import { describe, expect, it, vi } from 'vitest';
import { createCommentLikeButton } from './comment-like-button';

vi.mock('../../assets/icons/like.svg?raw', () => ({
  default: '<svg></svg>',
}));

describe('createCommentLikeButton', () => {
  it('creates like button', () => {
    const button = createCommentLikeButton(10, false, vi.fn());

    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.className).toBe('comment-like-button');
    expect(button.getAttribute('aria-label')).toBe('Like comment');
  });

  it('renders likes count', () => {
    const button = createCommentLikeButton(25, false, vi.fn());

    expect(button.querySelector(':scope span:last-child')?.textContent).toBe(
      '25',
    );
  });

  it('adds liked class when comment is liked', () => {
    const button = createCommentLikeButton(10, true, vi.fn());

    expect(button.classList.contains('is-liked')).toBe(true);
  });

  it('does not add liked class when comment is not liked', () => {
    const button = createCommentLikeButton(10, false, vi.fn());

    expect(button.classList.contains('is-liked')).toBe(false);
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    const button = createCommentLikeButton(10, false, onClick);

    button.click();

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders like icon', () => {
    const button = createCommentLikeButton(10, false, vi.fn());

    expect(button.querySelector(':scope span')).not.toBeNull();
  });
});
