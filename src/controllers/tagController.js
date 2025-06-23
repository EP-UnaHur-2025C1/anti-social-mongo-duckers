const Tag = require('../models/tag');
const mongoose = require('mongoose');
const redisClient = require('../config/redisClient')

const crearTag = async (req, res) => {
  try {
    const nuevoTag = new Tag(req.body);
    await nuevoTag.save();

    await redisClient.del('tags:todos')
    return res.status(201).json(nuevoTag);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear tag", error });
  }
};

const mostrarTags = async (_, res) => {
  const cacheKey = 'tags:todos'
  try {
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }

    const tags = await Tag.find().select("tag").populate('posts');
    
    await redisClient.set(cacheKey, JSON.stringify(tags), { EX: 300 })

    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar tags", error });
  }
};

const mostrarTag = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const cacheKey = `tag:${id}`
    const cached = await redisClient.get(cacheKey)
    if(cached){
      return res.status(200).json(JSON.parse(cached))
    }

    const tag = await Tag.findById(id);

    await redisClient.set(cacheKey, JSON.stringify(tag), { EX: 300 })

    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar tag", error });
  }
};

const actualizarTag = async (req,res) =>{
  try {
    const tagActualizado = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await redisClient.del(`tag:${req.params.id}`)
    await redisClient.del('tags:todos')

    return res.status(200).json({ message: 'Tag actualizado', tag: tagActualizado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el tag', error });
  }  
}

const eliminarTag = async (req, res) => {
  try {
    const id = req.params.id;
    await Tag.findByIdAndDelete(id);

    await redisClient.del(`tag:${id}`)
    await redisClient.del('tags:todos')

    return res.status(200).json({message: "Tag eliminado exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar tag", error});
  }
};

module.exports = {
    crearTag,
    mostrarTags,
    mostrarTag,
    actualizarTag,
    eliminarTag
}