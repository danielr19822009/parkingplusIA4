const express = require('express');
const router = express.Router();
const VehiculoControlador = require('../controllers/vehiculoControlador');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, VehiculoControlador.obtenerTodos);
router.get('/:placa', auth, VehiculoControlador.buscarPlaca);
router.post('/', auth, VehiculoControlador.crear);

module.exports = router;
