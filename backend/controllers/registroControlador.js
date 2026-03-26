const RegistroModelo = require('../models/registroModelo');
const VehiculoModelo = require('../models/vehiculoModelo');
const PicoPlacaModelo = require('../models/picoPlacaModelo');

class RegistroControlador {
  static async registrarIngreso(req, res) {
    try {
      const { placa, color, modelo, marca, tipo, CELDA_id } = req.body;

      // 1. Verificar Pico y Placa
      const hoy = new Date();
      let diaSemana = hoy.getDay(); // 0 (Dom) a 6 (Sab)
      if (diaSemana === 0) diaSemana = 7; // Convertir a 1-7 (Lun-Dom)
      
      const restriccion = await PicoPlacaModelo.verificarRestriccion(placa, tipo, diaSemana);
      if (restriccion) {
        return res.status(403).json({ mensaje: 'El vehículo tiene restricción de Pico y Placa hoy' });
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
        return res.status(400).json({ mensaje: 'El vehículo ya se encuentra en el parqueadero' });
      }

      // 4. Registrar ingreso
      const registroId = await RegistroModelo.registrarIngreso(vehiculoId, CELDA_id, req.usuario.id, placa);
      res.status(201).json({ mensaje: 'Ingreso registrado correctamente', registroId });
    } catch (error) {
      console.error('ERROR EN REGISTRAR INGRESO:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ mensaje: 'El vehículo con esta placa ya tiene un ingreso activo' });
      }
      res.status(500).json({ mensaje: 'Error al registrar ingreso', error: error.message });
    }
  }

  static async registrarSalida(req, res) {
    try {
      const { id } = req.params;
      const resultado = await RegistroModelo.registrarSalida(id);
      if (resultado === 0) {
        return res.status(404).json({ mensaje: 'Registro no encontrado o ya salió' });
      }
      res.json({ mensaje: 'Salida registrada correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al registrar salida', error: error.message });
    }
  }

  static async obtenerActivos(req, res) {
    try {
      const activos = await RegistroModelo.obtenerActivos();
      res.json(activos);
    } catch (error) {
      console.error('ERROR EN OBTENER ACTIVOS:', error);
      res.status(500).json({ mensaje: 'Error al obtener vehículos activos', error: error.message });
    }
  }

  static async rastrear(req, res) {
    try {
      const { placa } = req.params;
      const registro = await RegistroModelo.buscarPorPlacaActiva(placa);
      if (!registro) {
        return res.status(404).json({ mensaje: 'Vehículo no encontrado dentro del parqueadero' });
      }
      res.json(registro);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al rastrear vehículo' });
    }
  }

  static async obtenerEstadisticas(req, res) {
    try {
      const stats = await RegistroModelo.obtenerEstadisticas();
      res.json(stats);
    } catch (error) {
      console.error('ERROR EN OBTENER ESTADISTICAS:', error);
      res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
    }
  }
}

module.exports = RegistroControlador;
