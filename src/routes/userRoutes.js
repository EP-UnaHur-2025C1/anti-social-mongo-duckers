const { Router } = require('express');
const userController = require('../controllers/userController')
const validarUser = require('../middleware/validarUser')
const router = Router()

router.get('/', userController.mostrarUsuarios)
router.get('/:id', userController.mostrarUsuario)
router.post('/', validarUser, userController.crearUsuario)
router.put('/:id', validarUser, userController.actualizarUsuario)
router.delete('/:id', userController.eliminarUsuario)

router.post('/:userId/follow/:seguidoId' ,userController.seguirUsuario)
router.delete('/:userId/unfollow/:seguidoId' ,userController.dejarDeSeguirUsuario)
router.get('/:userId/following' ,userController.obtenerSeguidosDeUnUsuario)

module.exports = router;