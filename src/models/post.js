const mongoose = require("mongoose");
const { postImagesSchema } = require("../models/postImages")

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true,"El post debe tener contenido"],
    minlength: [3,"El post debe tener al menos 3 caracteres"],
    maxlength: [250,"El post puede tener un máximo de 250 caracteres"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true,"El post debe tener un usuario"],
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Tag"
  }]
  },
  {
    toJSON: { virtuals: true },  // Esto incluye virtuals cuando se convierte a JSON
    toObject: { virtuals: true } // Esto incluye virtuals cuando se convierte a objeto
  });

postSchema.virtual('images', {
    ref: 'PostImages',      // El modelo al que hace referencia
    localField: '_id',      // Campo en el modelo Post
    foreignField: 'postId'  // Campo en el modelo Post_Image que referencia al Post
});

module.exports = mongoose.model("Post", postSchema);
