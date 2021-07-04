const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadStorage = multer({ storage: storage });
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ err: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      throw Error("that problem not exist");
    } else {
      res.status(200).json(problem);
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ err: err.message });
  }
});
router.post("/", uploadStorage.single("file"), async (req, res) => {
  try {
    console.log("req.file", req.file);
    const data = { problemFile: req.file, problem: req.body.problem };
    const problem = await Problem.create(data);
    res.status(200).json(problem);
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ err: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) {
      throw Error("that problem not exist");
    } else {
      res.status(200).json(problem);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const proplem = await Problem.findByIdAndDelete(req.params.id);
    // if (!proplem) {
    //   throw Error("that proplem not exist");
    // }
    res.status(200).json({ msg: "problem deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

module.exports = router;
