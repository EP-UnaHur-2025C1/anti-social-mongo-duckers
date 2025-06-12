const Comment = require('../models/comment');
const mongoose = require('mongoose');

const crearComentario = async (req, res) => {
  try {
    const nuevoComentario = new Comment(req.body);
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear comentario", error });
  }
};

const mostrarComentarios = async (_, res) => {
  try {
    const comentarios = await Comment.find().select("comment");
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al mostrar comentarios", error });
  }
};

const mostrarComentario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const comentario = await Comment.findById(id);
    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: "Error al mostrar comentario", error });
  }
};

const actualizarComentario = async (req,res) =>{
  try {
    const comentarioActualizado = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comentarioActualizado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json({ message: 'Comentario actualizado', comment: comentarioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', error });
  }  
}

const eliminarComentario = async (req, res) => {
  try {
    const id = req.params.id;

    const comentarioAEliminar = await Comment.findById(id);
    if (!comentarioAEliminar) {
      return res.status(404).json({ message: `No existe el comentario con ID: ${id}` });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({message: "Comentario eliminado exitosamente"});
  } catch (error) {
    res.status(500).json({ message:"Error al eliminar comentario", error});
  }
};

module.exports = {
    crearComentario,
    mostrarComentarios,
    mostrarComentario,
    actualizarComentario,
    eliminarComentario
}