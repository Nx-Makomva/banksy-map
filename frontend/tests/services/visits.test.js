import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test, beforeEach } from "vitest";

import { addVisit, removeVisit } from "../../src/services/visits";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch
createFetchMock(vi).enableMocks();

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(() => "test-token")
    };
    vi.stubGlobal('localStorage', localStorageMock);

    describe("visits service", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    describe("addVisit", () => {
        test("makes POST request to visits endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 201 });

        await addVisit("artwork123");

        expect(fetch).toHaveBeenCalledWith(
            `${BACKEND_URL}/visits`,
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
        const mockData = { visit: { id: "123" } };
        fetch.mockResponseOnce(JSON.stringify(mockData), { status: 201 });

        const result = await addVisit("artwork123");

        expect(result).toEqual(mockData);
        });

        test("throws error when request fails", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ error: "Something went wrong" }),
            { status: 400 }
        );

        await expect(addVisit("artwork123")).rejects.toThrow("Something went wrong");
        });
    });

    describe("removeVisit", () => {
        test("makes DELETE request to visits endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({ success: true }), { status: 200 });

        await removeVisit("artwork123");

        expect(fetch).toHaveBeenCalledWith(
            `${BACKEND_URL}/visits/artwork123`,
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

        const result = await removeVisit("artwork123");

        expect(result).toEqual(mockData);
        });

        test("throws error when request fails", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ error: "Not found" }),
            { status: 404 }
        );

        await expect(removeVisit("artwork123")).rejects.toThrow("Not found");
        });
    });
});