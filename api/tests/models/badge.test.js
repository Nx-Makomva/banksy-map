require('../mongodb_helper');
const Badge = require('../../models/badge');
const mongoose = require('mongoose');

describe('Badge model', () => {
    beforeEach(async () => {
        await Badge.deleteMany({});
    });

    it('has a name', async () => {
        const badge = new Badge({
            name: '1st LogIn',
            description: 'Welcome on board',
            // icon: 'login-icon.png', // optional
            criteria: {
                type: 'signup',
                count: 1
            }
        });
        const savedBadge = await badge.save();
        expect(savedBadge.name).toEqual('1st LogIn');
    });

    it('has a description', async () => {
        const badge = new Badge({
            name: '1st LogIn',
            description: 'Welcome on board',
            criteria: {
                type: 'signup',
                count: 1
            }
        });
        const savedBadge = await badge.save();
        expect(savedBadge.description).toEqual('Welcome on board');
    });

    it('has correct criteria', async () => {
        const badge = new Badge({
            name: 'Wannabe explorer',
            description: 'You have visited 3 art pieces',
            criteria: {
                type: 'visits',
                count: 3
            }
        });
        const savedBadge = await badge.save();
        expect(savedBadge.criteria.type).toEqual('visits');
        expect(savedBadge.criteria.count).toEqual(3)
    });

    it('is missing criteria count', async () => {
        const badge = new Badge({
            name: 'Wannabe explorer',
            description: 'You have visited 3 art pieces',
            criteria: {
                type: 'visits'
            }
        });
        await expect(badge.save()).rejects.toThrow();
    });

    it('has invalid criteria type', async () => {
        const badge = new Badge({
            name: 'Wannabe explorer',
            description: 'You have visited 3 art pieces',
            criteria: {
                type: 'wrong',
                count: 3
            }
        });
        await expect(badge.save()).rejects.toThrow();
    });

    it('can list all badges', async () => {
        const badges = await Badge.find();
        expect(badges).toEqual([]);
    });

    it('can list multiple badges when they exist', async () => {
        const badge1 = new Badge({
            name: '1st LogIn',
            description: 'Welcome on board',
            criteria: {
                type: 'signup',
                count: 1
            }
        });
        const badge2 = new Badge({
            name: 'Wannabe explorer',
            description: 'You have visited 3 art pieces',
            criteria: {
                type: 'visits',
                count: 3
            }
        });
        const badge3 = new Badge({
            name: 'Hoarder',
            description: 'Saved 10 art pieces',
            criteria: {
                type: 'bookmarks',
                count: 10
            }
        });
        await badge1.save();
        await badge2.save();
        await badge3.save();
        const badges = await Badge.find();

        expect(badges.length).toBe(3);
        expect(badges[0].name).toEqual('1st LogIn');
        expect(badges[1].name).toEqual('Wannabe explorer');
        expect(badges[2].name).toEqual('Hoarder');
    });
});