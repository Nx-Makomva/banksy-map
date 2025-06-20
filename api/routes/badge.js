const express = require('express');
const router = express.Router();

const BadgesController = require('../controllers/badge');

router.get("/", BadgesController.getAll);
router.get("/:id", BadgesController.getById);
router.post("/", BadgesController.create);
router.put("/:id", BadgesController.updateBadge);
router.delete("/:id", BadgesController.deleteBadge);
router.get("/criteria/:type", BadgesController.getByCriteria);

module.exports = router;