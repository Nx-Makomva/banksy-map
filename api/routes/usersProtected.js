const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.get("/current", UsersController.getCurrentUser);

module.exports = router;