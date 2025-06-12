const PostImages = require("../models/postImages");
const Post = require("../models/post");
const mongoose = require('mongoose')

/*
const crearImagen = async (url, postId) => {
    const post = await Post.findByPk(postId)
    if (!post) throw new Error('Post no encontrado')
    const imagen = await Post_Images.create({ url, postId })
    return imagen
}
*/

const crearImagenPost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post inexistente" });
    }

    const nuevaImagen = new PostImages(req.body);
    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(500).json({ message: "Error al crear imagen", error });
  }
};

const mostrarImagenes = async (_, res) => {
  try {
    const imagenes = await PostImages.find().select("url post");
    res.status(200).json(imagenes);
  } catch (error) {
    res.status(500).json({ message: "Error al mostrar imagenes", error });
  }
};

const actualizarImagen = async (req, res) => {
  try {
    const imagenActualizada = await PostImages.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!imagenActualizada) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    res.status(200).json({ message: 'Imagen actualizada', PostImages: imagenActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la imagen', error });
  }  
};

const eliminarImagen = async (req, res) => {
  try {
    const id = req.params.id;
    const imagenAEliminar = await PostImages.findById(id);
    if (!imagenAEliminar) {
      return res.status(404).json({ message: `No existe la imagen con ID: ${id}` });
    }

    await PostImages.findByIdAndDelete(id);

    res.status(200).json({message: "Imagen eliminada exitosamente"});
  } catch (error) {
    res.status(500).json({ message:"Error al eliminar imagen", error});
  }
};

module.exports = {
//  crearImagen,
  crearImagenPost,
  mostrarImagenes,
  actualizarImagen,
  eliminarImagen,
};
