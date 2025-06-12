const User = require('../models/user');

const validarUser = async (req, res, next) => {
  try {
    const user = new User(req.body); 
    await user.validate();          
    next();                          
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

module.exports = validarUser;