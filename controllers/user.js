const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.json({ error: "User not found" });
    }
    req.user = user;
    req.user.salt = undefined;
    req.user.encry_password = undefined;
    next();
  });
};

exports.getProfile = (req, res) => {
  return res.json({
    name: req.profile.name,
    follower_count: req.profile.followers.length,
    following_count: req.profile.following.length
  });
};
