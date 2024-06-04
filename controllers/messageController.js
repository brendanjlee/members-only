const message = require("../models/message");
const asyncHandler = require("express-async-handler");

// index of all messages
const index_get = asyncHandler(async (req, res, next) => {
  // fetch messages

  res.render("index", {
    title: "Message Board",
  });
});

const message_list_get = asyncHandler(async (req, res, next) => {
  res.send("Message list get not implemented");
});

const message_create_get = asyncHandler(async (req, res, next) => {
  res.render("messageForm");
});

const message_create_post = asyncHandler(async (req, res, next) => {
  res.send("message create post");
});

module.exports = {
  index_get,
  message_list_get,
  message_create_get,
  message_create_post,
};
