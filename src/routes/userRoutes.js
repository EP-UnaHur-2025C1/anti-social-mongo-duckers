const { Router } = require('express');
const userController = require('../controllers/userController')
const {validarUser} = require('../middleware/validarSchema')
const {existeUsuario, existeSeguidoId} = require('../middleware/validarExistencia')
const router = Router()

router.get('/', userController.mostrarUsuarios)
router.get('/:id', existeUsuario, userController.mostrarUsuario)
router.post('/', validarUser, userController.crearUsuario)
router.put('/:id', validarUser, existeUsuario, userController.actualizarUsuario)
router.delete('/:id', existeUsuario, userController.eliminarUsuario)

router.post('/:id/follow/:seguidoId', existeUsuario, existeSeguidoId, userController.seguirUsuario)
router.delete('/:id/unfollow/:seguidoId', existeUsuario, existeSeguidoId, userController.dejarDeSeguirUsuario)
router.get('/:id/seguidoId', existeUsuario, userController.obtenerSeguidosDeUnUsuario)

module.exports = router;