const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear usuario", error });
  }
};

const mostrarUsuarios = async (_, res) => {
  try {
    const usuarios = await User.find().select("nickName email");
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar usuarios", error });
  }
};

const mostrarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const usuario = await User.findById(id);

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ message: "Error al mostrar usuario", error });
  }
};

const actualizarUsuario = async (req,res) =>{
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).json({ message: 'Usuario actualizado', user: usuarioActualizado });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }  
}

const eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id
    const usuarioAEliminar = await User.findById(id);

    await Post.deleteMany({ userId: usuarioAEliminar._id });
    await Comment.deleteMany({ userId: usuarioAEliminar._id });
    await usuarioAEliminar.deleteOne();

    return res.status(200).json({message: "Usuario eliminado exitosamente"});
  } catch (error) {
    return res.status(500).json({ message:"Error al eliminar usuario", error});
  }
};

const seguirUsuario = async (req, res) => {
  try {
    const { id, seguidoId } = req.params
    const user = await User.findById(id)
    const usuarioSeguido = await User.findById(seguidoId)

    if (id == seguidoId) {
      return res.status(404).json({ error: 'No puedes seguirte a ti mismo' })
    }

    const yaLoSigue = user.seguidos.includes(seguidoId)
    if (yaLoSigue) {
      return res.status(404).json({ error: 'Ya sigues a este usuario' })
    }

    await User.findByIdAndUpdate(id, { $push: { seguidos: seguidoId } }, { new: true });

    return res.status(201).json({ message: `Has seguido correctamente a ${usuarioSeguido.nickName}` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al seguir al usuario' })
  }
}

const dejarDeSeguirUsuario = async (req, res) => {
  try {
    const { id, seguidoId } = req.params

    const user = await User.findById(id)
    const usuarioSeguido = await User.findById(seguidoId)

    const noLoSigues = !user.seguidos.includes(seguidoId);
    if (noLoSigues) {
      return res.status(404).json({ error: 'No sigues a este usuario' })
    }

    await User.findByIdAndUpdate(id, { $pull: { seguidos: seguidoId } }, { new: true });

    return res.status(200).json({ message: `Has dejado de seguir a este usuario ${usuarioSeguido.nickName}` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al dejar de seguir a usuario' })
  }
}

const obtenerSeguidosDeUnUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('seguidos', 'nickName -_id');

    return res.status(200).json({ message: `Este usuario sigue a: ${user.seguidos}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los seguidos del usuario' });
  }
};


module.exports = {
    crearUsuario,
    mostrarUsuarios,
    mostrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    seguirUsuario,
    dejarDeSeguirUsuario,
    obtenerSeguidosDeUnUsuario
}