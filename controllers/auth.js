const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      error: errors.array()[0].msg
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.json({ error: "User already exists" });
    }
    return res.json({ message: "User Created" });
  });
};
exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      error: errors.array()[0].msg
    });
  }
  const { email, password } = req.body;
  User.findOne({ email: email }).exec((err, user) => {
    if (err || !user) {
      return res.json({ error: "User not found" });
    }
    if (!user.authenticate(password)) {
      return res.json({ error: "Email or password incorrect" });
    }

    let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      issuer: "HostServer", //! Can set current hosted server url
      audience: "Client",
      expiresIn: "8h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.json({ token: token });
  });
};

exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth"
});

exports.isAuthenticated = (req, res, next) => {
  if (
    !req.auth ||
    !req.auth._id ||
    req.auth.aud !== "Client" ||
    req.auth.iss !== "HostServer"
  ) {
    return res.json({ error: "Access Denied - Not Authenticated" });
  }
  User.findById(req.auth._id).exec((err, user) => {
    if (err || !user) {
      return res.json({ error: "Access Denied - Not Authenticated" });
    }
    req.profile = user;
    req.profile.encry_password = undefined;
    req.profile.secret = undefined;
    next();
  });
};
