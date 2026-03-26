const CeldaModelo = require('../models/celdaModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class CeldaControlador {
  static obtenerTodas = asyncHandler(async (req, res, next) => {
    const celdas = await CeldaModelo.obtenerTodas();
    res.json(celdas);
  });

  static obtenerPorId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const celda = await CeldaModelo.obtenerPorId(id);
    if (!celda) {
      return next(new ErrorApp('Celda no encontrada', 404));
    }
    res.json(celda);
  });

  static crear = asyncHandler(async (req, res, next) => {
    const { numero, tipo } = req.body;
    if (!numero || !tipo) {
      return next(new ErrorApp('Número y tipo son obligatorios', 400));
    }
    const id = await CeldaModelo.crear(req.body);
    res.status(201).json({ mensaje: 'Celda creada correctamente', id });
  });

  static actualizar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await CeldaModelo.actualizar(id, req.body);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Celda no encontrada', 404));
    }
    res.json({ mensaje: 'Celda actualizada correctamente' });
  });

  static eliminar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await CeldaModelo.eliminar(id);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Celda no encontrada', 404));
    }
    res.json({ mensaje: 'Celda eliminada correctamente' });
  });
}

module.exports = CeldaControlador;
