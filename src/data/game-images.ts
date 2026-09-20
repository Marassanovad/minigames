const gameImages = import.meta.glob('../assets/images/games/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function getGameImage(imagePath: string): string {
  const fileName = imagePath.split('/').pop();

  if (!fileName) {
    return '';
  }

  const key = `../assets/images/games/${fileName}`;
  return gameImages[key] ?? '';
}
