import { describe, expect, it, vi } from 'vitest';
import { get, post } from './api';

describe('api', () => {
  it('makes GET request', async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: 1 }),
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(get('/games')).resolves.toEqual({ id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api/games',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('makes POST request with JSON body', async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(post('/games', { name: 'Test' })).resolves.toEqual({
      success: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api/games',
      {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('returns undefined for 204 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      }),
    );

    await expect(post('/games')).resolves.toBeUndefined();
  });

  it('throws error for failed request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(get('/games')).rejects.toThrow('API request failed: 500');
  });
});
