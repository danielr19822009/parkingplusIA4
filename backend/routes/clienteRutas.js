const express = require('express');
const router = express.Router();
const ClienteControlador = require('../controllers/clienteControlador');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ClienteControlador.obtenerTodos);
router.get('/:id', auth, ClienteControlador.obtenerPorId);
router.post('/', auth, ClienteControlador.crear);
router.put('/:id', auth, ClienteControlador.actualizar);
router.delete('/:id', auth, ClienteControlador.eliminar);

module.exports = router;
