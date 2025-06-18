const { Router } = require('express')
const router = Router()
const validarPost = require('../middleware/validarPost')
// const {validarActualizarImagen} = require('../middleware/validarPost_Images')
//const validarTag = require('../middleware/validarTag')
const postController = require('../controllers/postController')

// Post
router.get('/', postController.mostrarPublicaciones)
router.get('/:id', postController.mostrarPublicacion)
router.post('/', validarPost, postController.crearPublicacion)
router.put('/:id', validarPost, postController.actualizarPublicacion)
router.delete('/:id', postController.eliminarPublicacion)

// // Images
router.put('/:postId/images/:imageId', /*validarActualizarImagen, */ postController.actualizarImagen)
router.delete('/:postId/images/:imageId', postController.eliminarImagen)

// // Tags
router.post('/:postId/tags/:tagId', postController.asociarTagAPost);
router.delete('/:postId/tags/:tagId', postController.desasociarTagDePost);
router.get('/:postId/tags', postController.obtenerTagsDeUnPost)

module.exports = router
