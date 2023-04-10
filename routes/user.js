const express = require("express");
const { getUserById, getProfile } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const router = express.Router();

//Params
router.param("userId", getUserById);

//Routes
router.get("/user", isSignedIn, isAuthenticated, getProfile);

module.exports = router;
