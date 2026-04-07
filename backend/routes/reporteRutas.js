const express = require('express');
const router = express.Router();
const ReporteControlador = require('../controllers/reporteControlador');

// Endpoints para Gestión de Incidentes (Mantenimiento, etc.)
router.get('/', ReporteControlador.listar);
router.post('/', (req, res, next) => {
    if(!req.usuario) req.usuario = { id: 1 }; 
    next();
}, ReporteControlador.crear);
router.put('/:id', ReporteControlador.actualizar);
router.delete('/:id', ReporteControlador.eliminar);

// Endpoints de Reportes de Datos del Sistema
router.get('/vehiculos-resumen', ReporteControlador.resumenVehiculos);
router.get('/historial', ReporteControlador.historialCompleto);
router.get('/usuarios', ReporteControlador.usuariosRoles);
router.get('/vehiculos', ReporteControlador.todosVehiculos);
router.get('/celdas', ReporteControlador.todasCeldas);

module.exports = router;
