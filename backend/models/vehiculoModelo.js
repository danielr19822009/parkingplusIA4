const pool = require('../config/db');

class VehiculoModelo {
  static async buscarPorPlaca(placa) {
    const [filas] = await pool.query('SELECT * FROM vehicles WHERE placa = ?', [placa]);
    return filas[0];
  }

  static async crear(vehiculo) {
    const { placa, color, modelo, marca, tipo } = vehiculo;
    const [resultado] = await pool.query(
      'INSERT INTO vehicles (placa, color, modelo, marca, tipo) VALUES (?, ?, ?, ?, ?)',
      [placa, color, modelo, marca, tipo]
    );
    return resultado.insertId;
  }

  static async obtenerTodos() {
    const [filas] = await pool.query('SELECT * FROM vehicles');
    return filas;
  }
}

module.exports = VehiculoModelo;
