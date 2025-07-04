const Comment = require("../models/comments");
const Artwork = require("../models/artwork");
const User = require("../models/user");

async function addComment(req, res) {
  try {
    const user_id = req.user_id;
    const artwork_id = req.params.artwork_id;
    const { text } = req.body;

    const user = await User.findById(user_id).select("firstName");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const comment = await Comment.create({
      user_id,
      artwork_id,
      text,
    });
    const commentId = comment._id 

    await Artwork.findByIdAndUpdate(
      artwork_id,
      { $push: { comments: comment._id } },
      { new: true }
    );

    const readyForResponse = await Comment.findById(commentId)
      .populate("user_id", "firstName lastName")
      .populate("artwork_id", "comments");

    res.status(201).json({
      readyForResponse,
      message: "Comment created successfully",
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Error creating comment");
    }
    res.status(400).json({
      error: error.message,
    });
  }
}

async function getCommentsByArtworkId(req, res) {
  try {
    const artwork_id = req.params.artwork_id;

    const artworkComments = await Comment.find({ artwork_id})
      .populate("user_id", "firstName lastName")
      .populate("artwork_id", "comments")
      .sort({ createdAt: -1 });

    res.status(200).json({
      comments: artworkComments,
      count: artworkComments.length,
    });
  


  } catch (error) {
    console.error("Error retrieving comments", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getAllUserComments(req, res) {
  try {
    const user_id = req.user_id;

    const userComments = await Comment.find({ user_id })
      .populate("user_id", "firstName lastName")
      .populate("artwork_id", "title photos isAuthenticated")
      .sort({ createdAt: -1 });

    res.status(200).json({
      comments: userComments,
      count: userComments.length, // Added in case we want to show how many comments a user has made
    });
  } catch (error) {
    console.error("Error retrieving comments", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function updateComment(req, res) {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      }
    ).populate("user_id", "firstName lastName")
      .populate("artwork_id", "title photos")
      .sort({ createdAt: -1 });

    if (!updatedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    res.status(200).json({
      updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(200).json({
      message: "Comment successfully deleted",
      deletedComment,
    });
  } catch (error) {
    console.error("Error deleting comment", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

const CommentsController = {
  addComment: addComment,
  getAllUserComments: getAllUserComments,
  getCommentsByArtworkId: getCommentsByArtworkId,
  updateComment: updateComment,
  deleteComment: deleteComment,
};

module.exports = CommentsController;
