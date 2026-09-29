import { get, post } from './api';
import type { SortOption } from '../types/sort';
import type { GamesResponse } from '../types/game.ts';

export interface GetGamesParameters {
  featured?: boolean;
  page?: number;
  limit?: number;
  category?: string;
  sort?: SortOption;
}

export interface GetGameParameters {
  userEmail?: string;
}

export interface ToggleFavoriteRequest {
  userEmail: string;
}

export function getGames(
  parameters?: GetGamesParameters,
): Promise<GamesResponse> {
  const searchParameters = new URLSearchParams();

  if (parameters?.featured !== undefined) {
    searchParameters.set('featured', String(parameters.featured));
  }

  if (parameters?.page !== undefined) {
    searchParameters.set('page', String(parameters.page));
  }

  if (parameters?.limit !== undefined) {
    searchParameters.set('limit', String(parameters.limit));
  }

  if (parameters?.category !== undefined) {
    searchParameters.set('category', parameters.category);
  }

  if (parameters?.sort !== undefined) {
    searchParameters.set('sort', parameters.sort);
  }

  const query = searchParameters.toString();

  return get<GamesResponse>(`/games${query ? `?${query}` : ''}`);
}

export function getGame(gameSlug: string, parameters?: GetGameParameters) {
  const searchParameters = new URLSearchParams();

  if (parameters?.userEmail) {
    searchParameters.set('userEmail', parameters.userEmail);
  }

  const query = searchParameters.toString();

  return get(`/games/${gameSlug}${query ? `?${query}` : ''}`);
}

export function toggleFavorite(gameSlug: string, body: ToggleFavoriteRequest) {
  return post(`/games/${gameSlug}/favorite`, body);
}
