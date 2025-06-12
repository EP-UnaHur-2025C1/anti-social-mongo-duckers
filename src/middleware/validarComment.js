const Comment = require('../models/comment');

const validarComment = async (req, res, next) => {
  try {
    const comment = new Comment(req.body); 
    await comment.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el comentario',
      error: error.message
    });
  }
};

module.exports = validarComment;