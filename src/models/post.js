const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true,"El post debe tener contenido"],
    minlength: [3,"El post debe tener al menos 3 caracteres"],
    maxlength: [250,"El post puede tener un máximo de 250 caracteres"],
  },
  imagenes: {
    type: [String],
    validate: {
      validator: function (arrayImagenes) {
        return Array.isArray(arrayImagenes) && arrayImagenes.length <= 5;
      },
      message: () => `Un post no puede tener más de 5 imágenes`,
    },
    default: [],
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true,"El post debe tener un usuario"],
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Tag"
  }]
});

postSchema.virtual('images', {
    ref: 'PostImages',      // El modelo al que hace referencia
    localField: '_id',      // Campo en el modelo Post
    foreignField: 'postId'  // Campo en el modelo Post_Image que referencia al Post
});

module.exports = mongoose.model("Post", postSchema);
