const express = require('express');
const router = express.Router();
const PicoPlacaControlador = require('../controllers/picoPlacaControlador');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, PicoPlacaControlador.obtenerTodos);
router.post('/', auth, PicoPlacaControlador.crear);
router.delete('/:id', auth, PicoPlacaControlador.eliminar);

module.exports = router;
