const Tag = require('../models/tag');

const validarTag = async (req, res, next) => {
  try {
    const tag = new Tag(req.body); 
    await tag.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el tag',
      error: error.message
    });
  }
};

module.exports = validarTag;