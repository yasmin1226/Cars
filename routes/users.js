const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const config = require("config");
require("dotenv").config();
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

//@ route          POST   api/users
//@descrption      Register user
//@access          Public
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("username", "Please enter a valid username").notEmpty(),
    check("password", "Password should be 6 characters or more").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, username, password } = req.body;
    try {
      //see if user exist
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User  already exists" }] });
      }

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      //create new user
      //save the user data to database
      user = await User.create({
        name: name,
        username: username,
        password: password,
      });

      //return JWT
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      };

      //create token
      const token = jwt.sign(payload, "jwtSecret");

      res.status(200).json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
