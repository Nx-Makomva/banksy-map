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


})