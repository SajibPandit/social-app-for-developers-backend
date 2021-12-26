const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noProfile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(400).json(err));
  }
);

//Create or edit user profile

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};
    profileFields.user = req.user.id;
    if (profileFields.handle) profileFields.handle = req.body.handle;
    if (profileFields.company) profileFields.company = req.body.company;
    if (profileFields.website) profileFields.website = req.body.website;
    if (profileFields.location) profileFields.location = req.body.location;
    if (profileFields.bio) profileFields.bio = req.body.bio;
    if (profileFields.status) profileFields.status = req.body.status;
    if (profileFields.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;
    //Comma separated skills turn into array
    if (req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(",");
    }

    //Social
    profileFields.social = {};
    if (profileFields.youtube) profileFields.social.youtube = req.body.youtube;
    if (profileFields.facebook)
      profileFields.social.facebook = req.body.facebook;
    if (profileFields.instagram)
      profileFields.social.instagram = req.body.instagram;
    if (profileFields.linkedin)
      profileFields.social.linkedin = req.body.linkedin;
    if (profileFields.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // if handle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //Create
          new Profile(profileFields).save().then((profile) => {
            res.json(profile);
          });
        });
      }
    });
  }
);

module.exports = router;
