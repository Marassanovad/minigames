export function createUserAvatar(
  username: string,
  avatarUrl?: string | null,
): HTMLDivElement {
  const avatar = document.createElement('div');

  if (avatarUrl) {
    const image = document.createElement('img');
    image.src = avatarUrl;
    image.alt = username;

    image.addEventListener('error', () => {
      image.remove();
      avatar.textContent = getInitials(username);
    });

    avatar.append(image);
  } else {
    avatar.textContent = getInitials(username);
  }

  return avatar;
}

function getInitials(username: string): string {
  const nameParts = username.trim().split(/\s+/);

  const initials = nameParts
    .slice(0, 2)
    .map((part) => part.match(/[\p{L}\p{N}]/u)?.[0] ?? '')
    .join('')
    .toUpperCase();

  return initials || 'U';
}
