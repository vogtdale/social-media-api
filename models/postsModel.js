const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const postsSchema = new Schema(
  {
    desc: { type: String },
    img: { type: String },
    postedBy: { type: ObjectId, ref: "User" },
    likes: {
      type: [ObjectId],
      ref: "User",
    },
    dislikes: {
      type: [ObjectId],
      ref: "User",
    },
    comments: {
      type: [ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;
