const { Router } = require('express');
const postImagesController = require('../controllers/postImagesController');
const {validarPostImages} = require('../middleware/validarPost_Images');
const {existeImagen, existePostBody} = require('../middleware/validarExistencia')

const router = Router();

router.get('/', postImagesController.mostrarImagenes);
router.post('/', validarPostImages, existePostBody, postImagesController.crearImagenPost);
router.put('/:id', validarPostImages, existeImagen, existePostBody, postImagesController.actualizarImagenPost);
router.delete('/:id', existeImagen, postImagesController.eliminarImagenPost);

module.exports = router;
