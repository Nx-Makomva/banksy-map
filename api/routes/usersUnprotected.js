const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.get("/me", UsersController.getCurrentUser);
router.post("/", UsersController.create);

module.exports = router;