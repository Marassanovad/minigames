export function formatCompactNumber(value: number): string {
  return value >= 1000 ? `${Math.floor(value / 1000)}K` : String(value);
}
