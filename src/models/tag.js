const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: [true,"El nombre del tag es obligatorio"],
    minlength: [3,"El nombre del tag debe tener al menos 3 caracteres"],
    maxlength: [20,"El nombre del tag puede tener un máxmido de 20 caracteres"],
  },
  posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }],
});

module.exports = mongoose.model("Tag", tagSchema);
