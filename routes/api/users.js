const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  registerUser,
  loginUser,
  currentUser,
} = require("../../controllers/user");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  currentUser
);

module.exports = router;
