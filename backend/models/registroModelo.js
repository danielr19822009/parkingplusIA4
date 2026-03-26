const pool = require('../config/db');

class RegistroModelo {
  static async registrarIngreso(vehiculo_id, celda_id, usuario_id, placa) {
    // 1. Verificar si la celda existe
    const [celda] = await pool.query('SELECT id FROM celdas WHERE id = ?', [parseInt(celda_id)]);
    if (!celda[0]) {
      throw new Error(`La celda con ID ${celda_id} no existe en la base de datos.`);
    }

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];
    
    const [resultado] = await pool.query(
      'INSERT INTO registros_ingreso (vehiculo_id, celda_id, placa, fecha_ingreso, hora_ingreso, usuario_ingreso) VALUES (?, ?, ?, ?, ?, ?)',
      [vehiculo_id, parseInt(celda_id), placa, fecha, hora, usuario_id]
    );
    // Cambiar estado de la celda a Ocupada
    await pool.query('UPDATE celdas SET estado = ? WHERE id = ?', ['Ocupada', parseInt(celda_id)]);
    return resultado.insertId;
  }

  static async registrarSalida(id) {
    const [resultado] = await pool.query(
      'UPDATE registros_ingreso SET fecha_salida = CURRENT_TIMESTAMP, estado = ? WHERE id = ?',
      ['Fuera', id]
    );
    
    // Obtener la celda para liberarla
    const [registro] = await pool.query('SELECT CELDA_id FROM registros_ingreso WHERE id = ?', [id]);
    if (registro[0]) {
      await pool.query('UPDATE celdas SET estado = ? WHERE id = ?', ['Disponible', registro[0].CELDA_id]);
    }
    
    return resultado.affectedRows;
  }

  static async obtenerActivos() {
    // Si no hay columna estado, asumimos que los que están aquí están activos 
    // (o podríamos hacer un LEFT JOIN con registros_salida WHERE rs.id IS NULL)
    const [filas] = await pool.query(`
      SELECT r.*, v.placa, v.marca, v.modelo, v.color, c.numero as celda_numero
      FROM registros_ingreso r
      JOIN vehicles v ON r.vehiculo_id = v.id
      JOIN celdas c ON r.celda_id = c.id
    `);
    return filas;
  }

  static async buscarPorPlacaActiva(placa) {
    const [filas] = await pool.query(`
      SELECT r.*, v.placa, v.marca, v.modelo, v.color, c.numero as celda_numero
      FROM registros_ingreso r
      JOIN vehicles v ON r.vehiculo_id = v.id
      JOIN celdas c ON r.celda_id = c.id
      WHERE v.placa = ?
    `, [placa]);
    return filas[0];
  }

  static async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT * FROM registros_ingreso WHERE id = ?', [id]);
    return filas[0];
  }

  static async obtenerEstadisticas() {
    const [[{ dentro }]] = await pool.query("SELECT COUNT(*) as dentro FROM registros_ingreso");
    const [[{ fuera }]] = await pool.query("SELECT COUNT(*) as fuera FROM registros_salida");
    return { dentro, fuera };
  }
}

module.exports = RegistroModelo;
