import { get } from './api';

export function getCategories() {
  return get('/categories');
}

export function getLeaderboard() {
  return get('/leaderboard');
}
