const pool = require('../config/db');

class PicoPlacaModelo {
  static async obtenerTodos() {
    const [filas] = await pool.query('SELECT * FROM pico_placa');
    return filas.map(f => {
      try {
        const data = JSON.parse(f.restrictions);
        return { id: f.id, ...data };
      } catch (e) {
        return { id: f.id, tipo_vehiculo: 'Error', dia_semana: 0, digitos: '' };
      }
    });
  }

  static async crear(regla) {
    const { tipo_vehiculo, dia_semana, digitos } = regla;
    // Guardamos como JSON en la columna 'restrictions'
    const restrictions = JSON.stringify({ tipo_vehiculo, dia_semana, digitos });
    
    const [resultado] = await pool.query(
      'INSERT INTO pico_placa (restrictions) VALUES (?)',
      [restrictions]
    );
    return resultado.insertId;
  }

  static async eliminar(id) {
    const [resultado] = await pool.query('DELETE FROM pico_placa WHERE id = ?', [id]);
    return resultado.affectedRows;
  }

  static async verificarRestriccion(placa, tipo_vehiculo, dia_semana) {
    const match = placa.match(/\d/);
    if (!match) return false;
    const primerNumero = match[0];

    // Obtener todas las restricciones
    const [filas] = await pool.query('SELECT * FROM pico_placa');
    
    for (const f of filas) {
      try {
        const regla = JSON.parse(f.restrictions);
        if (regla.tipo_vehiculo === tipo_vehiculo && String(regla.dia_semana) === String(dia_semana)) {
          const digitosRestringidos = String(regla.digitos).split(',');
          if (digitosRestringidos.includes(primerNumero)) {
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }
    return false;
  }
}

module.exports = PicoPlacaModelo;
