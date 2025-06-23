const mongoose = require("mongoose");
const validator = require("validator");

const postImagesSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true,"La url es obligatoria"],
    validate: [validator.isURL, "Url invalida"]
  },
  postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true]
    }
});

module.exports = mongoose.model("PostImages", postImagesSchema);
