const express = require("express");
const router = express.Router();
const { addBookmark, removeBookmark, getAllUserBookmarks } = require("../controllers/bookmarks");


router.post("/", addBookmark);
router.get("/", getAllUserBookmarks);
router.delete("/:artworkId", removeBookmark);

module.exports = router;