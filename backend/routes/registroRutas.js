const express = require('express');
const router = express.Router();
const RegistroControlador = require('../controllers/registroControlador');
const auth = require('../middleware/authMiddleware');

router.post('/ingreso', auth, RegistroControlador.registrarIngreso);
router.put('/salida/:id', auth, RegistroControlador.registrarSalida);
router.get('/activos', auth, RegistroControlador.obtenerActivos);
router.get('/estadisticas', auth, RegistroControlador.obtenerEstadisticas);
router.get('/rastreo/:placa', RegistroControlador.rastrear); // Rastreo puede ser público

module.exports = router;
