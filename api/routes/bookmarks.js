const express = require("express");
const router = express.Router();
const { addBookmark, removeBookmark } = require("../controllers/bookmarks");


router.post("/", addBookmark);
router.delete("/:artworkId", removeBookmark);

module.exports = router;