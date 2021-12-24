const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport')
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const { MONGO_URI } = require("./config/keys");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});
//middlewares setup
app.use(express.json());
app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/user", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
