const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  firstName: { type: String, required: false},
  lastName: { type: String, required: false},
  email: { type: String, required: true },
  password: { type: String, required: true },
  bookmarkedArtworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: false}],
  visitedArtworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: false}],
  badges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: false}]

});

const User = mongoose.model("User", UserSchema);

module.exports = User;