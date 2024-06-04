const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

// index of all messages
const index_get = asyncHandler(async (req, res, next) => {
  // fetch posts
  const messages = await Message.find()
    .populate("author")
    .sort({ timeStamp: -1 })
    .exec();

  // not logged in
  if (!req.isAuthenticated()) {
    res.render("index", {
      title: "Message Board",
      messages: messages,
    });
    return;
  }

  // fetch user from session
  const userID = req.session.passport.user;
  const user = await User.findById(userID);

  res.render("index", {
    title: "Message Board",
    user: user,
    messages: messages,
  });
});

const message_list_get = asyncHandler(async (req, res, next) => {
  res.send("Message list get not implemented");
});

const message_create_get = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.send("log in to post");
    return;
  }

  res.render("messageForm");
});

const message_create_post = [
  // validate
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Content cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // process message request
  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.send("login to post");
      return;
    }

    // limit uploads
    const numMessages = await Message.countDocuments({}).exec();
    if (numMessages > 100) {
      return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("messageForm", {
        errors: errors.array(),
      });
      return;
    }

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      timeStamp: Date.now(),
      author: req.session.passport.user,
    });

    await message.save();

    res.redirect("/");
  }),
];

module.exports = {
  index_get,
  message_list_get,
  message_create_get,
  message_create_post,
};
