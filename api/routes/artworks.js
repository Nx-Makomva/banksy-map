const express = require("express");

const ArtworksController = require("../controllers/artworks");

const router = express.Router();

router.get("/", ArtworksController.getAllArtworks);
router.post("/", ArtworksController.create); // Likely needs middleware to parse photos
router.get("/:id", ArtworksController.getSingleArtwork);
router.patch("/:id", ArtworksController.updateArtwork);
router.delete("/:id", ArtworksController.deleteArtwork);

module.exports = router;
