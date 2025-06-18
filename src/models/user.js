const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: [true, "El nickName es obligatorio"],
    minlength: [3, "El nickName debe tener al menos 3 caracteres"],
    maxlength : [30,"El nickName debe tener un máximo de 30 caracteres"],
    unique: [true,"El nickName no puede repetirse"],
  },
  email: {
    type: String,
    required: [true,"El email es obligatorio"],
    lowercase: [true,"El email debe estar en minúsculas"],
    match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/, 'Ingresa una dirección de correo electrónico válida.']
  },
  seguidos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
});

module.exports = mongoose.model("User", userSchema);
