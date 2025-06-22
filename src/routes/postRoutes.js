const { Router } = require('express')
const router = Router()
const validarPost = require('../middleware/validarPost')
const postController = require('../controllers/postController')
const {existePublicacion, existeImagenPost, existeTagPost, existeUserBody} = require('../middleware/validarExistencia')

// Post
router.get('/', postController.mostrarPublicaciones)
router.get('/:id', existePublicacion, postController.mostrarPublicacion)
router.post('/', validarPost, existeUserBody, postController.crearPublicacion)
router.put('/:id', validarPost, existePublicacion, existeUserBody, postController.actualizarPublicacion)
router.delete('/:id', existePublicacion, postController.eliminarPublicacion)

// // Images
router.put('/:id/images/:imageId', existePublicacion, existeImagenPost, postController.actualizarImagen)
router.delete('/:id/images/:imageId', existePublicacion, existeImagenPost, postController.eliminarImagen)

// // Tags
router.post('/:id/tags/:tagId', existePublicacion, existeTagPost, postController.asociarTagAPost);
router.delete('/:id/tags/:tagId', existePublicacion, existeTagPost, postController.desasociarTagDePost);
router.get('/:id/tags', existePublicacion, postController.obtenerTagsDeUnPost)

module.exports = router
