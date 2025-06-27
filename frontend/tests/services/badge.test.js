import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test, beforeEach } from "vitest";

import {
    getAllBadges,
    getBadgeById,
    getBadgesByCriteria,
    createBadge,
    updateBadge,
    deleteBadge
} from '../../src/services/badge';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//Mock fetch function
createFetchMock(vi).enableMocks();

describe('badge service', () => {
    beforeEach(() => {
        fetch.resetMocks();
        vi.clearAllMocks();
    });

    describe('getAllBadges', () => {
        test('fetch all badges successfully', async () => {
            const mockResponse = {
                badge: [
                    {
                        id: 'badge1',
                        name: 'Explorer',
                        description: 'Visit 5 artworks',
                        criteria: { type: 'visits', count: 5 }
                    },
                    {
                        id: 'badge2',
                        name: 'Art Lover',
                        description: 'Bookmark 3 artworks',
                        criteria: { type: 'visits', count: 3 }
                    }
                ]
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

            const result = await getAllBadges();

            expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/badges`);
            expect(result).toEqual(mockResponse.badge);
        });

        test('throws error when fetch fails', async () => {
            fetch.mockResponseOnce(JSON.stringify({}), { status: 500});

            await expect(getAllBadges()).rejects.toThrow('Failed to fetch badges');
        });
    });

    describe('getBadgeById', () => {
        test('fetches badge by ID successfully', async () => {
            const mockResponse = {
                badge: {
                    id: 'badge123',
                    name: 'Newbie',
                    description: 'Sign up for the 1st time',
                    criteria: { type: 'signup', count: 1}
                }
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

            const result = await getBadgeById('badge123');

            expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/badges/badge123`);
            expect(result).toEqual(mockResponse.badge);
        });

        test('throws error when badge not found', async () => {
            fetch.mockResponseOnce(JSON.stringify({}), { status: 404 });

            await expect(getBadgeById('invalid')).rejects.toThrow('Failed to fetch badge');
        });
    });

    describe('getBadgesByCriteria', () => {
        test('fetches badges filtered by criteria', async () => {
            const mockResponse = {
                badge: [
                    {
                        id: 'badge3',
                        name: 'Hoooked',
                        description: 'Visit 10 artworks',
                        criteria: { type: 'visits', count: 10 }
                    }
                ]
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

            const result = await getBadgesByCriteria('visits');

            expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/badges/criteria/visits`);
            expect(result).toEqual(mockResponse.badge);
        });

        test('throw error on backend failure', async () => {
            fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

            await expect(getBadgesByCriteria('signup')).rejects.toThrow('Failed to fetch badge by criteria');
        });
    });

    describe('cereateBadge', () => {
        test('sends FormData to create badge', async () => {
            const formData = new FormData();
            formData.append('name', 'Innovator');

            const mockResponse = {
                badge: {
                    id: 'badgeNew',
                    name: 'Innovator',
                    description: 'Try something new',
                    criteria: { type: 'signup', count: 1}
                }
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });

            const result = await createBadge(formData);

            const [url, options] = fetch.mock.lastCall;
            expect(url).toEqual(`${BACKEND_URL}/badges`);
            expect(options.method).toEqual('POST');
            expect(options.body).toBe(formData);
            expect(result).toEqual(mockResponse);
        });

        test('throws error if badge creation fails', async () => {
            const formData = new FormData();
            fetch.mockResponseOnce(JSON.stringify({}), { status: 400 });

            await expect(createBadge(formData)).rejects.toThrow('Failed to create badge');
        });
    });

    describe('updateBadge', () => {
        test('update badge via PATCH', async () => {
            const formData = new FormData();
            formData.append('name', 'Updated Badge');

            const mockResponse = {
                badge: {
                    id: 'badgeUpdated',
                    name: 'Updated Badge',
                    description: 'Updated description',
                    criteria: { type: 'visits', count: 10 }
                }
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200});

            const result = await updateBadge('badgeUpdated', formData);

            const [url, options] = fetch.mock.lastCall;
            expect(url).toEqual(`${BACKEND_URL}/badges/badgeUpdated`);
            expect(options.method).toEqual('PATCH');
            expect(options.body).toBe(formData);
            expect(result).toEqual(mockResponse);
        });
        test('throws error if update fails', async () => {
            const formData = new FormData();
            fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });

            await expect(updateBadge('badgeId', formData)).rejects.toThrow('Failed to update badge');
        });
    });

    describe('deleteBadge', () => {
        test('deletes badge via DELETE', async () => {
            const mockResponse = {
                success: true,
                message: 'Badge deleted'
            };

            fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

            const result = await deleteBadge('badgeToDelete');

            const [url, options] = fetch.mock.lastCall;
            expect(url).toEqual(`${BACKEND_URL}/badges/badgeToDelete`);
            expect(options.method).toEqual('DELETE');
            expect(result).toEqual(mockResponse);
        });

        test('throws error if delete fails', async () => {
            fetch.mockResponseOnce(JSON.stringify({}), { status: 404 });

            await expect(deleteBadge('missing')).rejects.toThrow('Failed to delete badge');
        });
    });
})