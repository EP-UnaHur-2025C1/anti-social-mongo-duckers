const Post = require('../models/post');
const User = require('../models/user');
const Tag = require('../models/tag');
const Comment = require('../models/comment');
const PostImages = require('../models/postImages');

const validarSchema = (modelo, nombre) => async (req, res, next) => {
  try {
    const schema = new modelo(req.body); 
    await schema.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: `Error al crear ${nombre}`,
      error: error.message
    });
  }
};

const validarPost = validarSchema(Post, 'post')
const validarUser = validarSchema(User, 'usuario')
const validarTag = validarSchema(Tag, 'tag')
const validarComment = validarSchema(Comment, 'comentario')
const validarPostImages = validarSchema(PostImages, 'imagen')

module.exports = {
    validarPost,
    validarUser,
    validarTag,
    validarComment,
    validarPostImages
};