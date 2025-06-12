const { Router } = require('express');
const commentController = require('../controllers/commentController');
const validarComment = require('../middleware/validarComment');
const router = Router();

router.get('/', commentController.mostrarComentarios);
router.post('/', validarComment, commentController.crearComentario);
router.put('/:id', validarComment, commentController.actualizarComentario);
router.delete('/:id', commentController.eliminarComentario);

module.exports = router;