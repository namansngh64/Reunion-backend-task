const express = require("express");
const { body } = require("express-validator");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  createPost,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  getPost,
  getAllUserPosts
} = require("../controllers/post");

const router = express.Router();

//Params
router.param("postId", getPostById);

//Routes
router.post(
  "/posts",
  body("title", "Title is required").isLength({ min: 1 }),
  body("description", "Description is required").isLength({ min: 1 }),
  isSignedIn,
  isAuthenticated,
  createPost
);
router.delete("/posts/:postId", isSignedIn, isAuthenticated, deletePost);
router.post("/like/:postId", isSignedIn, isAuthenticated, likePost);
router.post("/unlike/:postId", isSignedIn, isAuthenticated, unlikePost);
router.get("/posts/:postId", getPost);
router.get("/all_posts", isSignedIn, isAuthenticated, getAllUserPosts);

module.exports = router;
