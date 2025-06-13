const Post = require('../models/post');
const PostImages = require('../models/postImages');
const Tag = require('../models/tag');
const User = require('../models/user');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const { crearImagen } = require('./postImagesController')

const crearPublicacion = async (req, res) => {
  try {
    const { userId, content, imagenes } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }

    const nuevoPost = new Post({userId,content});
    await nuevoPost.save();
    
    if(imagenes){
      for(const imagen of imagenes){
        await crearImagen(imagen.url, nuevoPost._id)
      }
    }

    const postConImagenes = await Post.findById(nuevoPost._id).populate('images', 'url -_id -postId')

    return res.status(201).json(postConImagenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear publicación" });
  }
};

const mostrarPublicaciones = async (_,res) => {
  try {
    const publicaciones = await Post.find().populate("images", "url -_id -postId");

    return res.status(200).json(publicaciones);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar publicaciones", error });
  }
}

module.exports = {
    crearPublicacion,
    mostrarPublicaciones
}