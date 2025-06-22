const Comment = require('../models/comment');
const mongoose = require('mongoose');

const crearComentario = async (req, res) => {
  try {
    const {comment, postId, userId} = req.body
    const nuevoComentario = new Comment({comment, postId, userId});
    await nuevoComentario.save();
    return res.status(201).json(nuevoComentario);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear comentario", error });
  }
};

const mostrarComentarios = async (_, res) => {
  try {
    const comentarios = await Comment.find().select("comment");
    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar comentarios", error });
  }
};

const mostrarComentario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const comentario = await Comment.findById(id);
 
    return res.status(200).json(comentario);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar comentario", error });
  }
};

const actualizarComentario = async (req,res) =>{
  try {
    const { comment, postId, userId } = req.body
    const comentarioActualizado = await Comment.findByIdAndUpdate(req.params.id,{comment, postId, userId}, { new: true });

    return res.status(200).json({ message: 'Comentario actualizado', comment: comentarioActualizado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el comentario', error });
  }  
}

const eliminarComentario = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({message: "Comentario eliminado exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar comentario", error});
  }
};

module.exports = {
    crearComentario,
    mostrarComentarios,
    mostrarComentario,
    actualizarComentario,
    eliminarComentario
}