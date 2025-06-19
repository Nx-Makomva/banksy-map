require('../mongodb_helper');
const mongoose = require('mongoose');
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

    it('can list all artworks', async () => {
        const artwork1 = new Artwork({
            title: 'first child',
            discoveryYear: '2019',
            streetName: 'Fake Street',
            city: 'Tokyo',
            location: {
                type: 'Point',
                coordinates: [-175, 10]
            },
            description: 'Test description 1',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        const artwork2 = new Artwork({
            title: 'second child',
            discoveryYear: '2029',
            streetName: 'Fake Street',
            city: 'London',
            location: {
                type: 'Point',
                coordinates: [-110, 40]
            },
            description: 'Test description 2',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        const artwork3 = new Artwork({
            title: 'Migrant child',
            discoveryYear: '2009',
            streetName: 'Fake Street',
            city: 'Madrid',
            location: {
                type: 'Point',
                coordinates: [-160, 80]
            },
            description: 'Test description 3',
            themeTags: ['test'],
            photos: ['fake-image.png'],
            isAuthenticated: true
        });

        await artwork1.save();
        await artwork2.save();
        await artwork3.save()

        const artworks = await Artwork.find();
        expect(artworks.length).toEqual(3);
    });

    it("rejects invalid artworks", () => {
        const invalidArtwork = new Artwork({
        // missing required fields like title, city, etc.
        discoveryYear: '2019',
        location: {
            type: 'Point',
            coordinates: [165, 15]
        },
        description: 'Missing critical stuff',
        themeTags: ['test'],
        photos: ['img.png'],
        isAuthenticated: true
    });

    expect(invalidArtwork.save()).rejects.toThrow(mongoose.Error.Validationerror);

    })

    it("rejects invalid location coordinates", async () => {
        const invalidArtwork = new Artwork({
        title: 'Militant child',
        discoveryYear: '2017',
        streetName: 'Fake Street',
        city: 'Bangkok',
        location: {
            type: 'Point',
            coordinates: [181, -95] // invalid coordinates
        },
        description: 'Missing critical stuff',
        themeTags: ['test'],
        photos: ['img.png'],
        isAuthenticated: true
    });

    try {
        await invalidArtwork.save();
        throw new Error("Expected validation error here but somehow it passed")
        
    } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors["location.coordinates"].message).toBe("Coordinates must be [longitude, latitude]. Must be a number within [ -180 to 180 & -90 to 90 ]")
    }
    })
});