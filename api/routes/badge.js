const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const BadgesController = require('../controllers/badge');

router.get("/", BadgesController.getAll);
router.get("/:id", BadgesController.getById);
router.post("/", upload.single('icon'), BadgesController.create);
router.put("/:id", upload.single('icon'), BadgesController.updateBadge);
router.delete("/:id", BadgesController.deleteBadge);
router.get("/criteria/:type", BadgesController.getByCriteria);

module.exports = router;