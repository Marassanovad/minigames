export function createUserAvatar(username: string): HTMLDivElement {
  const avatar = document.createElement('div');

  const nameParts = username.trim().split(/\s+/);

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : (nameParts[0]?.[0] ?? '');

  avatar.textContent = initials.toUpperCase();

  return avatar;
}
