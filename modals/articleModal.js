const mongoose = require("mongoose");

const article = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    tagList: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("article", article);
