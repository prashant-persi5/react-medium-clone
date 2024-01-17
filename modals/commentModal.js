const mongoose = require("mongoose");

const comment = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    article: {
      type: mongoose.Types.ObjectId,
      ref: "article",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", comment);
