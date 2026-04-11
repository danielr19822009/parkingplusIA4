const RegistroModelo = require('../models/registroModelo');
const VehiculoModelo = require('../models/vehiculoModelo');
const PicoPlacaModelo = require('../models/picoPlacaModelo');
const CeldaModelo = require('../models/celdaModelo');
const ErrorApp = require('../utils/ErrorApp');
const asyncHandler = require('../utils/asyncHandler');

class RegistroControlador {
  static registrarIngreso = asyncHandler(async (req, res, next) => {
    const { placa, color, modelo, marca, tipo, CELDA_id } = req.body;

    if (!placa || !CELDA_id) {
      return next(new ErrorApp('La placa y el número de celda son obligatorios', 400));
    }

    // 0. Verificar si la celda está disponible
    const celda = await CeldaModelo.obtenerPorId(CELDA_id);
    if (!celda) {
      return next(new ErrorApp('La celda especificada no existe', 404));
    }
    if (celda.estado.toLowerCase() !== 'disponible') {
      return next(new ErrorApp(`La celda ${celda.numero} ya está ocupada`, 400));
    }

    // 1. Verificar Pico y Placa
    const hoy = new Date();
    let diaSemana = hoy.getDay(); // 0 (Dom) a 6 (Sab)
    if (diaSemana === 0) diaSemana = 7; // Convertir a 1-7 (Lun-Dom)
    
    const restriccion = await PicoPlacaModelo.verificarRestriccion(placa, tipo, diaSemana);
    if (restriccion) {
      return next(new ErrorApp('El vehículo tiene restricción de Pico y Placa hoy', 403));
    }

    // 2. Buscar o crear vehículo
    let vehiculo = await VehiculoModelo.buscarPorPlaca(placa);
    let vehiculoId;
    if (!vehiculo) {
      vehiculoId = await VehiculoModelo.crear({ placa, color, modelo, marca, tipo });
    } else {
      vehiculoId = vehiculo.id;
    }

    // 3. Verificar si ya está dentro
    const activo = await RegistroModelo.buscarPorPlacaActiva(placa);
    if (activo) {
      return next(new ErrorApp('El vehículo ya se encuentra en el parqueadero', 400));
    }

    // 4. Registrar ingreso
    const registroId = await RegistroModelo.registrarIngreso(vehiculoId, CELDA_id, req.usuario.id, placa);
    
    res.status(201).json({ 
      status: 'success',
      mensaje: 'Ingreso registrado correctamente', 
      data: { registroId } 
    });
  });

  static registrarSalida = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const resultado = await RegistroModelo.registrarSalida(id, req.usuario.id);
    
    if (resultado === 0) {
      return next(new ErrorApp('Registro no encontrado o el vehículo ya salió', 404));
    }
    
    res.status(200).json({ 
      status: 'success',
      mensaje: 'Salida registrada correctamente' 
    });
  });

  static obtenerActivos = asyncHandler(async (req, res, next) => {
    const activos = await RegistroModelo.obtenerActivos();
    res.status(200).json({
      status: 'success',
      results: activos.length,
      data: { activos }
    });
  });

  static rastrear = asyncHandler(async (req, res, next) => {
    const { placa } = req.params;
    const registro = await RegistroModelo.buscarPorPlacaActiva(placa);
    
    if (!registro) {
      return next(new ErrorApp('Vehículo no encontrado dentro del parqueadero. ¡Hazte PRO para desbloquear este servicio!', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { registro }
    });
  });

  static obtenerEstadisticas = asyncHandler(async (req, res, next) => {
    const stats = await RegistroModelo.obtenerEstadisticas();
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  });
}

module.exports = RegistroControlador;

