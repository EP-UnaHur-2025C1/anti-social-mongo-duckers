const Post = require('../models/post')
const User = require('../models/user')
const Tag = require('../models/tag')
const Comment = require('../models/comment')
const PostImages = require('../models/postImages')

const validarExistenciaId = (modelo, data = 'id', cuerpo, nombre) => async (req, res, next) => {
    try {
        const id = req[cuerpo][data];
        const existeId = await modelo.findById(id)
        if (!existeId) {
          return res.status(404).json({ message: `${nombre} inexistente.` });
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: "Error al validar existencia", error });
    }
}

// Validaciones Post
const existePublicacion = validarExistenciaId(Post, 'id', 'params', 'Publicación')
const existeUserBody = validarExistenciaId(User, 'userId', 'body', 'Usuario')
const existeImagenPost= validarExistenciaId(PostImages, 'imageId', 'params', 'Imagen')
const existeTagPost = validarExistenciaId(Tag, 'tagId', 'params', 'Tag')

// Validaciones Imagenes
const existeImagen= validarExistenciaId(PostImages, 'id', 'params', 'Imagen')
const existePostBody = validarExistenciaId(Post, 'postId', 'body', 'Post');

// Validaciones Usuarios
const existeUsuario = validarExistenciaId(User, 'id', 'params', 'Usuario')
const existeSeguidoId = validarExistenciaId(User, 'seguidoId', 'params', 'Follower')

// Validaciones Tags
const existeTag = validarExistenciaId(Tag, 'id', 'params', 'Tag')

// Validaciones Comentarios
const existeComentario = validarExistenciaId(Comment, 'id', 'params', 'Comentario')


module.exports = {
    existePublicacion,
    existeUserBody,
    existeUsuario,
    existeSeguidoId,
    existeTag,
    existeTagPost,
    existeComentario,
    existeImagen,
    existeImagenPost,
    existePostBody
}
