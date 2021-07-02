const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const { userAuth, adminAuth } = require("../middlewares/auth");

//@ route          api/auth/loadUser
//@descrption      user
//@access          private
//get authenticated user  data upon login
router.get("/loadUser", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

//@ route          api/auth/loadAdmin
//@descrption      admin
//@access          private
//get authenticated  admin data upon login
router.get("/loadAdmin", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

//@ route          POST   api/auth
//@descrption      authenticate and login user or admin & get his\her token
//@access          Public
router.post(
  "/",
  [
    check("username", "Please enter a valid username").exists(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      //see if user exist
      let user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //return JWT
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      };
      jwt.sign(payload, "jwtSecret", { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        if (user.isAdmin) {
          res.status(200).json({
            msg: "Admin logged in successfully",
            token,
            isAdmin: user.isAdmin,
          });
        }
        res.status(200).json({
          msg: "User logged in successfully",
          token,
          isAdmin: user.isAdmin,
        });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

//get user by id -- authenication needed here ###
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
