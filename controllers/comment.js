const { validationResult } = require("express-validator");
const Comment = require("../models/comment");

exports.createComment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      error: errors.array()[0].msg
    });
  }
  let c = new Comment(req.body);
  c.user = req.profile._id;
  c.post = req.post._id;
  c.save((err, comment) => {
    if (err) {
      return res.json({ error: "Error creating comment" });
    }
    req.post.comments.push(comment._id);
    req.post.save((err, post) => {
      if (err) {
        Comment.findOneAndDelete({ _id: comment._id });
        return res.json({ error: "Something went wrong" });
      }
      return res.json({ commentId: comment._id });
    });
  });
};
