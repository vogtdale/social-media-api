const app = require("express").Router();
const {
  registerValidator,
} = require("../middleware/express-validator/expressValidator");
const {
  getAllUsers,
  createUser,
  sendFriendRequest,
  getFriendRequest,
  getAllFriendRequests,
  acceptFriendRequest,
  rejectFrindRequest,
  unfriend,
  searchUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth")

app.get("/users", getAllUsers);
app.post("/users", registerValidator, createUser);

// friendRequest
app.post("/sendfriendrequest", auth,sendFriendRequest)
app.get("/getfriendrequest/:id", auth,getFriendRequest)
app.get("/getfriendrequest", auth,getAllFriendRequests)
app.post("/accept", auth,acceptFriendRequest)
app.post("/reject", auth,rejectFrindRequest)
app.post("/unfriend", auth,unfriend)

app.get("/search", auth, searchUser)

module.exports = app;
