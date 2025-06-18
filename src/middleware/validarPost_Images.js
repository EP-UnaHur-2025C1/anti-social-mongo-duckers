const PostImage = require('../models/postImages');

const validarPostImages = async (req, res, next) => {
  try {
    const postImage = new PostImage(req.body); 
    await postImage.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear imagen',
      error: error.message
    });
  }
};

module.exports ={
  validarPostImages
}