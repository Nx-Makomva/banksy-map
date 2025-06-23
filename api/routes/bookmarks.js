const express = require("express");
const router = express.Router();
const { addBookmark, removeBookmark, getAllUserBookmarks } = require("../controllers/bookmarks");


router.post("/:userId", addBookmark);
router.get("/:userId", getAllUserBookmarks);
router.delete("/:userId/:artworkId", removeBookmark);

module.exports = router;