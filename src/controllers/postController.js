const Post = require('../models/post');
const PostImages = require('../models/postImages')
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

const mostrarPublicacion = async (req, res) => {
  try {
    const postId = req.params.id;
    const publicacion = await Post.findById(postId).populate("images", "url -_id -postId");
  
    res.status(200).json(publicacion)
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar publicacion", error });
  }
}

const actualizarPublicacion = async (req,res) =>{
  try {
    const postActualizado = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!postActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ message: 'Usuario actualizado', post: postActualizado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el post', error });
  }  
}

const eliminarPublicacion = async (req, res) => {
  try {
    const postId = req.params.id;

    const publicacionAEliminar = await Post.findById(postId);
    if (!publicacionAEliminar) {
      return res.status(404).json({ message: `No existe la Publicación con ID: ${postId}` });
    }

    await PostImages.deleteMany({ postId: publicacionAEliminar._id });
    await Comment.deleteMany({ postId: publicacionAEliminar._id });
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({message: "Publicación eliminada exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar Publicación", error});
  }
};

module.exports = {
    crearPublicacion,
    mostrarPublicaciones,
    mostrarPublicacion,
    actualizarPublicacion,
    eliminarPublicacion
}