const express = require("express");
const mongoose = require("mongoose");

const { MONGO_URI } = require("./config/keys");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 8000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
