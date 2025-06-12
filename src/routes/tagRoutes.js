const { Router } = require('express');
const tagController = require('../controllers/tagController')
const validarTag = require('../middleware/validarTag')
const router = Router()

router.get('/', tagController.mostrarTag)
router.post('/', validarTag, tagController.crearTag)
router.put('/:id', validarTag, tagController.actualizarTag)
router.delete('/:id', tagController.eliminarTag)

module.exports = router;