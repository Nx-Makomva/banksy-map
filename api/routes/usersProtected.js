const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.get("/current", UsersController.getCurrentUser);
router.get("/:id", UsersController.getById);

module.exports = router;