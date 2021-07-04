const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.set("view engine", "ejs");
//middleware

app.use(cookieParser());
app.use(express.json());

//

app.use(express.static(`${__dirname}/views`));
app.use(express.static(`${__dirname}/assets`));
app.use(express.static(`${__dirname}/uploads`));

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/problem", require("./routes/problem"));

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/table", (req, res) => {
  res.render("table");
});
app.get("/addproblem", (req, res) => {
  res.render("addProblem");
});

module.exports = app;
