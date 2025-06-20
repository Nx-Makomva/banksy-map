const express = require("express");
const ArtworksController = require("../controllers/artworks");

const router = express.Router();

router.get("/:id", ArtworksController.getById);

module.exports = router;