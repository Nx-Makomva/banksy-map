import { describe, expect, test, beforeEach, vi } from 'vitest';
import { createUser, getUserById, addBookmarkedArtwork, addVisitedArtwork, addBadgeToUser, getMe  } from '../../src/services/user';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


describe('User Service', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('createUser', () => {
    const testUserData = { username: 'testuser', email: 'test@example.com' };

    test('includes specific error details when available', async () => {
      const errorMessage = 'Email already exists';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: errorMessage })
      });

      try {
        await createUser(testUserData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Failed to create user');
        expect(error.cause).toBe(errorMessage); // Now properly set
      }
    });
  });

  describe('getUserById', () => {
    const testUserId = '123';

    test('includes specific error details when available', async () => {
      const errorMessage = 'Invalid user ID format';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: errorMessage })
      });

      try {
        await getUserById(testUserId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('User not found');
        expect(error.cause).toBe(errorMessage); // Now properly set
      }
    });
  });
});


describe('Artwork Service', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('addBookmarkedArtwork', () => {
    const userId = 'user123';
    const artworkId = 'artwork456';

    test('successfully adds bookmark', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await addBookmarkedArtwork(userId, artworkId);
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/users/${userId}/bookmark/${artworkId}`,
        { method: 'PATCH' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('includes specific error details when available', async () => {
      const errorMessage = 'Artwork already bookmarked';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: errorMessage })
      });

      try {
        await addBookmarkedArtwork(userId, artworkId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Failed to add bookmark');
        expect(error.cause).toBe(errorMessage);
      }
    });
  });

  describe('addVisitedArtwork', () => {
    const userId = 'user123';
    const artworkId = 'artwork456';

    test('successfully adds visited artwork', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await addVisitedArtwork(userId, artworkId);
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/users/${userId}/collected/${artworkId}`,
        { method: 'PATCH' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('includes specific error details when available', async () => {
      const errorMessage = 'Artwork already visited';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: errorMessage })
      });

      try {
        await addVisitedArtwork(userId, artworkId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Failed to add visited artwork');
        expect(error.cause).toBe(errorMessage);
      }
    });
  });

  describe('addBadgeToUser', () => {
    const userId = 'user123';
    const badgeId = 'badge789';

    test('successfully adds badge', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await addBadgeToUser(userId, badgeId);
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/users/${userId}/badges/${badgeId}`,
        { method: 'PATCH' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('includes specific error details when available', async () => {
      const errorMessage = 'Badge already awarded';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: errorMessage })
      });

      try {
        await addBadgeToUser(userId, badgeId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Failed to add badge');
        expect(error.cause).toBe(errorMessage);
      }
    });
  });
});


describe('getMe', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  test('successfully fetches current user with token', async () => {
    const mockToken = 'test-token';
    const mockUser = { id: '123', username: 'testuser' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    });

    const result = await getMe(mockToken);

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/users/current`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockToken}`
        }
      }
    );
    expect(result).toEqual(mockUser);
  });

  test('successfully fetches current user without token', async () => {
    const mockUser = { id: 'guest' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    });

    const result = await getMe(null);

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/users/current`,
      {
        method: 'GET',
        headers: {}
      }
    );
    expect(result).toEqual(mockUser);
  });

  test('throws error with details when unauthorized', async () => {
    const mockToken = 'invalid-token';
    const errorMessage = 'Invalid token';
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: errorMessage })
    });

    try {
      await getMe(mockToken);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Unauthorized');
      expect(error.cause).toBe(errorMessage);
    }
  });

  test('includes specific error details when available', async () => {
    const errorMessage = 'Session expired';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: errorMessage })
    });

    try {
      await getMe('expired-token');
    } catch (error) {
      expect(error.message).toBe('Unauthorized');
      expect(error.cause).toBe(errorMessage);
    }
  });

 test('handles non-JSON error responses', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: vi.fn(() => Promise.reject(new Error('Not JSON'))),
    text: async () => 'Server error'
  });

  try {
    await getMe('valid-token');
    expect.fail('Should have thrown an error');
  } catch (error) {
    expect(error.message).toBe('Unauthorized');
    expect(error.cause).toBe('Server error');
  }
});
});