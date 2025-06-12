const { Router } = require('express');
const postImagesController = require('../controllers/postImagesController');
const {validarPostImages} = require('../middleware/validarPost_Images');
const router = Router();

router.get('/', postImagesController.mostrarImagenes);
router.post('/',validarPostImages, postImagesController.crearImagenPost);
router.put('/:id',validarPostImages, postImagesController.actualizarImagen);
router.delete('/:id', postImagesController.eliminarImagen);

module.exports = router;
