import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test, beforeEach } from "vitest";

import { 
  createArtwork, 
  getAllArtworks, 
  getSingleArtwork, 
  updateArtwork, 
  deleteArtwork 
} from "../../src/services/artworks";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

// Mock the getImageUrl utility - make sure it's returning correct url
vi.mock("../../utils/s3url", () => ({
  getImageUrl: vi.fn((path) => `http://localhost:3000/image/${path}`)
}));

describe("artworks service", () => {
  beforeEach(() => {
    fetch.resetMocks();
    vi.clearAllMocks();
  });

  describe("createArtwork", () => {
    test("sends FormData to correct endpoint with POST method", async () => {
      const mockFormData = new FormData();
      mockFormData.append('title', 'Test Artwork');
      mockFormData.append('discoveryYear', '2023');

      const mockResponse = {
        artwork: {
          _id: "artwork123",
          title: "Test Artwork",
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });

      await createArtwork(mockFormData);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/artworks`);
      expect(options.method).toEqual("POST");
      expect(options.body).toBe(mockFormData);
      expect(options.headers).toBeUndefined();
    });

    test("adds imageUrl to response when photo exists", async () => {
      const mockFormData = new FormData();
      const mockResponse = {
        artwork: {
          _id: "artwork123",
          title: "Test Artwork",
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });

      const result = await createArtwork(mockFormData);

      expect(result.artwork.imageUrl).toEqual("http://localhost:3000/image/photo123.jpg");
    });

    test("rejects with error message when status is not ok", async () => {
      const mockFormData = new FormData();
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Title is required" }),
        { status: 400 }
      );

      await expect(createArtwork(mockFormData)).rejects.toThrow("Title is required");
    });

    test("rejects with generic error when no error message provided", async () => {
      const mockFormData = new FormData();
      fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(createArtwork(mockFormData)).rejects.toThrow("Failed to create artwork");
    });
  });

  describe("getAllArtworks", () => {
    test("fetches all artworks without query parameters", async () => {
      const mockResponse = {
        allArtworks: [
          { _id: "art1", title: "Artwork 1", photos: ["photo1.jpg"] },
          { _id: "art2", title: "Artwork 2", photos: ["photo2.jpg"] }
        ]
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await getAllArtworks();

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      const options = fetch.mock.lastCall[1] // this is the 'options' argument for fetch (where we send request options)

      expect(url).toEqual(`${BACKEND_URL}/artworks`);
      expect(options.headers).toBeUndefined();
    });

    test("builds query string from parameters correctly", async () => {
      const queryParams = {
        themeTags: ['animal', 'cool'],
        isAuthenticated: true,
        lat: 45.5,
        lng: -0.45,
        maxDistance: 1000
      };

      const mockResponse = { allArtworks: [] };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await getAllArtworks(queryParams);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      
      expect(url).toContain(`${BACKEND_URL}/artworks?`);
      expect(url).toContain('themeTags=animal');
      expect(url).toContain('themeTags=cool');
      expect(url).toContain('isAuthenticated=true');
      expect(url).toContain('lat=45.5');
      expect(url).toContain('lng=-0.45');
      expect(url).toContain('maxDistance=1000');
    });

    test("filters out undefined, null, and empty string values", async () => {
      const queryParams = {
        themeTags: ['animal'],
        isAuthenticated: undefined,
        lat: null,
        lng: '',
        maxDistance: 1000
      };

      const mockResponse = { allArtworks: [] };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await getAllArtworks(queryParams);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      
      expect(url).toContain('themeTags=animal');
      expect(url).toContain('maxDistance=1000');
      expect(url).not.toContain('isAuthenticated');
      expect(url).not.toContain('lat');
      expect(url).not.toContain('lng');
    });

    test("adds imageUrl to all artworks in response", async () => {
      const mockResponse = {
        allArtworks: [
          { _id: "art1", title: "Artwork 1", photos: ["photo1.jpg"] },
          { _id: "art2", title: "Artwork 2", photos: ["photo2.jpg"] },
          { _id: "art3", title: "Artwork 3", photos: null }
        ]
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await getAllArtworks();

      expect(result.allArtworks[0].imageUrl).toEqual("http://localhost:3000/image/photo1.jpg");
      expect(result.allArtworks[1].imageUrl).toEqual("http://localhost:3000/image/photo2.jpg");
      expect(result.allArtworks[2].imageUrl).toBeNull();
    });

    test("rejects with error when fetch fails", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Server error" }),
        { status: 500 }
      );

      await expect(getAllArtworks()).rejects.toThrow("Server error");
    });
  });

  describe("getSingleArtwork", () => {
    test("fetches single artwork by id", async () => {
      const artworkId = "artwork123";
      const mockResponse = {
        artwork: {
          _id: artworkId,
          title: "Single Artwork",
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await getSingleArtwork(artworkId);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];

      expect(url).toEqual(`${BACKEND_URL}/artworks/${artworkId}`);
      expect(fetch.mock.lastCall[1]).toBeUndefined(); // No options object for GET
    });

    test("adds imageUrl to single artwork response", async () => {
      const mockResponse = {
        artwork: {
          _id: "artwork123",
          title: "Single Artwork",
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await getSingleArtwork("artwork123");

      expect(result.artwork.imageUrl).toEqual("http://localhost:3000/image/photo123.jpg");
    });

    test("rejects with error when artwork not found", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Artwork not found" }),
        { status: 404 }
      );

      await expect(getSingleArtwork("nonexistent")).rejects.toThrow("Artwork not found");
    });
  });

  describe("updateArtwork", () => {
    test("sends PATCH request with JSON data", async () => {
      const artworkId = "artwork123";
      const updateData = {
        title: "Updated Title",
        description: "Updated description"
      };

      const mockResponse = {
        updatedArtwork: {
          _id: artworkId,
          ...updateData,
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await updateArtwork(artworkId, updateData);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/artworks/${artworkId}`);
      expect(options.method).toEqual("PATCH");
      expect(options.headers["Content-Type"]).toEqual("application/json");
      expect(JSON.parse(options.body)).toEqual(updateData);
    });

    test("adds imageUrl to updated artwork response", async () => {
      const updateData = { title: "Updated Title" };
      const mockResponse = {
        updatedArtwork: {
          _id: "artwork123",
          title: "Updated Title",
          photos: ["photo123.jpg"]
        }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await updateArtwork("artwork123", updateData);

      expect(result.updatedArtwork.imageUrl).toEqual("http://localhost:3000/image/photo123.jpg");
    });

    test("rejects with error when update fails", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Validation failed" }),
        { status: 400 }
      );

      await expect(updateArtwork("artwork123", {})).rejects.toThrow("Validation failed");
    });
  });

  describe("deleteArtwork", () => {
    test("sends DELETE request to correct endpoint", async () => {
      const artworkId = "artwork123";
      const mockResponse = {
        message: "Artwork and associated comments successfully deleted"
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      await deleteArtwork(artworkId);

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/artworks/${artworkId}`);
      expect(options.method).toEqual("DELETE");
    });

    test("returns success response", async () => {
      const mockResponse = {
        message: "Artwork and associated comments successfully deleted",
        deletedArtwork: { _id: "artwork123", title: "Deleted Artwork" }
      };

      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await deleteArtwork("artwork123");

      expect(result.message).toEqual("Artwork and associated comments successfully deleted");
      expect(result.deletedArtwork._id).toEqual("artwork123");
    });

    test("rejects with error when deletion fails", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Artwork not found" }),
        { status: 404 }
      );

      await expect(deleteArtwork("nonexistent")).rejects.toThrow("Artwork not found");
    });
  });

  // Edge cases and error handling
  describe("error handling", () => {
    test("handles network errors gracefully", async () => {
      fetch.mockRejectOnce(new Error("Network error"));

      await expect(getAllArtworks()).rejects.toThrow("Network error");
    });

    test("handles malformed JSON responses", async () => {
      fetch.mockResponseOnce("Invalid JSON", { status: 200 });

      await expect(getAllArtworks()).rejects.toThrow();
    });
  });
});