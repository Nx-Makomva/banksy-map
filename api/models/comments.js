const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"], // Validates that these fields exist 
  },
  artwork_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Artwork",
    required: [true, "Artwork ID is required"],
  },
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Comments = mongoose.model("Comment", CommentsSchema);

module.exports = Comments;
