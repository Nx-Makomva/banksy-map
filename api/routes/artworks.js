const express = require("express");
const router = express.Router();

const ArtworksController = require("../controllers/artworks");
const upload = require('../middleware/upload');

router.post("/", upload.single('photos'), ArtworksController.create);

module.exports = router;
