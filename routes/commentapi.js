const app = require("express").Router();
const Comment = require("../models/comment");
const Posts = require("../models/postsModel");
const auth = require("../middleware/auth");

app.post("/newcomment", auth, async (req, res) => {
  const userId = req.id;

  const { postId, commentContent } = req.body;

  const newComment = new Comment({
    authorId: userId,
    postId,
    commentContent,
    lastEditedAt: null,
  });

  await newComment
    .save()
    .then((result) => {
      Posts.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: result._id } },
        { new: true }
      )
        .then((result) => {
          res.status(201).send(result);
        })
        .catch((err) =>
          console.log("newcomment post update failed. error: ", err)
        );
    })
    .catch((err) => console.log("newcomment save failed. error: ", err));
});

// GET COMMENT BY ID
app.get("/getcomment/:id", auth, async (req, res) => {
  const foundComment = await Comment.findOne({ _id: req.params.id });
  res.status(201).send(foundComment);
});

// EDIT COMMENT
app.post("/editcomment/:id", auth, async (req, res) => {
  // fetch comment from mongo by id, and tokenUser id = authorid, update with content
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: req.params.id, authorId: req.id },
    { $set: { commentContent: req.body.commentContent, lastEditedAt: Date.now() } },
    { new: true }
  );
  if (updatedComment) {
    res.status(201).send({ updatedComment });
  } else {
    res.status(400).send({ err: "edit failed" });
  }
});

// delete comment
app.delete("/deletecomment/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const { postId } = req.body;
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });

    const updatedPost = await Posts.findOneAndUpdate(
      { _id: postId },
      { $pullAll: { comments: [mongoose.Types.ObjectId(commentId)] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } catch (error) {}
});

module.exports = app;
