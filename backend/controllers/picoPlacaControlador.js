const PicoPlacaModelo = require('../models/picoPlacaModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class PicoPlacaControlador {
  static obtenerTodos = asyncHandler(async (req, res, next) => {
    const reglas = await PicoPlacaModelo.obtenerTodos();
    res.json(reglas);
  });

  static crear = asyncHandler(async (req, res, next) => {
    const { tipo_vehiculo, dia_semana, digitos } = req.body;
    if (!dia_semana || !digitos || !tipo_vehiculo) {
      return next(new ErrorApp('Faltan datos requeridos (tipo_vehiculo, dia_semana, digitos)', 400));
    }

    // VALIDACIÓN: No permitir duplicados para el mismo día y tipo de vehículo
    const reglasExistentes = await PicoPlacaModelo.obtenerTodos();
    const conflicto = reglasExistentes.find(r => 
      r.tipo_vehiculo === tipo_vehiculo && 
      String(r.dia_semana) === String(dia_semana)
    );

    if (conflicto) {
      return next(new ErrorApp(`Ya existe una regla para ${tipo_vehiculo} el día ${dia_semana}. Modifíquela o elimínela.`, 400));
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
