const express = require("express");
const upload = require('../middleware/upload');
const tokenChecker = require("../middleware/tokenChecker");

const ArtworksController = require("../controllers/artworks");

const router = express.Router();

router.get("/", tokenChecker, ArtworksController.getAllArtworks); // tokenChecker needed to filter bookmarked art
router.post("/", upload.single('photos'), ArtworksController.create);
router.get("/:id", ArtworksController.getSingleArtwork);
router.patch("/:id", ArtworksController.updateArtwork);
router.delete("/:id", ArtworksController.deleteArtwork);


module.exports = router;
