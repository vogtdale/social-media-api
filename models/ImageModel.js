const mongoose = require("mongoose")
const {Schema} =  mongoose
const { ObjectId } = mongoose.Schema

const profileSchema = new Schema({
    title: {
        type: String,
    },
    avatar: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
})

const Profile = mongoose.model("Profile", profileSchema)


module.exports = Profile
