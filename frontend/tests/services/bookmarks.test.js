import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test, beforeEach } from "vitest";

import { addBookmark, removeBookmark } from "../../src/services/bookmarks";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch
createFetchMock(vi).enableMocks();

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(() => "test-token")
};
vi.stubGlobal('localStorage', localStorageMock);

describe("bookmarks service", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    describe("addBookmark", () => {
        test("makes POST request to bookmarks endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 201 });

        await addBookmark("artwork123");

        expect(fetch).toHaveBeenCalledWith(
            `${BACKEND_URL}/bookmarks`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer test-token"
            },
            body: JSON.stringify({ artwork_id: "artwork123" })
            }
        );
    });

    test("returns data when successful", async () => {
        const mockData = { bookmark: { id: "123" } };
        fetch.mockResponseOnce(JSON.stringify(mockData), { status: 201 });

        const result = await addBookmark("artwork123");

        expect(result).toEqual(mockData);
        });

        test("throws error when request fails", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ error: "Something went wrong" }),
            { status: 400 }
        );

        await expect(addBookmark("artwork123")).rejects.toThrow("Something went wrong");
        });
    });

    describe("removeBookmark", () => {
        test("makes DELETE request to bookmarks endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

        await removeBookmark("artwork123");

        expect(fetch).toHaveBeenCalledWith(
            `${BACKEND_URL}/bookmarks/artwork123`,
            {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer test-token"
            }
            }
        );
        });

        test("returns data when successful", async () => {
        const mockData = { message: "Removed" };
        fetch.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

        const result = await removeBookmark("artwork123");

        expect(result).toEqual(mockData);
        });

        test("throws error when request fails", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ error: "Not found" }),
            { status: 404 }
        );

        await expect(removeBookmark("artwork123")).rejects.toThrow("Not found");
        });
    });
});