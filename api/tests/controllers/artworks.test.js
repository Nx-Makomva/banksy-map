
const app = require('../../app');
const supertest = require('supertest');
require('../mongodb_helper');
const Artwork = require('../../models/artwork');

describe('/artworks', () => {
    beforeEach(async () => {
        await Artwork.deleteMany({});
    });
    afterAll(async () => {
        await Artwork.deleteMany({});
    });

    test('GET, return empty array initially and response 200', async () => {
        const testApp = supertest(app);
        const response = await testApp.get('/artworks');

        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    test('POST, create a new piece', async () => {
        const testApp = supertest(app);
        const newArtwork = {
            title: 'Migrant child',
            location: 'Venice',
            year: '2019'
        };
        const response = await testApp.post('/artworks').send(newArtwork);

        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Migrant child');
        expect(response.body.location).toBe('Venice');
        expect(response.body.year).toBe('2019');
    });
    test('GET, return list of art pieces after adding one', async () => {
        await new Artwork({
            title: 'I Want to Be What You Saw In Me',
            location: 'Marseille',
            year: '2025'
        }).save();

        const testApp = supertest(app);
        const response = await testApp.get('/artworks');

        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('I Want to Be What You Saw In Me');
    });
});