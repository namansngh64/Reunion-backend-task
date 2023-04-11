const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    post: {
      type: ObjectId,
      ref: "Post",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
