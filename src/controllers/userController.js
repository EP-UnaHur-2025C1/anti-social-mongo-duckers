const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

const mostrarUsuarios = async (_, res) => {
  try {
    const usuarios = await User.find().select("nickName email");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al mostrar usuarios", error });
  }
};

const mostrarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al mostrar usuario", error });
  }
};

const actualizarUsuario = async (req,res) =>{
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario actualizado', user: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }  
}

const eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    const usuarioAEliminar = await User.findById(id);
    if (!usuarioAEliminar) {
      return res.status(404).json({ message: `No existe el usuario con ID: ${id}` });
    }

    await Post.deleteMany({ usuario: usuarioAEliminar._id });
    await Comment.deleteMany({ usuario: usuarioAEliminar._id });
    await User.findByIdAndDelete(id);

    res.status(200).json({message: "Usuario eliminado exitosamente"});
  } catch (error) {
    res.status(500).json({ message:"Error al eliminar usuario", error});
  }
};

// const seguirUsuario = async (req,res) => {
//     try {
//         const userId = req.params.id
//         const { seguidoId } = req.body

//         const user = await User.findByPk(userId)
//         const usuarioSeguido = await User.findByPk(seguidoId)
        
//         if(!user || !usuarioSeguido) {
//             return res.status(404).json({ error: 'Usuario/s no encontrado/s' })
//         }
//         if(userId == seguidoId){
//             return res.status(404).json({ error: 'No puedes seguirte a ti mismo' })
//         }
        
//         const seguidos = await user.getSeguidos()
//         const yaLoSigue = seguidos.some(unUser => unUser.id === seguidoId)
//         if(yaLoSigue){
//             return res.status(404).json({ error: 'Ya sigues a este usuario' })
//         }

//         await user.addSeguido(seguidoId)

//         return res.status(201).json({ message: 'Has seguido correctamente a este usuario' })
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ error: 'Error al seguir al usuario' })
//     }    
// }

// const dejarDeSeguirUsuario = async (req,res) => {
//     try {
//         const userId = req.params.id
//         const { seguidoId } = req.body

//         const user = await User.findByPk(userId)
//         const usuarioSeguido = await User.findByPk(seguidoId)
        
//         if(!user || !usuarioSeguido) {
//             return res.status(404).json({ error: 'Usuario/s no encontrado/s' })
//         }
        
//         const seguidos = await user.getSeguidos()
//         const noLoSigues = !seguidos.some(unUser => unUser.id === seguidoId)
//         if(noLoSigues){
//             return res.status(404).json({ error: 'No sigues a este usuario' })
//         }

//         await user.removeSeguido(seguidoId)

//         return res.status(200).json({ message: 'Has dejado de seguir a este usuario' })
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ error: 'Error al dejar de seguir a usuario' })
//     }    
// }

module.exports = {
    crearUsuario,
    mostrarUsuarios,
    mostrarUsuario,
    actualizarUsuario,
    eliminarUsuario//,
    // seguirUsuario,
    // dejarDeSeguirUsuario
}