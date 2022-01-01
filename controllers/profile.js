const Profile = require("../models/Profile");
const validateProfileInput = require("../validation/profile");

// Create/Edit user profile
// route  : POST /api/profile
// access : Private
exports.createUserProfile = (req, res, next) => {
  const { errors, isValid } = validateProfileInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) {
    profileFields.handle = req.body.handle;
  }
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubUsername)
    profileFields.githubUsername = req.body.githubUsername;
  //Comma separated skills turn into array
  if (req.body.skills !== undefined) {
    profileFields.skills = req.body.skills.split(",");
  }
  console.log(req.body.handle, req.body.status);
  console.log(profileFields);
  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

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
};

// Get logged in users profile
// route  : GET /api/profile
// access : Private
exports.getUserProfile = (req, res, next) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
};

// Get a user by handle
// route  : GET /api/profile/handle/:handle
// access : Public
exports.getProfileByHandle = (req, res, next) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
};

// Get a user by user id
// route  : GET /api/profile/user/:user_id
// access : Public
exports.getProfileByUserId = (req, res, next) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ noprofile: "There is profile no for this user" })
    );
};

// Get all profile
// route  : GET /api/profile/all
// access : Public
exports.getAllProfiles = (req, res, next) => {
  const errors = {};
  Profile.find({})
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profiles";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
};
