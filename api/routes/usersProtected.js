const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.get("/current", UsersController.getCurrentUser);
router.get("/:id", UsersController.getById);
// router.patch("/:id/bookmarked/:artworkId", UsersController.addBookmarked);
// router.patch('/:id/visited/:artworkId', UsersController.addVisitedArtwork);
router.patch("/:id/badges/:badgeId", UsersController.addBadge);


module.exports = router;