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
            address: '25, Fake Street, Mountain View, Venice',
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
            address: '25, Fake Street, Mountain View, Venice',
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
            address: '25, Fake Street, Mountain View, Venice',
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

    it('has an address', async () => {
        const artwork = new Artwork({
            title: 'Street Art Piece',
            discoveryYear: '2020',
            address: '123, Art Avenue, Creative District, London',
            location: {
                type: 'Point',
                coordinates: [-0.1, 51.5]
            },
            description: 'Colorful street art',
            themeTags: ['colorful', 'urban'],
            photos: ['street-art.jpg'],
            isAuthenticated: false
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.address).toEqual('123, Art Avenue, Creative District, London');
    });

    it('has theme tags', async () => {
        const artwork = new Artwork({
            title: 'Nature Mural',
            discoveryYear: '2021',
            address: '456, Green Street, Eco Park, Manchester',
            location: {
                type: 'Point',
                coordinates: [-2.2, 53.5]
            },
            description: 'Beautiful nature-themed mural',
            themeTags: ['nature', 'green', 'environmental'],
            photos: ['nature-mural.jpg'],
            isAuthenticated: true
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.themeTags).toEqual(['nature', 'green', 'environmental']);
    });

    it('has photos array', async () => {
        const artwork = new Artwork({
            title: 'Multi-Photo Artwork',
            discoveryYear: '2022',
            address: '789, Photo Lane, Gallery District, Birmingham',
            location: {
                type: 'Point',
                coordinates: [-1.9, 52.5]
            },
            description: 'Artwork with multiple photos',
            themeTags: ['photography', 'modern'],
            photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
            isAuthenticated: false
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.photos).toEqual(['photo1.jpg', 'photo2.jpg', 'photo3.jpg']);
    });

    it('has authentication status', async () => {
        const artwork = new Artwork({
            title: 'Authenticated Piece',
            discoveryYear: '2023',
            address: '321, Verified Street, Art Quarter, Edinburgh',
            location: {
                type: 'Point',
                coordinates: [-3.2, 55.9]
            },
            description: 'This artwork has been authenticated',
            themeTags: ['verified', 'authentic'],
            photos: ['verified-art.jpg'],
            isAuthenticated: true
        });

        const savedArtwork = await artwork.save();
        
        expect(savedArtwork.isAuthenticated).toBe(true);
    });

    it('can save an artwork', async () => {
        const artwork = new Artwork({
            title: 'I Want to Be What You Saw In Me',
            discoveryYear: '2016',
            address: '25, Hope Street, Dreams District, Venice',
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
            address: '25, First Street, Initial District, Tokyo',
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
            address: '50, Second Avenue, Future Quarter, London',
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
            address: '75, Third Boulevard, Historic Area, Madrid',
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
        await artwork3.save();

        const artworks = await Artwork.find();
        expect(artworks.length).toEqual(3);
    });

    it("rejects invalid artworks", async () => {
        const invalidArtwork = new Artwork({
            // missing required fields -> title, address, etc.
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

        await expect(invalidArtwork.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it("rejects artwork with missing title", async () => {
        const invalidArtwork = new Artwork({
            // title is missing
            discoveryYear: '2020',
            address: '123, Complete Street, Full District, Bristol',
            location: {
                type: 'Point',
                coordinates: [120, 30]
            },
            description: 'Everything else is here',
            themeTags: ['complete'],
            photos: ['complete.jpg'],
            isAuthenticated: false
        });

        await expect(invalidArtwork.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it("rejects artwork with missing address", async () => {
        const invalidArtwork = new Artwork({
            title: 'No Address Art',
            discoveryYear: '2021',
            // address is missing
            location: {
                type: 'Point',
                coordinates: [90, 45]
            },
            description: 'Missing address field',
            themeTags: ['incomplete'],
            photos: ['no-address.jpg'],
            isAuthenticated: true
        });

        await expect(invalidArtwork.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it("rejects invalid location coordinates", async () => {
        const invalidArtwork = new Artwork({
            title: 'Militant child',
            discoveryYear: '2017',
            address: '25, Invalid Coords Street, Error District, Bangkok',
            location: {
                type: 'Point',
                coordinates: [181, -95] // invalid coordinates
            },
            description: 'Invalid coordinates test',
            themeTags: ['test'],
            photos: ['img.png'],
            isAuthenticated: true
        });

        try {
            await invalidArtwork.save();
            throw new Error("Expected validation error here but somehow it passed");
            
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors["location.coordinates"].message).toBe("Coordinates must be [longitude, latitude]. Must be a number within [ -180 to 180 & -90 to 90 ]");
        }
    });

    it("accepts valid boundary coordinates", async () => {
        const boundaryArtwork = new Artwork({
            title: 'Boundary Test Art',
            discoveryYear: '2024',
            address: '180, Edge Street, Boundary District, World',
            location: {
                type: 'Point',
                coordinates: [180, 90] // valid boundary coordinates
            },
            description: 'Testing boundary coordinates',
            themeTags: ['boundary', 'edge'],
            photos: ['boundary.jpg'],
            isAuthenticated: false
        });

        const savedArtwork = await boundaryArtwork.save();
        expect(savedArtwork.location.coordinates).toEqual([180, 90]);
    });

    it("has default empty comments array", async () => {
        const artwork = new Artwork({
            title: 'No Comments Yet',
            discoveryYear: '2024',
            address: '999, Silent Street, Quiet Quarter, Nowhere',
            location: {
                type: 'Point',
                coordinates: [0, 0]
            },
            description: 'Fresh artwork with no comments',
            themeTags: ['fresh', 'new'],
            photos: ['fresh.jpg'],
            isAuthenticated: false
        });

        const savedArtwork = await artwork.save();
        expect(Array.isArray(savedArtwork.comments)).toBe(true);
        expect(savedArtwork.comments.length).toBe(0);
    });
});