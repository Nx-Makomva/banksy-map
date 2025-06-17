require('../mongodb_helper');
const Artwork = require('../../models/artwork');

describe('Artwork model', () => {
    beforeEach(async () => {
        await Artwork.deleteMany({});
    });

    it('has a title', () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            location: 'Venice',
            year: '2019'
        });
        expect(artwork.title).toEqual('Migrant child');
    });

    it('has a location', () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            location: 'Venice',
            year: '2019'
        });
        expect(artwork.location).toEqual('Venice');
    });

    it('has a year', () => {
        const artwork = new Artwork({
            title: 'Migrant child',
            location: 'Venice',
            year: '2019'
        });
        expect(artwork.year).toEqual('2019');
    });

    it('can list all artworks', async () => {
        const artworks = await Artwork.find();
        expect(artworks).toEqual([]);
    });

    it('can save an artwork', async () => {
        const artwork = new Artwork({
            title: 'I Want to Be What You Saw In Me',
            location: 'Marseille',
            year: '2025'
        });
        await artwork.save();
        const artworks = await Artwork.find();

        expect(artworks.length).toBe(1);
        expect(artworks[0].title).toEqual('I Want to Be What You Saw In Me');
        expect(artworks[0].location).toEqual('Marseille');
        expect(artworks[0].year).toEqual('2025');
    });
});