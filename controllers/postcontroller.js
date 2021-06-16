const cloudinary = require("../utils/cloudinary")
const uplaod = require("../utils/multer")
const Posts = require("../models/postsModel")

const uplaodposts = upload.single('file') = async(req,res) => {
    console.log(req.id);
}

module.exports = {
    uplaodposts
}