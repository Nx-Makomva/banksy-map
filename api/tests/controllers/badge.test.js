const request = require('supertest');
const app = require('../../app');
const Badge= require('../../models/badge');
jest.mock('../../middleware/upload', () => require('../mocks/multer-s3'));
require('../mongodb_helper');

describe('Badges Controller', () => {
    beforeEach(async () => {
        await Badge.deleteMany({});
    });

    describe('GET /badges', () => {
        it('returns empty array whenn no badges exist', async () => {
            const response = await request(app).get('/badges');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                count: 0,
                badge: []
            });
        });

        it('returns all badges sorted by criteria count', async () => {
            await Badge.create([
                { name: 'Obsessed', description: 'Visit 100 times', criteria: { type: 'visits', count: 100 } },
                { name: 'Newbie', description: 'Welcome on board', criteria: { type: 'visits', count: 1 } },
                { name: 'Art Lover', description: 'Bookmark 25 times', criteria: { type: 'bookmarks', count: 25 } }
            ]);

            const response = await request(app).get('/badges');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(3);
            expect(response.body.badge).toHaveLength(3);

            expect(response.body.badge[0].criteria.count).toBe(1);
            expect(response.body.badge[1].criteria.count).toBe(25);
            expect(response.body.badge[2].criteria.count).toBe(100);
        });
    });

    describe('POST /badges', () => {
        it('creates a badge successfully', async () => {
            const response = await request(app)
                .post('/badges')
                .field('name', 'Explorer')
                .field('description', 'Visited 3 places')
                .field('criteria.type', 'visits')
                .field('criteria.count', '3');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.badge.name).toEqual('Explorer');
        });

        it('fails if name is missing', async () => {
            const response = await request(app)
                .post('/badges')
                .field('description', 'Missing name')
                .field('criteria.type', 'visits')
                .field('criteria.count', '3');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('fails if badge name already exists', async () => {
            await Badge.create({
                name: 'Duplicate',
                description: 'Already exists',
                criteria: {
                    type: 'signup',
                    count: 1
                }
            });

            const response = await request(app)
                .post('/badges')
                .field('name', 'Duplicate')
                .field('description', 'Try again babs')
                .field('criteria.type', 'signup')
                .field('criteria.count', '1');
            
            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/already exists/);
        });
    });

    describe('GET /badges/:id', () => {
        it('returns badge when valid ID is provided', async () => {
            const badge = await Badge.create({
                name: 'Detective',
                description: 'Find me if you can',
                criteria: {
                    type: 'signup',
                    count: 1
                }
            });

            const response = await request(app).get(`/badges/${badge._id}`);

            expect(response.status).toBe(200);
            expect(response.body.badge.name).toEqual('Detective');
            expect(response.body.message).toBe("Badge successfully found");
        });

        it('returns 404 if badge is not found', async () => {
            const fakeId = '609e129a56cd3c35b8e81f11';
            const response = await request(app).get(`/badges/${fakeId}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Badge not found');
        });

        it("returns 500 when invalid ID format", async () => {
            const response = await request(app).get("/badges/invalid-id");

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });
    });

    describe('PUT /badges/:id', () => {
        it('updates an existing badge', async () => {
            const badge = await Badge.create({
            name: 'Old Name',
            description: 'Old Description',
            criteria: {
                type: 'visits',
                count: 2
            }
        });

        const response = await request(app)
            .put(`/badges/${badge._id}`)
            .field('name', 'New Name')
            .field('description', 'New Description')
            .field('criteria.type', 'visits')
            .field('criteria.count', '5');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.badge.name).toEqual('New Name');
        expect(response.body.badge.criteria.count).toEqual(5);
        });

        it('returns 404 if that badge does not exist', async () => {
            const fakeId = '609e129a56cd3c35b8e81f11';
            const response = await request(app)
                .put(`/badges/${fakeId}`)
                .field('name', 'Ghost');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /badges/:id', () => {
        it('deletes a badge by ID', async () => {
            const badge = await Badge.create({
                name: 'To Delete',
                description: 'Nothing is forever',
                criteria: {
                    type: 'bookmarks',
                    count: 10
                }
            });

            const response = await request(app).delete(`/badges/${badge._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/deleted successfully/);
        });
        
        it('returns 404 if badge is not found', async () => {
            const response = await request(app).delete('/badges/609e129a56cd3c35b8e81f11');
            expect(response.status).toBe(404);
        });
    });

    describe('GET /badges/criteria/:type', () => {
        it('returns badges filtered by valid criteria type', async () => {
            await Badge.create([
                { name: 'Visit Badge', description: 'Visit description', criteria: { type: 'visits', count: 10 } },
                { name: 'Bookmark Badge', description: 'Bookmark description', criteria: { type: 'bookmarks', count: 5 } }
            ]);

            const response = await request(app).get('/badges/criteria/visits');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.badge[0].criteria.type).toBe('visits');
        });

        it('sorts badges by criteria count ascending', async () => {
            await Badge.create([
                { name: 'High', description: 'High count badge', criteria: { type: 'visits', count: 100 } },
                { name: 'Low', description: 'Low count badge', criteria: { type: 'visits', count: 5 } }
            ]);

            const response = await request(app).get('/badges/criteria/visits');
        
            expect(response.body.badge[0].criteria.count).toBe(5);
            expect(response.body.badge[1].criteria.count).toBe(100)
        });

        it('returns empty array when no matches', async () => {
            const response = await request(app).get('/badges/criteria/visits');
        
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
            expect(response.body.badge).toEqual([]);
        });

        it('returns 400 for invalid criteria type', async () => {
            const response = await request(app).get('/badges/criteria/invalid');
        
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/Invalid criteria type/);
        });

        it('returns 500 on database error', async () => {
            const mockFind = jest.spyOn(Badge, 'find').mockImplementation(() => ({
                sort: jest.fn().mockRejectedValue(new Error('DB error'))
            }));

            const response = await request(app).get('/badges/criteria/visits');
        
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Error fetching badges by criteria');

            mockFind.mockRestore();
        });
    });
});
