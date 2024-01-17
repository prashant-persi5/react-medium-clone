const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Valid email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: String,
    bio: String,
    favoritedArticles: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "article",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", user);
