const { validationResult } = require("express-validator");

const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequest");

const getAllUsers = async (req, res) => {
  await User.find({}, (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Coundnt find any users" });
    } else {
      return res.status(200).send(data);
    }
  }).populate("friendList")
};

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = new User({
    username,
    email,
    password,
  });

  await user.save((err, data) => {
    if (err) {
      return res.status(401).send({ error: "Coundnt create User" });
    } else {
      return res.status(200).send({ msg: "User created", data: data });
    }
  });
};

// send friend request
const sendFriendRequest = async (req, res) => {
  const userId = req.id;
  const recipientId  = req.body.recipient;

  const foundFriend = await FriendRequest.findOne({
    sender: userId,
    recipient: recipientId,
  });

  if (foundFriend) {
    return res.status(400).send();
  }

  const newFriendRequest = new FriendRequest({
    sender: userId,
    recipient: recipientId,
    status: "pending",
  });

  newFriendRequest.save((err, data) => {
    if (err) {
      return res.status(400).send({ error: error.message });
    } else {
      return res.status(200).send({
        msg: "Your Friend Request has been sent...",
        friendrequest: data,
      });
    }
  });
};

// get friendRequest of the current user
const getFriendRequest = async (req, res) => {
  const request = await FriendRequest.find({ recipient: req.params.id }).populate("sender", "recipient");

  res.status(200).send(request);
};

const getAllFriendRequests = async(req,res) => {
        const { profileUserId } = req.query;
        const { userId } = req.id;
      
        const foundFriendRequest1 = await FriendRequest.findOne({
          sender: userId,
          recipient: profileUserId,
        });
        const foundFriendRequest2 = await FriendRequest.findOne({
          sender: profileUserId,
          recipient: userId,
        });
        let friendRequestAlreadyExists = false;
        if (foundFriendRequest1 || foundFriendRequest2) {
          friendRequestAlreadyExists = true;
        }
        res.send(friendRequestAlreadyExists);
      
}

// get single friend request by id, returns true or false
// determines if current user has pending or existing
// friend request with owner of profile being viewed

// accept friend request
const acceptFriendRequest = async (req, res) => {
  const recipientId = req.id;
  const senderId = req.body.sender;
  await User.findOneAndUpdate(
    { _id: senderId, friendList: { $nin: [recipientId] } },
    { $push: { friendList: recipientId } },
    { new: true }
  );
  const updatedRecipient = await User.findOneAndUpdate(
    { _id: recipientId, friendList: { $nin: [senderId] } },
    {
      $push: { friendList: senderId },
    },
    { new: true }
  );
  if (updatedRecipient) {
    await FriendRequest.findOneAndUpdate(
      {
        sender: senderId,
        recipient: recipientId,
      },
      {
        $set: { status: "accepted" },
        $push: { friendshipParticipants: [senderId, recipientId] },
      },
      { new: true }
    );

    const updatedRequests = await FriendRequest.find({
      recipient: req.id,
      status: "pending",
    });
    res.status(200).send({
      updatedRequests: updatedRequests,
      updatedUserFriendList: updatedRecipient.friendList,
    });
  }
};

// reject friend request
const rejectFrindRequest = async (req, res) => {
  const recipientId = req.id;
  const senderId = req.body.sender;
  await FriendRequest.findOneAndDelete({
    sender: senderId,
    recipient: recipientId,
  });

  const updatedRequests = await FriendRequest.find({
    recipient: req.id,
    status: "pending",
  });

  res.status(200).send({
    updatedRequests: updatedRequests,
  });
};

// unfriend or blaclist user
const unfriend = async (req, res) => {
  const userId = req.id;
  const  friendId  = req.body.friendList;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $pullAll: { friendList: [friendId] } },
    { new: true }
  );
  const updatedFriend = await User.findOneAndUpdate(
    { _id: friendId },
    { $pullAll: { friendList: [userId] } },
    { new: true }
  );

  await FriendRequest.findOneAndDelete({
    $and: [
      { friendshipParticipants: { $in: [friendId] } },
      { friendshipParticipants: { $in: [userId] } },
    ],
  });

  res.status(200).send({ updatedUser, updatedFriend });
};

const searchUser = async(req,res) =>  {
  const {searchTerm} = req.query

  try {
    const searchField = new RegExp(searchTerm, 'i')

    const searchUser = await User.find({ $or: [{username: searchField}]})

    res.json(searchUser)
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message)
  }  


}

module.exports = {
  getAllUsers,
  createUser,
  sendFriendRequest,
  getFriendRequest,
  getAllFriendRequests,
  acceptFriendRequest,
  rejectFrindRequest,
  unfriend,
  searchUser
};

