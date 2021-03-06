const Profile = require("../models/Profile");
const User = require("../models/User");
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");

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

// Get all Profile
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
      res.json({
        success:true,
        length:profile.length,
        data:profile
      });
    })
    .catch((err) => res.status(404).json(err));
};

// Add experience to profile
// route  : POST /api/profile/experience
// access : Private

exports.addNewExperience = (req, res, next) => {
  const { errors, isValid } = validateExperienceInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json({
      success: false,
      data: errors,
    });
  }

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      console.log(req.user.id);

      //Add to experience array
      profile.experience.unshift(newExp);
      console.log(newExp);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.status(500).json({ success: false, data: err }));
    })
    .catch((err) => res.status(500).json({ success: false, data: err }));
};

// Add education to profile
// route  : POST /api/profile/education
// access : Private

exports.addNewEducation = (req, res, next) => {
  const { errors, isValid } = validateEducationInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json({
      success: false,
      data: errors,
    });
  }

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      console.log(req.user.id);

      //Add to education array
      profile.education.unshift(newEdu);
      console.log(newEdu);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.status(500).json({ success: false, data: err }));
    })
    .catch((err) => res.status(500).json({ success: false, data: err }));
};

// Delete an experience
// route  : DELETE /api/profile/experience/:exp_id
// access : Private

exports.deleteExperience = (req, res, next) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //Get remove index
      const removeIndex = profile.experience
        .map((item) => item._id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then((profile) => res.json({ success: true, data: profile }))
        .catch((err) => res.status(500).json({ success: false, data: err }));
    })
    .catch((err) => res.status(500).json({ success: false, data: err }));
};

// Delete an education
// route  : DELETE /api/profile/education/:edu_id
// access : Private

exports.deleteEducation = (req, res, next) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //Get remove index
      const removeIndex = profile.education
        .map((item) => item._id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then((profile) => res.json({ success: true, data: profile }))
        .catch((err) => res.status(500).json({ success: false, data: err }));
    })
    .catch((err) => res.status(500).json({ success: false, data: err }));
};

// Delete Profile and user
// route  : Delete /api/profile
// access : Private
exports.deleteProfile = (req, res, next) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findByIdAndRemove(req.user.id)
        .then(() => {
          res.json({
            success: false,
            data: { message: "Profile and user removed successfully" },
          });
        })
        .catch((err) => res.status(500).json({ success: false, data: err }));
    })
    .catch((err) => res.status(500).json({ success: false, data: err }));
};
