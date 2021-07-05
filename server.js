const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
var cors = require("cors");

dotenv.config({ path: "./config.env" });
const app = require("./app");
var bodyParser = require("body-parser");
app.use("/public/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connect to moongoose DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log("db connect success");
  });

const port = 7000;
const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
