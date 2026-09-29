import { get } from './api';
import type { LeaderboardResponse } from '../types/leaderboard';
import type { CategoryResponse } from '../types/category.ts';

export function getCategories(): Promise<CategoryResponse> {
  return get<CategoryResponse>('/categories');
}

export function getLeaderboard(): Promise<LeaderboardResponse> {
  return get<LeaderboardResponse>('/leaderboard');
}
