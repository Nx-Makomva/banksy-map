import createFetchMock from "vitest-fetch-mock";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { addComment, getAllUserComments, updateComment, deleteComment } from "../../src/services/comments";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();
vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
});

describe("comments service", () => {
  describe("addComment", () => {
    const testToken = "testToken";
    const testArtworkId = "123";
    const testText = "Great artwork!";

    beforeEach(() => {
      localStorage.getItem.mockReturnValue(testToken);
      fetch.mockClear();
    });

    test("sends a POST request with correct data and token", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          comment: { id: "1", text: testText },
          username: "testUser",
          message: "Comment created",
          timestamp: "2023-01-01",
        }),
        { status: 201 }
      );

      await addComment(testArtworkId, testText);

      // Get the arguments from the last fetch call
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      // Check the request was made correctly
      expect(url).toEqual(`${BACKEND_URL}/comments/${testArtworkId}`);
      expect(options.method).toEqual("POST");
      expect(options.headers["Authorization"]).toEqual(`Bearer ${testToken}`);
      expect(options.headers["Content-Type"]).toEqual("application/json");
      expect(JSON.parse(options.body)).toEqual({ text: testText });
    });

    test("returns comment data on success", async () => {
      const mockResponse = {
        comment: { id: "1", text: testText },
        username: "testUser",
        message: "Comment created",
        timestamp: "2023-01-01",
      };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });

      const result = await addComment(testArtworkId, testText);
      expect(result).toEqual(mockResponse);
    });

    test("throws an error when the response is not successful", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ error: "Invalid artwork ID" }),
        { status: 400 }
      );

      await expect(addComment(testArtworkId, testText)).rejects.toThrow(
        "Invalid artwork ID" 
      );
    });

    test("throws an error when network request fails", async () => {
      fetch.mockRejectedValue(new Error("Network error"));

      await expect(addComment(testArtworkId, testText)).rejects.toThrow(
        "Network error"
      );
    });

    test("uses token from localStorage", async () => {
      fetch.mockResponseOnce(JSON.stringify({}), { status: 201 });
      await addComment(testArtworkId, testText);
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });
  });
});



describe('getAllUserComments', () => {
  const testToken = 'test-token';
  const mockComments = [
    {
      _id: '1',
      text: 'Great artwork!',
      user_id: { firstName: 'User1' },
      artwork_id: { title: 'Artwork 1', photos: ['photo1.jpg'] },
      createdAt: '2023-01-01'
    }
  ];

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(() => testToken),
    };
    global.fetch = vi.fn();
  });

  test('fetches comments successfully', async () => {
    const mockResponse = {
      comments: mockComments,
      count: mockComments.length
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await getAllUserComments();

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/comments/me`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    expect(result).toEqual(mockResponse);
  });

  test('throws error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Database error' })
    });

    await expect(getAllUserComments())
      .rejects
      .toThrow('Database error');
  });

  test('includes specific error message when available', async () => {
    const specificError = 'User not found';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: specificError })
    });

    await expect(getAllUserComments())
    .rejects
    .toThrow('User not found');
  });
});


describe('updateComment', () => {
  const testToken = 'test-token';
  const testCommentId = 'comment123';
  const testUpdates = { text: 'Updated comment text' };
  const mockResponse = {
    updatedComment: {
      _id: testCommentId,
      text: testUpdates.text,
      user_id: 'user123',
    },
    message: 'Comment updated successfully',
  };

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(() => testToken),
    };
    global.fetch = vi.fn();
  });

  test('successfully updates a comment', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateComment(testCommentId, testUpdates);

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/comments/${testCommentId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUpdates),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  test('throws error when comment not found', async () => {
    const errorMessage = 'Comment not found';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: errorMessage }),
    });

    try {
      await updateComment(testCommentId, testUpdates);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Failed to update comment');
      expect(error.cause).toBe(errorMessage);
    }
  });

  test('throws error for server issues', async () => {
    const errorMessage = 'Database connection failed';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: errorMessage }),
    });

    await expect(updateComment(testCommentId, testUpdates))
      .rejects
      .toThrow('Failed to update comment');
  });
});

describe('deleteComment', () => {
  const testToken = 'test-token';
  const testCommentId = 'comment123';
  const mockResponse = {
    message: 'Comment successfully deleted',
    deletedComment: {
      _id: testCommentId,
      text: 'Test comment',
      user_id: 'user123',
    },
  };

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(() => testToken),
    };
    global.fetch = vi.fn();
  });

  test('successfully deletes a comment', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await deleteComment(testCommentId);

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/comments/${testCommentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    expect(result).toEqual(mockResponse);
  });

  test('throws error when comment not found', async () => {
    const errorMessage = 'Comment not found';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: errorMessage }),
    });

    try {
      await deleteComment(testCommentId);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Failed to delete comment');
      expect(error.cause).toBe(errorMessage);
    }
  });

  test('throws error for server issues', async () => {
    const errorMessage = 'Database connection failed';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: errorMessage }),
    });

    await expect(deleteComment(testCommentId))
      .rejects
      .toThrow('Failed to delete comment');
  });

  test('includes specific error details when available', async () => {
    const specificError = 'Permission denied';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: specificError }),
    });

    try {
      await deleteComment(testCommentId);
    } catch (error) {
      expect(error.message).toBe('Failed to delete comment');
      expect(error.cause).toBe(specificError);
    }
  });
});