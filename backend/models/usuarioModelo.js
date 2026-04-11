const pool = require('../config/db');

class UsuarioModelo {
  static async buscarPorCorreo(correo) {
    const [filas] = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
    return filas[0];
  }

  static async crear(usuario) {
    const { 
      tipo_documento, num_documento, nombres, apellidos, 
      correo, celular, password, rol, estado 
    } = usuario;

    const valEstado = estado === 'Inactivo' ? 0 : 1;

    const [resultado] = await pool.query(
      `INSERT INTO users (
        tipo_documento, num_documento, nombres, apellidos, 
        correo, celular, password, rol, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo_documento, num_documento, nombres, apellidos, 
        correo, celular, password, rol, valEstado
      ]
    );
    return resultado.insertId;
  }

  static async obtenerPerfiles() {
    return [
      { id: 'admin', perfil: 'Administrador' },
      { id: 'operador', perfil: 'Operador' },
      { id: 'empleado', perfil: 'Empleado' }
    ];
  }

  static async obtenerTodos() {
    const [filas] = await pool.query("SELECT id, nombres, apellidos, correo, rol, IF(estado=1, 'Activo', 'Inactivo') as estado, tipo_documento, num_documento, celular FROM users");
    return filas;
  }

  static async obtenerPorId(id) {
    const [filas] = await pool.query("SELECT id, nombres, apellidos, correo, rol, IF(estado=1, 'Activo', 'Inactivo') as estado, tipo_documento, num_documento, celular FROM users WHERE id = ?", [id]);
    return filas[0];
  }

  static async actualizar(id, datos) {
    const { nombres, apellidos, correo, rol, estado, celular } = datos;
    const valEstado = estado === 'Inactivo' ? 0 : 1;
    const [resultado] = await pool.query(
      'UPDATE users SET nombres = ?, apellidos = ?, correo = ?, rol = ?, estado = ?, celular = ? WHERE id = ?',
      [nombres, apellidos, correo, rol, valEstado, celular, id]
    );
    return resultado.affectedRows;
  }

  static async actualizarPassword(id, nuevaPassword) {
    const [resultado] = await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [nuevaPassword, id]
    );
    return resultado.affectedRows;
  }

  static async obtenerPasswordPorId(id) {
    const [filas] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
    return filas[0]?.password;
  }
}

module.exports = UsuarioModelo;
