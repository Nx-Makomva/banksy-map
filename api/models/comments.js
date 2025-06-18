const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  artwork_id: { type: mongoose.Schema.ObjectId, ref: 'Artwork' },
  text: String,
  createdAt: { type: Date, default: Date.now }
})

const Comments = mongoose.model("Comment", CommentsSchema);

module.exports = Comments;