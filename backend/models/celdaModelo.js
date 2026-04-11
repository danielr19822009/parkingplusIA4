const pool = require('../config/db');

class CeldaModelo {
  static async obtenerTodas() {
    const [filas] = await pool.query('SELECT * FROM celdas ORDER BY numero');
    return filas;
  }

  static async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT * FROM celdas WHERE id = ?', [id]);
    return filas[0];
  }

  static async crear(datos) {
    const { numero, tipo, estado, piso } = datos;
    const [resultado] = await pool.query(
      'INSERT INTO celdas (numero, tipo, estado, piso) VALUES (?, ?, ?, ?)',
      [numero, (tipo || 'carro').toLowerCase(), (estado || 'disponible').toLowerCase(), piso || 1]
    );
    return resultado.insertId;
  }

  static async actualizar(id, datos) {
    const { numero, tipo, estado, piso } = datos;
    const [resultado] = await pool.query(
      'UPDATE celdas SET numero = ?, tipo = ?, estado = ?, piso = ? WHERE id = ?',
      [numero, (tipo || 'carro').toLowerCase(), (estado || 'disponible').toLowerCase(), piso || 1, id]
    );
    return resultado.affectedRows;
  }

  static async eliminar(id) {
    const [resultado] = await pool.query('DELETE FROM celdas WHERE id = ?', [id]);
    return resultado.affectedRows;
  }

  static async obtenerDisponibles() {
    const [filas] = await pool.query("SELECT * FROM celdas WHERE LOWER(estado) = 'disponible' ORDER BY numero");
    return filas;
  }
}

module.exports = CeldaModelo;
