const app = require("express").Router()
const cloudinary = require("../utils/cloudinary")
const upload = require("../utils/multer")
const Profile = require("../models/ImageModel")

app.post("/profile-image", upload.single('file'), async(req,res) =>  {

    try {
        const result = await cloudinary.uploader.upload(req.file.path)

        const profile = new Profile({
            title: req.body.title,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        })

        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error);
    }
})

app.get("/image/:avatar", async(req,res) => {
    const pId = req.params.avatar

    await Profile.findById(pId, (err,data) => {
        if (err) {
            res.send(err)
        }else {
            res.send(data.avatar)
        }
    })

})


app.get("/image", async(req,res) => {

    await Profile.find({}, (err,data) => {
        if (err) {
            res.send(err)
        }else {
            res.send(data)
        }
    })

})


app.delete("/image/:id", async (req, res) => {
    try {
      // Find user by id
      let profileimage = await Profile.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(profileimage.cloudinary_id);
      // Delete user from db
      await profileimage.remove();
      res.json(profileimage);
    } catch (err) {
      console.log(err);
    }
  });
  
  app.put("/image/:id", upload.single("file"), async (req, res) => {
    try {
      let profile = await Profile.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(profile.cloudinary_id);
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        title: req.body.title || profile.title,
        avatar: result.secure_url || profile.avatar,
        cloudinary_id: result.public_id || profile.cloudinary_id,
      };
      profile = await Profile.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(profile);
    } catch (err) {
      console.log(err);
    }
  });


module.exports = app