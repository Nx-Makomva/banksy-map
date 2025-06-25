const express = require('express');

const CommentsController = require('../controllers/comments');

const router = express.Router();

router.post("/:artwork_id", CommentsController.addComment);
router.get("/me", CommentsController.getAllUserComments);
router.get("/:artwork", CommentsController.getCommentsByArtworkId);
router.patch("/:id", CommentsController.updateComment);
router.delete("/:id", CommentsController.deleteComment);

module.exports = router;