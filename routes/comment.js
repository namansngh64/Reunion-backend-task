const express = require("express");
const { body } = require("express-validator");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getPostById } = require("../controllers/post");
const { createComment } = require("../controllers/comment");

const router = express.Router();

//Params
router.param("postId", getPostById);

//Routes
router.post(
  "/comment/:postId",
  body("comment", "Comment is required").isLength({ min: 1 }),
  isSignedIn,
  isAuthenticated,
  createComment
);

module.exports = router;
