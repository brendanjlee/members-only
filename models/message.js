const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  content: { type: String, required: true, maxLength: 500 },
  timeStamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("url").get(function () {
  return `/message/${this.id}`;
});

MessageSchema.virtual("formattedDate").get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_FULL_WITH_SECONDS
  );
});

module.exports = mongoose.model("Message", MessageSchema);
