const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema

const commentSchema = new Schema(
  {
    authorId: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    postId: {
      type: ObjectId,
      ref: 'Post'
    },
    
    commentContent: {
      type: String,
    },
    
    lastEditedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment