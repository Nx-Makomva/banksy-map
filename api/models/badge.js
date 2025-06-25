const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String, required: true, maxlength: 100 },
    icon: { type: String, required: false}, // To be changed later
    criteria: {
        type: { type: String, required: true, enum:['visits', 'bookmarks', 'signup'] },
        count: { type: Number, required: true},
    }
})

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;
