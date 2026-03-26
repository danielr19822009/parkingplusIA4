const PicoPlacaModelo = require('../models/picoPlacaModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class PicoPlacaControlador {
  static obtenerTodos = asyncHandler(async (req, res, next) => {
    const reglas = await PicoPlacaModelo.obtenerTodos();
    res.json(reglas);
  });

  static crear = asyncHandler(async (req, res, next) => {
    if (!req.body.dia_semana || !req.body.digitos) {
      return next(new ErrorApp('Faltan datos requeridos (dia_semana, digitos)', 400));
    }
    const id = await PicoPlacaModelo.crear(req.body);
    res.status(201).json({ mensaje: 'Regla creada', id });
  });

  static eliminar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const rules = await PicoPlacaModelo.obtenerTodos();
    const ruleExists = rules.some(r => r.id == id);
    if (!ruleExists) {
      return next(new ErrorApp('Regla no encontrada', 404));
    }
    await PicoPlacaModelo.eliminar(id);
    res.json({ mensaje: 'Regla eliminada' });
  });
}

module.exports = PicoPlacaControlador;
