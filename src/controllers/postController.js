const Post = require('../models/post');
const PostImages = require('../models/postImages');
const Tag = require('../models/tag');
const User = require('../models/user');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const { crearImagen } = require('./postImagesController')

const crearPublicacion = async (req, res) => {
    try{
        const { usuario, content, imagenes } = req.body
        const user = await User.findById(usuario)
        
        if(!user){
            return res.status(404).json({message:"Usuario inexistente"})
        }

        const nuevoPost = new Post(req.body);
        await nuevoPost.save();

        /* ver qué onda, supuestamente mongoose maneja el array solo
        if (imagenes) {
            for (const imagen of imagenes) {
                await crearImagen(imagen.url, nuevoPost.id)
            }
        } */

        if (imagenes && imagenes.length > 0) {
            // Usamos Promise.all para crear imágenes concurrentemente y mejorar el rendimiento
            const imagePromises = imagenes.map(imagen => crearImagen(imagen.url, nuevoPost._id));
            await Promise.all(imagePromises);
        }
    
        const publicacionConImagenes = await Post.findById(nuevoPost._id).populate("images")
   
        return res.status(200).json(publicacionConImagenes)
    }catch(error){
        console.error(error)
        return res.status(500).json({ error: 'Error al crear publicación' })
    }
}


module.exports = {
    crearPublicacion,
}