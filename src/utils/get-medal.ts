export function getMedal(position: number): string {
  const medals: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  return medals[position] ?? `${position}.`;
}
