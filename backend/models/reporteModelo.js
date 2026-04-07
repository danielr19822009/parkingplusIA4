const pool = require('../config/db');

class ReporteModelo {
  static async obtenerTodos() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, c.numero as celda_numero, u.primer_nombre as usuario_nombre
        FROM reportes r
        LEFT JOIN celdas c ON r.celda_id = c.id
        LEFT JOIN users u ON r.usuario_reporte = u.id_usuario
        ORDER BY r.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async crear(datos) {
    try {
      const { tipo, descripcion, celda_id, prioridad, estado, usuario_reporte, notas } = datos;
      const [result] = await pool.query(
        'INSERT INTO reportes (tipo, descripcion, celda_id, prioridad, estado, usuario_reporte, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tipo, descripcion, celda_id, prioridad, estado || 'abierto', usuario_reporte, notas]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, datos) {
    try {
      const { tipo, descripcion, celda_id, prioridad, estado, notas } = datos;
      const [result] = await pool.query(
        'UPDATE reportes SET tipo=?, descripcion=?, celda_id=?, prioridad=?, estado=?, notas=? WHERE id=?',
        [tipo, descripcion, celda_id, prioridad, estado, notas, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const [result] = await pool.query('DELETE FROM reportes WHERE id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM reportes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReporteModelo;
