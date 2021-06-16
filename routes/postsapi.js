const app = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const Posts = require("../models/postsModel");
const User = require("../models/userModel")

// create a post
app.post("/post", auth, upload.single("file"), async (req, res) => {
  const userId = req.id;

  const result = await cloudinary.uploader.upload(req.file.path);

  const newpost = new Posts({
    desc: req.body.desc,
    img: result.secure_url,
    postedBy: userId,
  });

  await newpost.save((err, data) => {
    if (err) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(200).send({ msg: "Success", data: data });
    }
  });
});

// get all posts
app.get("/post", auth, async (req, res) => {
  await Posts.find({}, (err, data) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({ posts: data });
    }
  }).populate("postedBy").populate("likes").populate("comments")
});

app.get('/scrollposts', async (req, res) => {
  let { count, start } = req.query;
  count = Number(count);
  start = Number(start);
  const page = await Posts.find().populate("postedBy").populate("likes").populate("comments")
    .sort({ updatedAt: -1 })
    .skip(count * (start - 1))
    .limit(count);
  res.send(page);
});

// get post by id
app.get('/post/:postid', auth, async (req, res) => {
  const postById = await Posts.findOne({ _id: req.params.postid }).populate("postedBy").populate("likes").populate("comments");
  res.send(postById);
});

// get posts by author id
app.get('/getpostsbyuser/:id', auth, async (req, res) => {
  Posts.find({ postedBy: req.params.id }).populate("postedBy").populate("likes").populate("comments").then(result => {
    res.send(result);
  });
});

//get timeline posts
app.get("/timeline/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Posts.find({ postedBy: currentUser._id }).populate("postedBy").populate("likes").populate("dislikes").populate("comments");
    const friendPosts = await Promise.all(
      currentUser.friendList.map((friendId) => {
        return Posts.find({ postedBy: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

// LIKE POST
app.post("/likepost/:id", auth, async (req, res) => {
  const foundPost = await Posts.findOne({ _id: req.params.id });
  if (foundPost.likes.includes(req.id)) {
    res.status(422).send("error: post already liked by this user");
  } else {
    const updatedPost = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: req.id } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});

// DISLIKE POST
app.post("/dislikepost/:id", auth, async (req, res) => {
  const foundPost = await Posts.findOne({ _id: req.params.id });
  if (foundPost.dislikes.includes(req.id)) {
    res.status(422).send("error: post already disliked by this user");
  } else {
    const updatedPost = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { dislikes: req.id } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});

// REMOVE LIKE
app.post("/removelikepost/:id", auth, async (req, res) => {
  const foundPost = await Posts.findOne({ _id: req.params.id });
  if (foundPost.likes.includes(req.id)) {
    const updatedPost = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { likes: [req.id] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    res.status(422).send("error: post not yet liked by this user");
  }
});

// REMOVE DISLIKE
app.post("/removedislikepost/:id", auth, async (req, res) => {
  const foundPost = await Posts.findOne({ _id: req.params.id });
  if (foundPost.dislikes.includes(req.id)) {
    const updatedPost = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { dislikes: [req.id] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    res.status(422).send("error: post not yet disliked by this user");
  }
});

module.exports = app;
