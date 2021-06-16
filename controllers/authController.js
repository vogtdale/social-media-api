const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, pwd, pwdVerified } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    if (pwd !== pwdVerified) {
      return res.status(401).send({ error: "Passwords dont match" });
    }

    const doesUserExist = await User.findOne({ email });
    if (doesUserExist) {
      return res
        .status(401)
        .send({ error: "User already exists with same email" });
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(pwd, salt);

    const user = new User({
      username,
      email,
      password,
    });

    const savedUser = user.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(0),
      })
      .clearCookie("token")
      .send({ msg: "User was sucessfully created" });
  } catch (error) {
    console.log(error);
    res.satus(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, pwd } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).send({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(pwd, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ error: "Wrong Email or Password" });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        usernarme: existingUser.username,
        email: existingUser.email,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        maxAge: 9000000,
      })
      .send({
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

const isloggedin = async (req, res) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.send({ msg: false });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: verified.email });
      return res.status(200).send({ msg: true, users: user.username, userId: user._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .clearCookie("token")
      .send({ msg: "Logout User" })
      .end();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  isloggedin,
  logout,
};
