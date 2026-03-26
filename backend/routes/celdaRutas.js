const express = require('express');
const router = express.Router();
const CeldaControlador = require('../controllers/celdaControlador');
const auth = require('../middleware/authMiddleware');
const checkRol = require('../middleware/checkRol');

// Solo administradores y coadministradores gestionan celdas
router.get('/', auth, CeldaControlador.obtenerTodas);
router.get('/:id', auth, CeldaControlador.obtenerPorId);
router.post('/', auth, checkRol('Administrador', 'admin', 'Coadministrador', 'coadministrador'), CeldaControlador.crear);
router.put('/:id', auth, checkRol('Administrador', 'admin', 'Coadministrador', 'coadministrador'), CeldaControlador.actualizar);
router.delete('/:id', auth, checkRol('Administrador', 'admin', 'Coadministrador', 'coadministrador'), CeldaControlador.eliminar);

module.exports = router;
