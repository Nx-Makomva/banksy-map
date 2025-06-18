require('../mongodb_helper');
const Badge = require('api/models/bagde.js');
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
                count: 0
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
                count: 0
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
            namme: 'Wannabe explorer',
            description: 'You have visited 3 art pieces',
            criteria: {
                type: 'visits'
            }
        });
        await expect(badge.save()).rejects.toThrow();
    });

    it('has invalid criteria type', async () => {
        const badge = new Badge({
            namme: 'Wannabe explorer',
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
});