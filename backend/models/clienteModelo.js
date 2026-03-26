const pool = require('../config/db');

class ClienteModelo {
  static async obtenerTodos() {
    const [filas] = await pool.query("SELECT id, tipo_documento, num_documento, nombre_completo, telefono, correo, IF(estado=1, 'Activo', 'Inactivo') as estado FROM clientes");
    return filas;
  }

  static async obtenerPorId(id) {
    const [filas] = await pool.query("SELECT id, tipo_documento, num_documento, nombre_completo, telefono, correo, IF(estado=1, 'Activo', 'Inactivo') as estado FROM clientes WHERE id = ?", [id]);
    return filas[0];
  }

  static async crear(datos) {
    const { tipo_documento, num_documento, nombre_completo, telefono, correo, estado } = datos;
    const valEstado = estado === 'Inactivo' ? 0 : 1;
    const [resultado] = await pool.query(
      'INSERT INTO clientes (tipo_documento, num_documento, nombre_completo, telefono, correo, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_documento, num_documento, nombre_completo, telefono, correo, valEstado]
    );
    return resultado.insertId;
  }

  static async actualizar(id, datos) {
    const { tipo_documento, num_documento, nombre_completo, telefono, correo, estado } = datos;
    const valEstado = estado === 'Inactivo' ? 0 : 1;
    const [resultado] = await pool.query(
      'UPDATE clientes SET tipo_documento = ?, num_documento = ?, nombre_completo = ?, telefono = ?, correo = ?, estado = ? WHERE id = ?',
      [tipo_documento, num_documento, nombre_completo, telefono, correo, valEstado, id]
    );
    return resultado.affectedRows;
  }

  static async eliminar(id) {
    const [resultado] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    return resultado.affectedRows;
  }
}

module.exports = ClienteModelo;
