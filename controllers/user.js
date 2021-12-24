const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Registers a user
// route  : POST /api/user/register
// access : Public
exports.registerUser = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm", //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) res.json(err);
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

// Login user
// route  : POST /api/user/login
// access : Public
exports.loginUser = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          email: user.email,
          avatar: user.avatar,
        };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: `Bearer ${token}` });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
};

// Return current user
// route  : Get /api/user/current
// access : Public
exports.currentUser = (req, res, next) => {
  const { id, name, email, avatar } = req.user;
  res.json({
    id,
    name,
    email,
    avatar,
  });
};
