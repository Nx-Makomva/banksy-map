const { connectToDatabase } = require('../db/db')
const User = require('../models/user.js')
const Artwork = require('../models/artwork.js')
const Badge = require('../models/badge.js')
const userData = require('../data/userData.js')
const artworkData = require('../data/artworkData.js')
const badgeData = require('../data/badgeData.js')
const dotenv = require('dotenv')

dotenv.config()

const importData = async () => {
    try {
        await User.deleteMany()
        await Artwork.deleteMany()
        await Badge.deleteMany()

        createdBadges = await Badge.insertMany(badgeData)
        createdUsers = await User.insertMany(userData)
        await Artwork.insertMany(artworkData)



        console.log('User, Artwork and Badges data imported!')
        process.exit()
    } catch (error) {
        console.error('Error importing data:', error)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        await Artwork.deleteMany()
        await Badge.deleteMany()

        console.log('User and Artwork data destroyed!')
        process.exit()
    } catch (error) {
        console.error('Error destroying data:', error)
        process.exit(1)
    }
}

const run = async () => {
    await connectToDatabase()

    if (process.argv[2] === '-d') {
        await destroyData()
    } else {
        await importData()
    }
}

run()

// TO DESTROY SEED DATA npm run data:destroy -d
// TO SEED DATA  npm run data:import