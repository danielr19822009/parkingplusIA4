const ReporteModelo = require('../models/reporteModelo');
const RegistroModelo = require('../models/registroModelo');
const UsuarioModelo = require('../models/usuarioModelo');
const VehiculoModelo = require('../models/vehiculoModelo');
const CeldaModelo = require('../models/celdaModelo');

class ReporteControlador {
  // --- MÉTODOS DE INCIDENTES (YA EXISTENTES) ---
  static async listar(req, res) {
    try {
      const reportes = await ReporteModelo.obtenerTodos();
      res.json(reportes);
    } catch (error) {
      console.error('Error al listar reportes:', error);
      res.status(500).json({ mensaje: 'Error al listar reportes', error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { tipo, descripcion, celda_id, prioridad, estado, notas } = req.body;
      if (!tipo || !descripcion) {
        return res.status(400).json({ mensaje: 'Tipo y descripción son obligatorios' });
      }
      const usuario_reporte = req.usuario?.id || 1; 
      const reporteId = await ReporteModelo.crear({
        tipo, descripcion, celda_id, prioridad, estado, usuario_reporte, notas
      });
      res.status(201).json({ mensaje: 'Reporte creado correctamente', id: reporteId });
    } catch (error) {
      console.error('Error al crear reporte:', error);
      res.status(500).json({ mensaje: 'Error al crear reporte', error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ReporteModelo.actualizar(id, req.body);
      if (resultado === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
      res.json({ mensaje: 'Reporte actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      res.status(500).json({ mensaje: 'Error al actualizar reporte', error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ReporteModelo.eliminar(id);
      if (resultado === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
      res.json({ mensaje: 'Reporte eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      res.status(500).json({ mensaje: 'Error al eliminar reporte', error: error.message });
    }
  }

  // --- NUEVOS MÉTODOS DE REPORTE GENERAL ---

  static async resumenVehiculos(req, res) {
    try {
      const dentro = await RegistroModelo.obtenerActivos();
      const fuera = await RegistroModelo.obtenerFuera();
      res.json({ dentro, fuera });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener resumen de vehículos', error: error.message });
    }
  }

  static async historialCompleto(req, res) {
    try {
      const historial = await RegistroModelo.obtenerHistorial();
      res.json(historial);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
  }

  static async usuariosRoles(req, res) {
    try {
      const usuarios = await UsuarioModelo.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
  }

  static async todosVehiculos(req, res) {
    try {
      const vehiculos = await VehiculoModelo.obtenerTodos();
      res.json(vehiculos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener vehículos', error: error.message });
    }
  }

  static async todasCeldas(req, res) {
    try {
      const celdas = await CeldaModelo.obtenerTodas();
      res.json(celdas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener celdas', error: error.message });
    }
  }
}

module.exports = ReporteControlador;
