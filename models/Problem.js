const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    problemFile: {
      // type: File,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
