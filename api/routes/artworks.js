const express = require("express");

const ArtworksController = require("../controllers/artworks");

const router = express.Router();

router.get("/", ArtworksController.getAll);
router.get("/:id", ArtworksController.getById);

module.exports = router;