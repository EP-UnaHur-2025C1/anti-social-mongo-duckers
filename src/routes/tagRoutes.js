const { Router } = require('express');
const tagController = require('../controllers/tagController')
const {validarTag} = require('../middleware/validarSchema')
const {existeTag} = require('../middleware/validarExistencia')
const router = Router()

router.get('/', tagController.mostrarTags)
router.get('/:id', existeTag, tagController.mostrarTag)
router.post('/', validarTag, tagController.crearTag)
router.put('/:id', validarTag, existeTag, tagController.actualizarTag)
router.delete('/:id', existeTag, tagController.eliminarTag)

module.exports = router;