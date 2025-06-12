const { Router } = require('express');
const userController = require('../controllers/userController')
const validarUser = require('../middleware/validarUser')
const router = Router()

router.get('/', userController.mostrarUsuarios)
router.post('/', validarUser, userController.crearUsuario)
router.put('/:id', validarUser, userController.actualizarUsuario)
router.delete('/:id', userController.eliminarUsuario)

router.post('/:id/users' ,userController.seguirUsuario)
router.delete('/:id/users' ,userController.dejarDeSeguirUsuario)

module.exports = router;