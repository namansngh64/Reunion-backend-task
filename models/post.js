const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    likes: [
      {
        type: ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        type: ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
