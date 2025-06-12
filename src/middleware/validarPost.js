const Post = require('../models/post');

const validarPost = async (req, res, next) => {
  try {
    const post = new Post(req.body); 
    await post.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el post',
      error: error.message
    });
  }
};

module.exports = validarPost;