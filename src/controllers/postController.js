const Post = require('../models/post');
const PostImages = require('../models/postImages')
const Tag = require('../models/tag');
const Comment = require('../models/comment');
const { crearImagen } = require('./postImagesController')
const redisClient = require('../config/redisClient')

const crearPublicacion = async (req, res) => {
  try {
    const { userId, content, imagenes } = req.body;
    const nuevoPost = new Post({userId,content});
    await nuevoPost.save();
    
    if(imagenes){
      for(const imagen of imagenes){
        await crearImagen(imagen.url, nuevoPost._id)
      }
    }

    const postConImagenes = await Post.findById(nuevoPost._id).populate('images', 'url -_id -postId')

    await redisClient.del('publicaciones:todas')

    return res.status(201).json(postConImagenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear publicación" });
  }
};

const mostrarPublicaciones = async (_,res) => {
  const cacheKey = 'publicaciones:todas'
  try {
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }

    const publicaciones = await Post.find().populate("images", "url -postId");

    await redisClient.set(cacheKey, JSON.stringify(publicaciones), { EX: 300 })

    return res.status(200).json(publicaciones);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar publicaciones", error });
  }
}

const mostrarPublicacion = async (req, res) => {
  try {
    const id = req.params.id

    const cacheKey = `publicacion:${id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }

    const publicacion = await Post.findById(id).populate("images", "url -postId");

    await redisClient.set(cacheKey, JSON.stringify(publicacion), { EX: 300 })
  
    res.status(200).json(publicacion)
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar publicacion", error });
  }
}

const actualizarPublicacion = async (req,res) =>{
  try {
    const { imagenes } = req.body;
    const postActualizado = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if(imagenes){
      await PostImages.deleteMany({ postId: postActualizado._id });
      for(const imagen of imagenes){
        await crearImagen(imagen.url, postActualizado._id)
      }
    }
    
    const postConImagenes = await Post.findById(postActualizado._id).populate('images', 'url -_id -postId')

    await redisClient.del('publicaciones:todas')

    return res.status(200).json({ message: 'Publicación actualizada', post: postConImagenes });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la publicación', error });
  }  
}

const eliminarPublicacion = async (req, res) => {
  try {
    const postId = req.params.id;
    const publicacionAEliminar = await Post.findById(postId);

    await PostImages.deleteMany({ postId: publicacionAEliminar._id });
    await Comment.deleteMany({ postId: publicacionAEliminar._id });
    await publicacionAEliminar.deleteOne();

    await redisClient.del(`publicacion:${id}`)
    await redisClient.del('publicaciones:todas')

    return res.status(200).json({message: "Publicación eliminada exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar Publicación", error});
  }
};

const eliminarImagen = async (req,res)=>{
    try {
        const {id, imageId} = req.params
        await PostImages.findOneAndDelete({_id: imageId, postId: id})

        await redisClient.del(`publicacion:${id}`); 
        await redisClient.del('publicaciones:todas'); 

        res.status(200).json({message: "Imagen eliminada"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al eliminar imagen' })
    }
}

const actualizarImagen = async (req,res)=>{
    try {
      const { id, imageId } = req.params
      const imagen = await PostImages.findOneAndUpdate({_id: imageId, postId: id}, req.body, { new: true })

      await redisClient.del(`publicacion:${req.params.id}`)
      await redisClient.del('publicaciones:todas')

      res.status(200).json(imagen)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar imagen' })
    }
}

const asociarTagAPost = async (req,res) =>{
  try {
    const { id, tagId } = req.params
    const publicacion = await Post.findById(id);
    const etiqueta = await Tag.findById(tagId);

    if(!etiqueta){
      return res.status(404).json({message: `Tag no encontrado`})
    }
    
    if (!publicacion.tags.includes(tagId)) {
      await Post.findByIdAndUpdate(id, { $push: { tags: tagId } });
      await Tag.findByIdAndUpdate(tagId, { $push: { posts: id } });
      
      return res.status(200).json({message: `El Tag ${etiqueta.tag} asociado a la publicación`})
    } else {
      return res.status(200).json({message: `El Tag ${etiqueta.tag} ya se encontraba asociado a la publicación`})
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al asociar tag al post' })
  }
}

const desasociarTagDePost = async (req, res) => {
  try {
    const { id, tagId } = req.params;

    const publicacion = await Post.findById(id);
    const etiqueta = await Tag.findById(tagId);

    if (!etiqueta) {
      return res.status(404).json({ message: `Tag no encontrado` });
    }

    if (publicacion.tags.includes(tagId)) {
      await Post.findByIdAndUpdate(id, { $pull: { tags: tagId } });
      await Tag.findByIdAndUpdate(tagId, { $pull: { posts: id } });

      return res.status(200).json({ message: `El Tag ${etiqueta.tag} ha sido desasociado de la publicación` });
    } else {
      return res.status(200).json({ message: `El Tag ${etiqueta.tag} no estaba asociado a la publicación` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al desasociar tag del post' });
  }
};

const obtenerTagsDeUnPost = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `publicacion:${id}:tags`; 

    const cachedTags = await redisClient.get(cacheKey);
    if (cachedTags) {
      return res.status(200).json(JSON.parse(cachedTags));
    }

    const publicacion = await Post.findById(id).populate('tags');

    const tags = publicacion.tags || [];
    await redisClient.set(cacheKey, JSON.stringify(tags), { EX: 300 });

    return res.status(200).json(publicacion.tags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los tags de la publicación' });
  }
};

module.exports = {
    crearPublicacion,
    mostrarPublicaciones,
    mostrarPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    eliminarImagen,
    actualizarImagen,
    asociarTagAPost,
    desasociarTagDePost,
    obtenerTagsDeUnPost
}