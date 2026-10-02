import { get } from './api';
import type {
  CommentsResponse,
  GetCommentsParameters,
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
