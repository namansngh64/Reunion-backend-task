const { validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      error: errors.array()[0].msg
    });
  }
  let post = new Post(req.body);
  post.user = req.profile._id;
  post.save((err, post) => {
    if (err) {
      return res.json({ error: "Error in creating post" });
    }
    // let h = JSON.stringify(post.createdAt).slice(1, 11);
    // let t = JSON.stringify(post.createdAt).slice(12, 20);
    return res.json({
      id: post._id,
      title: post.title,
      description: post.description,
      created_time: post.createdAt
    });
  });
};
exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((err, post) => {
    if (err || !post) {
      return res.json({ error: "Post not found" });
    }
    req.post = post;
    next();
  });
};

exports.deletePost = (req, res) => {
  if (JSON.stringify(req.post.user) !== JSON.stringify(req.profile._id)) {
    return res.json({ error: "You are not authorised to delete this post" });
  }
  Post.findOneAndDelete({ _id: req.post._id }, (err, post) => {
    if (err) {
      return res.json({ error: "Deletion failed" });
    }
    return res.json({ message: "Post deleted" });
  });
};

exports.likePost = (req, res) => {
  let idx = req.post.likes.indexOf(req.profile._id);
  if (idx === -1) {
    req.post.likes.push(req.profile._id);
    Post.findOneAndUpdate(
      { _id: req.post._id },
      { $set: { likes: req.post.likes } },
      { new: true },
      (err, post) => {
        if (err) {
          return res.json({ error: "Somthing went wrong" });
        }
        return res.json({ message: "Post liked" });
      }
    );
  } else {
    return res.json({ message: "Already liked" });
  }
};

exports.unlikePost = (req, res) => {
  let idx = req.post.likes.indexOf(req.profile._id);
  if (idx !== -1) {
    req.post.likes.splice(idx, 1);
    Post.findOneAndUpdate(
      { _id: req.post._id },
      { $set: { likes: req.post.likes } },
      { new: true },
      (err, post) => {
        if (err) {
          return res.json({ error: "Somthing went wrong" });
        }
        return res.json({ message: "Like removed" });
      }
    );
  } else {
    return res.json({ message: "Already not liked" });
  }
};

exports.getPost = (req, res) => {
  return res.json({
    postId: req.post._id,
    title: req.post.title,
    description: req.post.description,
    user: req.post.user,
    likesCount: req.post.likes.length,
    commentsCount: req.post.comments.length
  });
};

exports.getAllUserPosts = (req, res) => {
  Post.find({ user: req.profile._id })
    .populate("comments", "_id comment user")
    .sort("createdAt")
    .exec((err, posts) => {
      if (err) {
        return res.json({ error: "Error fetching posts" });
      }
      if (posts.length === 0) return res.json({ message: "No post found" });
      let resposts = [];
      posts.map((post) => {
        let a = {};
        a.id = post._id;
        a.title = post.title;
        a.desc = post.description;
        a.created_at = post.createdAt;
        a.comments = post.comments;
        a.likes = post.likes.length;
        resposts.push(a);
      });
      return res.json(resposts);
    });
};
