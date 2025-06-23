const PostImages = require("../models/postImages");
const Post = require("../models/post");
const mongoose = require('mongoose')
const redisClient = require('../config/redisClient')

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
    
    const nuevaImagen = new PostImages({ url, postId });
    await nuevaImagen.save();

    await redisClient.del('imagenes:todas')
    return res.status(201).json(nuevaImagen);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear imagen", error });
  }
};

const mostrarImagenes = async (_, res) => {
  const cacheKey = 'imagenes:todos'
  try {
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }
    
    const imagenes = await PostImages.find().select("url postId");

    await redisClient.set(cacheKey, JSON.stringify(imagenes), { EX: 300 })

    return res.status(200).json(imagenes);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar imagenes", error });
  }
};

const actualizarImagenPost = async (req, res) => {
  try {
    const { url, postId } = req.body;
    const imagenActualizada = await PostImages.findByIdAndUpdate(req.params.id,{url, postId}, { new: true });

    await redisClient.del(`imagen:${req.params.id}`)
    await redisClient.del('imagenes:todos')

    return res.status(200).json({ message: 'Imagen actualizada', PostImages: imagenActualizada });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la imagen', error });
  }  
};

const eliminarImagenPost = async (req, res) => {
  try {
    const id = req.params.id;
    await PostImages.findByIdAndDelete(id);

    await redisClient.del(`imagen:${id}`)
    await redisClient.del('imagenes:todos')

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
