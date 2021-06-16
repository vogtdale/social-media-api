const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema

const friendRequestSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      ref: 'User'
    },
    recipient: {
      type: ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
    },
    friendshipParticipants: {
      type: [Schema.Types.ObjectId]
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('FriendRequest', friendRequestSchema);