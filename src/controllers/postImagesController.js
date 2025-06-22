const PostImages = require("../models/postImages");
const Post = require("../models/post");
const mongoose = require('mongoose')


const crearImagen = async (url, postId) => {
  try {
    const post = await Post.findById(postId)
    if (!post) throw new Error('Post no encontrado')
    const nuevaImagen = new PostImages({url,postId});
    await nuevaImagen.save();
    return nuevaImagen
  } catch (error) {
    return res.status(500).json({ message: "Error al crear imagen", error });
  }
    
}

const crearImagenPost = async (req, res) => {
  try {
    const { url, postId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const nuevaImagen = new PostImages({ url, post: postId });
    await nuevaImagen.save();

    return res.status(201).json(nuevaImagen);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear imagen", error });
  }
};

const mostrarImagenes = async (_, res) => {
  try {
    const imagenes = await PostImages.find().select("url post");
    return res.status(200).json(imagenes);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar imagenes", error });
  }
};

const actualizarImagenPost = async (req, res) => {
  try {
    const { url, postId } = req.body;
    const imagenActualizada = await PostImages.findByIdAndUpdate(req.params.id,{url, postId}, { new: true });
    if (!imagenActualizada) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    return res.status(200).json({ message: 'Imagen actualizada', PostImages: imagenActualizada });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la imagen', error });
  }  
};

const eliminarImagenPost = async (req, res) => {
  try {
    const imagenId = req.params.id;
    await PostImages.findByIdAndDelete(imagenId);

    return res.status(200).json({message: "Imagen eliminada exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar imagen", error});
  }
};

module.exports = {
  crearImagen,
  crearImagenPost,
  mostrarImagenes,
  actualizarImagenPost,
  eliminarImagenPost
};
