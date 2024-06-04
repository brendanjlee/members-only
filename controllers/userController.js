const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("signup");
});

const sign_up_post = [
  // validate forms
  body("username", "Username must be at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Password must be at least 5 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),

  // process sign up request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.is_admin ? true : false,
    });

    if (!errors.isEmpty()) {
      res.render("signup", {
        user: user,
        errors: errors.array(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const newuser = new User({
        username: req.body.username,
        password: hashedPassword,
        isAdmin: req.body.is_admin ? true : false,
      });

      await newuser.save();
    });

    res.redirect("/login");
  }),
];

const log_in_get = asyncHandler(async (req, res, next) => {
  res.render("login");
});

const log_in_post = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

const sign_out_get = asyncHandler(async (req, res, next) => {
  res.send("sign out get");
});

module.exports = {
  sign_up_get,
  sign_up_post,
  log_in_get,
  log_in_post,
  sign_out_get,
};
