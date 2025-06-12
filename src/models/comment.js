const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true,"El contenido del comentario es obligatorio"],
    minlength: [4,"El contenido del comentario debe tener al menos 4 caracteres"],
    maxlength: [250,"El contenido del comentario puede tenre un máximo de 250 caracteres"],
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true,"El comentario debe tener un usuario"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true,"El comentario debe tener un post"],
  },
},{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
