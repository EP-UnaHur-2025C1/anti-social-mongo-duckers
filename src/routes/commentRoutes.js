const { Router } = require('express');
const commentController = require('../controllers/commentController');
const {validarComment} = require('../middleware/validarSchema');
const {existeComentario, existePostBody, existeUserBody} = require('../middleware/validarExistencia')
const router = Router();

router.get('/', commentController.mostrarComentarios);
router.get('/:id', existeComentario, commentController.mostrarComentario);
router.post('/', validarComment, existePostBody, existeUserBody, commentController.crearComentario);
router.put('/:id', validarComment, existeComentario, existePostBody, existeUserBody, commentController.actualizarComentario);
router.delete('/:id', existeComentario, commentController.eliminarComentario);

module.exports = router;