const express = require("express");
const { body } = require("express-validator");
const { signup, signin } = require("../controllers/auth");

const router = express.Router();

//Routes
router.post(
  "/signup",
  body("name", "Name is required").isLength({ min: 3 }),
  body("email", "Enter valid email").isEmail(),
  body("password", "Password should be atleast 5 chars").isLength({ min: 5 }),
  signup
);
router.post(
  "/authenticate",
  body("email", "Enter valid email").isEmail(),
  body("password", "Password is required").isLength({ min: 1 }),
  signin
);

module.exports = router;
