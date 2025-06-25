import { login, signup } from '../../src/services/authentication';
import { describe, expect, test, vi, beforeEach } from "vitest";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch globally
global.fetch = vi.fn();

describe('Auth Service', () => {
  beforeEach(() => {
    fetch.mockReset();  // Reset mock before each test
  });

  describe('login', () => {
    test('returns token when response is 201', async () => {
      const fakeToken = 'abc123';
      fetch.mockResolvedValueOnce({
        status: 201,
        json: async () => ({ token: fakeToken }),
      });

      const result = await login('test@example.com', 'password');
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/tokens`,
        expect.objectContaining({ method: 'POST' })
      );
      expect(result).toBe(fakeToken);
    });

    test('throws an error when status is not 201', async () => {
      fetch.mockResolvedValueOnce({
        status: 401,
      });

      await expect(login('test@example.com', 'wrongpass')).rejects.toThrow(
        'Received status 401 when logging in. Expected 201'
      );
    });
  });

  describe('signup', () => {
    test('completes successfully on 201 response', async () => {
      fetch.mockResolvedValueOnce({
        status: 201,
      });

      await expect(signup('test@example.com', 'password', 'Irina', 'P')).resolves.toBeUndefined();
    });

    test('throws an error when status is not 201', async () => {
      fetch.mockResolvedValueOnce({
        status: 409,
      });

      await expect(
        signup('test@example.com', 'password', 'Irina', 'P')
      ).rejects.toThrow('Received status 409 when signing up. Expected 201');
    });
  });
});
