const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getUserProfile,
  createUserProfile,
  getProfileByHandle,
  getProfileByUserId,
  getAllProfiles,
  addNewExperience,
  addNewEducation,
  deleteEducation,
  deleteExperience,
  deleteProfile,
} = require("../../controllers/profile");

// Get logged in users profile
// route  : GET /api/profile
// access : Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);

// Create/Edit user profile
// route  : POST /api/profile
// access : Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createUserProfile
);

// Get a user by handle
// route  : GET /api/profile/handle/:handle
// access : Public
router.get("/handle/:handle", getProfileByHandle);

// Get a user by user id
// route  : GET /api/profile/user/:user_id
// access : Public
router.get("/user/:user_id", getProfileByUserId);

// Get all profile
// route  : GET /api/profile/all
// access : Public
router.get("/all", getAllProfiles);

// Add experience to profile
// route  : POST /api/profile/experience
// access : Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  addNewExperience
);

// Add education to profile
// route  : POST /api/profile/education
// access : Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  addNewEducation
);

// Delete an education
// route  : Delete /api/profile/education/:edu_id
// access : Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  deleteEducation
);

// Delete an experience
// route  : Delete /api/profile/experience/:exp_id
// access : Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  deleteExperience
);

// Delete Profile and user
// route  : Delete /api/profile
// access : Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteProfile
);

module.exports = router;
