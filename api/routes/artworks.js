const express = require("express");
const upload = require('../middleware/upload');
const ArtworksController = require("../controllers/artworks");

const router = express.Router();

router.get("/", ArtworksController.getAllArtworks);
router.post("/", upload.single('photos'), ArtworksController.create); // Likely needs middleware to parse photos
router.get("/:id", ArtworksController.getSingleArtwork);
router.patch("/:id", ArtworksController.updateArtwork);
router.delete("/:id", ArtworksController.deleteArtwork);


module.exports = router;
