const API_BASE_URL =
  'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}

export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, {
    method: 'GET',
  });
}

export function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
