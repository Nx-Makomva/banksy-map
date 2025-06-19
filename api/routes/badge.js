const express = require('express');
const router = express.Router();

const BadgesController = require('../controllers/badge');

router.get("/", BadgesController.getAllBadges);
router.get("/:id", BadgesController.getBadgeById);
router.post("/", BadgesController.createBadge);
router.put("/:id", BadgesController.updateBadge);
router.delete("/:id", BadgesController.deleteBadge);
// router.get("/criteria/:type", BadgesController.getBadgesByCriteria);

module.exports = router;