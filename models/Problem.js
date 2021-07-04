const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
