const SESSION_KEY = 'minigames:rss:app-session';
const SESSION_DURATION = 5 * 60 * 1000;

export interface AppSession {
  displayName: string;
  email: string;
  authenticatedAt: number;
  avatarUrl?: string;
}

export function saveAppSession(
  displayName: string,
  email: string,
  avatarUrl?: string,
): void {
  const session: AppSession = {
    displayName,
    email,
    authenticatedAt: Date.now(),
  };

  if (avatarUrl) {
    session.avatarUrl = avatarUrl;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAppSession(): AppSession | undefined {
  const value = localStorage.getItem(SESSION_KEY);

  if (!value) {
    return undefined;
  }

  try {
    const session: unknown = JSON.parse(value);

    if (!isValidSession(session)) {
      clearAppSession();
      return undefined;
    }

    if (Date.now() - session.authenticatedAt >= SESSION_DURATION) {
      clearAppSession();
      return undefined;
    }

    return session;
  } catch {
    clearAppSession();
    return undefined;
  }
}

export function clearAppSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function isValidSession(value: unknown): value is AppSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Record<string, unknown>;

  return (
    typeof session.displayName === 'string' &&
    typeof session.email === 'string' &&
    typeof session.authenticatedAt === 'number' &&
    Number.isFinite(session.authenticatedAt) &&
    (session.avatarUrl === undefined || typeof session.avatarUrl === 'string')
  );
}
