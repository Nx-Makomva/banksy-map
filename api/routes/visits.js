const express = require("express");
const router = express.Router();
const { addVisit, removeVisit } = require("../controllers/visits");


router.post("/", addVisit);
router.delete("/:artworkId", removeVisit);

module.exports = router;