const NovedadModelo = require('../models/novedadModelo');
const RegistroModelo = require('../models/registroModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class NovedadControlador {
  static crear = asyncHandler(async (req, res, next) => {
    const { descripcion, REGISTRO_id } = req.body;
    
    if (!descripcion || !REGISTRO_id) {
      return next(new ErrorApp('Descripción e ID de registro son requeridos', 400));
    }

    // Buscar vehiculo_id desde el registro
    const registro = await RegistroModelo.obtenerPorId(REGISTRO_id);
    if (!registro) {
      return next(new ErrorApp('Registro de ingreso no encontrado', 404));
    }

    const id = await NovedadModelo.crear({
      descripcion,
      vehiculo_id: registro.vehiculo_id,
      usuario_id: req.usuario?.id // Del auth controller via JWT
    });

    res.status(201).json({ mensaje: 'Novedad registrada exitosamente', id });
  });

  static obtenerPorVehiculo = asyncHandler(async (req, res, next) => {
    const { vehiculo_id } = req.params;
    const novedades = await NovedadModelo.obtenerPorVehiculo(vehiculo_id);
    res.json(novedades);
  });
}

module.exports = NovedadControlador;
