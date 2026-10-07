import { get, post } from './api';
import type {
  CommentsResponse,
  GetCommentsParameters,
  PostCommentLikeResponse,
  PostCommentParameters,
  PostCommentResponse,
} from '../types/comments';

export function getComments(
  gameSlug: string,
  parameters?: GetCommentsParameters,
): Promise<CommentsResponse> {
  const searchParameters = new URLSearchParams();

  if (parameters?.limit !== undefined) {
    searchParameters.set('limit', String(parameters.limit));
  }

  if (parameters?.sort !== undefined) {
    searchParameters.set('sort', parameters.sort);
  }

  if (parameters?.userEmail) {
    searchParameters.set('userEmail', parameters.userEmail);
  }

  const query = searchParameters.toString();

  return get<CommentsResponse>(
    `/games/${gameSlug}/comments${query ? `?${query}` : ''}`,
  );
}

export function postComment(
  gameSlug: string,
  body: PostCommentParameters,
): Promise<PostCommentResponse> {
  return post<PostCommentResponse>(`/games/${gameSlug}/comments`, body);
}

export function toggleCommentLike(
  gameSlug: string,
  commentId: string,
  body: {
    userEmail: string;
  },
): Promise<PostCommentLikeResponse> {
  return post<PostCommentLikeResponse>(
    `/games/${gameSlug}/comments/${commentId}/like`,
    body,
  );
}
