const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 20 },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);
