const pool = require('../config/db');

class NovedadModelo {
  static async crear(datos) {
    const { descripcion, vehiculo_id, usuario_id } = datos;
    const [resultado] = await pool.query(
      'INSERT INTO novedades (descripcion, vehiculo_id, usuario_id) VALUES (?, ?, ?)',
      [descripcion, vehiculo_id, usuario_id]
    );
    return resultado.insertId;
  }

  static async obtenerPorVehiculo(vehiculo_id) {
    const [filas] = await pool.query(
      'SELECT * FROM novedades WHERE vehiculo_id = ? ORDER BY created_at DESC', 
      [vehiculo_id]
    );
    return filas;
  }
}

module.exports = NovedadModelo;
