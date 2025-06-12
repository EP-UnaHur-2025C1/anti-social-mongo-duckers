const { Router } = require('express')
const router = Router()
const validarPost = require('../middleware/validarPost')
const {validarActualizarImagen} = require('../middleware/validarPost_Images')
const validarTag = require('../middleware/validarTag')
const postController = require('../controllers/postController')

// Post
router.get('/', postController.mostrarPublicacion)
router.post('/', validarPost,postController.crearPublicacion)
router.put('/:id', validarPost, postController.actualizarPublicacion)
router.delete('/:id', postController.eliminarPublicacion)

// Images
router.put('/:id/images/:imageId', validarActualizarImagen ,postController.actualizarImagen)
router.delete('/:id/images/:imageId', postController.eliminarImagen)

// Tags
router.post('/:id/tags', postController.asociarTagAPost)
router.delete('/:id/tags', postController.desasociarTagDePost)
router.get('/:id/tags', postController.obtenerTagsDeUnPost)

module.exports = router
