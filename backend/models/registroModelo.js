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

  static async registrarSalida(id, usuarioSalidaId) {
    // 1. Obtener datos del ingreso
    const [ingreso] = await pool.query('SELECT * FROM registros_ingreso WHERE id = ?', [id]);
    if (!ingreso[0]) return 0;

    const data = ingreso[0];
    const now = new Date();
    const fechaSalida = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
    const horaSalida = now.toTimeString().split(' ')[0];

    // Calcular tiempo (opcional para visualización)
    const fechaIn = new Date(data.fecha_ingreso);
    const diff = Math.abs(now - fechaIn);
    const mins = Math.floor(diff / (1000 * 60));
    const tiempoTotal = `${Math.floor(mins / 60)}h ${mins % 60}m`;

    // 2. Insertar en registros_salida
    await pool.query(
      `INSERT INTO registros_salida (
        vehiculo_id, celda_id, registro_ingreso_id, fecha_salida, hora_salida, 
        hora_ingreso, tiempo_total, usuario_salida, total_pagar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.vehiculo_id, data.celda_id, data.id, fechaSalida, horaSalida,
        data.hora_ingreso, tiempoTotal, usuarioSalidaId || data.usuario_ingreso, 0
      ]
    );

    // 3. Actualizar estado en registros_ingreso (en lugar de borrar para no romper la FK)
    const [resultado] = await pool.query("UPDATE registros_ingreso SET estado = 'Fuera' WHERE id = ?", [id]);
    
    // 4. Liberar celda
    if (data.celda_id) {
      await pool.query("UPDATE celdas SET estado = 'Disponible' WHERE id = ?", [data.celda_id]);
    }
    
    return resultado.affectedRows;
  }

  static async obtenerActivos() {
    const [filas] = await pool.query(`
      SELECT r.*, v.placa, v.marca, v.modelo, v.color, c.numero as celda_numero,
      GROUP_CONCAT(n.descripcion ORDER BY n.created_at DESC SEPARATOR '|||') as todas_novedades
      FROM registros_ingreso r
      JOIN vehicles v ON r.vehiculo_id = v.id
      JOIN celdas c ON r.celda_id = c.id
      LEFT JOIN novedades n ON v.id = n.vehiculo_id
      WHERE r.estado = 'Dentro'
      GROUP BY r.id
    `);
    return filas;
  }

  static async buscarPorPlacaActiva(placa) {
    const [filas] = await pool.query(`
      SELECT r.*, v.placa, v.marca, v.modelo, v.color, c.numero as celda_numero
      FROM registros_ingreso r
      JOIN vehicles v ON r.vehiculo_id = v.id
      JOIN celdas c ON r.celda_id = c.id
      WHERE v.placa = ? AND r.estado = 'Dentro'
    `, [placa]);
    return filas[0];
  }

  static async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT * FROM registros_ingreso WHERE id = ?', [id]);
    return filas[0];
  }

  static async obtenerEstadisticas() {
    const [[{ dentro }]] = await pool.query("SELECT COUNT(*) as dentro FROM registros_ingreso WHERE estado = 'Dentro'");
    const [[{ fuera }]] = await pool.query("SELECT COUNT(*) as fuera FROM registros_salida");
    return { dentro, fuera };
  }
}

module.exports = RegistroModelo;
