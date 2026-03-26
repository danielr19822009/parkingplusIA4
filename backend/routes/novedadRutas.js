const express = require('express');
const router = express.Router();
const NovedadControlador = require('../controllers/novedadControlador');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, NovedadControlador.crear);
router.get('/vehiculo/:vehiculo_id', auth, NovedadControlador.obtenerPorVehiculo);

module.exports = router;
