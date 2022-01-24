const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  company: String,
  website: String,
  location: String,
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubUsername: String,
  experience: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: String,
        from: {
          type: Date,
          required: true,
        },
        to: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
  },
  education: {
    type: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
  },
  social: {
    youtube: String,
    twitter: String,
    facebook: String,
    linkedin: String,
    instagram: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Profile", profileSchema);
