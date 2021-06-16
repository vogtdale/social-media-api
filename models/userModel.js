const mongoose = require("mongoose")
const {Schema} = mongoose
const {ObjectId} = mongoose.Schema

const userSchema = new Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String, select: false},
    friendList: {
        type: [ObjectId],
        ref: 'User'
      }

})

const User = mongoose.model("User", userSchema)

module.exports = User