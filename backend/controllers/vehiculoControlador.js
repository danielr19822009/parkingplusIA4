const VehiculoModelo = require('../models/vehiculoModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class VehiculoControlador {
  static buscarPlaca = asyncHandler(async (req, res, next) => {
    const { placa } = req.params;
    const vehiculo = await VehiculoModelo.buscarPorPlaca(placa);
    if (!vehiculo) {
      return next(new ErrorApp(`Vehículo con placa ${placa} no encontrado`, 404));
    }
    res.json(vehiculo);
  });

  static crear = asyncHandler(async (req, res, next) => {
    const id = await VehiculoModelo.crear(req.body);
    res.status(201).json({ mensaje: 'Vehículo registrado', id });
  });

  static obtenerTodos = asyncHandler(async (req, res, next) => {
    const vehiculos = await VehiculoModelo.obtenerTodos();
    res.json(vehiculos);
  });
}

module.exports = VehiculoControlador;
