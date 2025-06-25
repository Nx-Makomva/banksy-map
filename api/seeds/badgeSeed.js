const mongoose = require('mongoose');
const Badge = require('../models/badge');

// Connect to your local MongoDB
mongoose.connect('mongodb://localhost:27017/banksy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const badges = [
    {
        name: 'Wannabe Explorer',
        description: 'Visit 3 Banksy artworks',
        icon: '',
        criteria: { type: 'visits', count: 3 }
    },
    {
        name: 'Wannabe Collector',
        description: 'Bookmark 3 artworks',
        icon: '',
        criteria: { type: 'bookmarks', count: 3 }
    },
    {
        name: 'Welcome Aboard',
        description: 'Sign up and join the community',
        icon: '',
        criteria: { type: 'signup', count: 1 }
    },
    {
        name: 'Hoarder',
        description: 'Bookmark 25 artworks',
        icon:'',
        criteria: { type: 'bookmarks', count: 25 }
    },
    {
        name: 'Dora the Explorer',
        description: 'Visit 15 artworks',
        icon: '',
        criteria: { type: 'visits', count: 15 }
    }
];

async function seedBadges() {
    try {
        await Badge.deleteMany({});
        await Badge.insertMany(badges);
        console.log('✅ Badges seeded!');
    } catch (error) {
        console.error('❌ Error seeding badges:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedBadges();
