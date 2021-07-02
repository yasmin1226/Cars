const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

//middleware

app.use(cookieParser());
app.use(express.json());

//

app.use(express.static(`${__dirname}/public`));

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.get("/", (req, res) => {
  res.send("heruko!");
});

module.exports = app;
