require('../mongodb_helper');
const Artwork = require('../../models/artwork');

describe('Artwork model', () => {
    beforeEach(async () => {
        await Artwork.deleteMany({});
    });

    it('has a title', async () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            discoveryYear: '2019',
            streetName: 'Fake Street',
            city: 'Venice',
            location: {
                type: 'Point',
                coordinates: [-180, -90]
            },
            description: 'Test description',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.title).toEqual('Migrant child');
    });

    it('has a location', async () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            discoveryYear: '2019',
            streetName: 'Fake Street',
            city: 'Venice',
            location: {
                type: 'Point',
                coordinates: [-180, -90]
            },
            description: 'Test description',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        const savedArtwork = await artwork.save();

        expect(savedArtwork.location).toEqual({
            type: 'Point',
            coordinates: [-180, -90]
        });
    });

    it('has a discoveryYear', async () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            discoveryYear: '2019',
            streetName: 'Fake Street',
            city: 'Venice',
            location: {
                type: 'Point',
                coordinates: [-180, -90]
            },
            description: 'Test description',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.discoveryYear).toEqual('2019');
    });

    it('can list all artworks', async () => {
        const artworks = await Artwork.find();
        expect(artworks).toEqual([]);
    });

    it('can save an artwork', async () => {
        const artwork = new Artwork({
            title: 'I Want to Be What You Saw In Me',
            discoveryYear: '2016',
            streetName: 'Fake Street',
            city: 'Venice',
            location: {
                type: 'Point',
                coordinates: [169, -45]
            },
            description: 'Test description',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });
        
        await artwork.save();
        const artworks = await Artwork.find();

        expect(artworks.length).toBe(1);
        expect(artworks[0].title).toEqual('I Want to Be What You Saw In Me');
        expect(artworks[0].location).toEqual({
            type: 'Point',
            coordinates: [169, -45]
        });
        expect(artworks[0].discoveryYear).toEqual('2016');
    });
});