const express = require('express');
const router = express.Router();
const AutenticacionControlador = require('../controllers/autenticacionControlador');

const auth = require('../middleware/authMiddleware');
const checkRol = require('../middleware/checkRol');

router.post('/registro', AutenticacionControlador.registrar);
router.post('/login', AutenticacionControlador.login);
router.get('/perfiles', AutenticacionControlador.obtenerPerfiles);
router.get('/usuarios', auth, checkRol('Administrador', 'admin'), AutenticacionControlador.listado);
router.get('/usuarios/:id', auth, checkRol('Administrador', 'admin'), AutenticacionControlador.obtenerUsuario);
router.put('/usuarios/:id', auth, checkRol('Administrador', 'admin'), AutenticacionControlador.actualizarUsuario);
router.delete('/usuarios/:id', auth, checkRol('Administrador', 'admin'), AutenticacionControlador.eliminarUsuario);

module.exports = router;
