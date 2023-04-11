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

exports.follow = async (req, res) => {
  let idx = req.profile.following.indexOf(req.user._id);
  if (idx === -1) {
    let authUser = await User.findById(req.profile._id);
    let f_user = await User.findById(req.user._id);
    authUser.following.push(f_user._id);
    f_user.followers.push(authUser._id);
    authUser.save((err, user) => {
      if (err) {
        return res.json({ error: "Something went wrong" });
      }
      f_user.save((err, fuser) => {
        if (err) {
          authUser.following.splice(idx, 1);
          authUser.save();
          return res.json({ error: "Somthing went wrong" });
        }
        return res.json({ message: `Following ${fuser.name}` });
      });
    });
  } else {
    return res.json({ message: "Already following" });
  }
};

exports.unfollow = async (req, res) => {
  let idx = req.profile.following.indexOf(req.user._id);
  if (idx !== -1) {
    let authUser = await User.findById(req.profile._id);
    let f_user = await User.findById(req.user._id);
    authUser.following.splice(idx, 1);
    let fidx = f_user.followers.indexOf(authUser._id);
    if (fidx !== -1) f_user.followers.splice(fidx, 1);
    authUser.save((err, user) => {
      if (err) {
        return res.json({ error: "Something went wrong" });
      }
      f_user.save((err, fuser) => {
        if (err) {
          authUser.following.push(f_user._id);
          authUser.save();
          return res.json({ error: "Somthing went wrong" });
        }
        return res.json({ message: `Unfollowed ${fuser.name}` });
      });
    });
  } else {
    return res.json({ message: "Already not following" });
  }
};
