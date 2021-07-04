const express = require("express");
const router = express.Router();
//const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

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
      if (username === "admin" && password === "admin") {
        res.status(200).json({
          msg: "Admin logged in successfully",
        });
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
