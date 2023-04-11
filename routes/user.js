const express = require("express");
const {
  getUserById,
  getProfile,
  follow,
  unfollow
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const router = express.Router();

//Params
router.param("userId", getUserById);

//Routes
router.get("/user", isSignedIn, isAuthenticated, getProfile);
router.post("/follow/:userId", isSignedIn, isAuthenticated, follow);
router.post("/unfollow/:userId", isSignedIn, isAuthenticated, unfollow);

module.exports = router;
