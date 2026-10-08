import { describe, expect, it, vi } from 'vitest';
import { getComments, postComment, toggleCommentLike } from './comments-api';

vi.mock('./api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

import { get, post } from './api';

describe('comments-api', () => {
  it('gets comments without parameters', async () => {
    const comments = [{ id: '1' }];

    vi.mocked(get).mockResolvedValue(comments);

    await expect(getComments('test-game')).resolves.toEqual(comments);

    expect(get).toHaveBeenCalledWith('/games/test-game/comments');
  });

  it('gets comments with parameters', async () => {
    vi.mocked(get).mockResolvedValue([]);

    await getComments('test-game', {
      limit: 10,
      sort: 'newest',
      userEmail: 'user@example.com',
    });

    expect(get).toHaveBeenCalledWith(
      '/games/test-game/comments?limit=10&sort=newest&userEmail=user%40example.com',
    );
  });

  it('posts a comment', async () => {
    const body = {
      userEmail: 'user@example.com',
      authorName: 'Test User',
      text: 'Great game!',
    };

    vi.mocked(post).mockResolvedValue({ id: '1' });

    await expect(postComment('test-game', body)).resolves.toEqual({
      id: '1',
    });

    expect(post).toHaveBeenCalledWith('/games/test-game/comments', body);
  });

  it('toggles comment like', async () => {
    const body = {
      userEmail: 'user@example.com',
    };

    vi.mocked(post).mockResolvedValue({ liked: true });

    await expect(toggleCommentLike('comment-1', body)).resolves.toEqual({
      liked: true,
    });

    expect(post).toHaveBeenCalledWith('/comments/comment-1/like', body);
  });
});
