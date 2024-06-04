const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const sign_up_get = asyncHandler(async (req, res, next) => {
  const err = req.query.error;
  res.render("signup", { error: err });
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

    // check if user already exists
    const isDup = await User.findOne({ username: req.body.username });

    if (isDup != null) {
      res.redirect(
        `/sign-up?error=The username "${req.body.username}" already exists`
      );
      console.log(`username ${req.body.username} exists`);
      return;
    }

    const errUser = new User({
      username: req.body.username,
      password: "dummy",
      isAdmin: req.body.is_admin ? true : false,
    });

    if (!errors.isEmpty()) {
      res.render("signup", {
        user: errUser,
        errors: errors.array(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        isAdmin: req.body.is_admin ? true : false,
      });

      await user.save();
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
    failureMessage: "wrong password",
  }),
];

const sign_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = {
  sign_up_get,
  sign_up_post,
  log_in_get,
  log_in_post,
  sign_out_get,
};
