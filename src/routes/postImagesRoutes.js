const { Router } = require('express');
const postImagesController = require('../controllers/postImagesController');
const {validarPostImages} = require('../middleware/validarPost_Images');
const router = Router();

router.get('/', postImagesController.mostrarImagenes);
router.post('/',validarPostImages, postImagesController.crearImagenPost);
router.put('/:id',validarPostImages, postImagesController.actualizarImagenPost);
router.delete('/:id', postImagesController.eliminarImagenPost);

module.exports = router;
