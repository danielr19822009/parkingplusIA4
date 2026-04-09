const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Eliminando índice UNIQUE de placa en registros_ingreso...');
    // Primero verificamos si el índice existe
    await connection.query('ALTER TABLE registros_ingreso DROP INDEX placa');
    console.log('Índice eliminado correctamente.');
  } catch (error) {
    console.error('Error al eliminar el índice:', error.message);
  } finally {
    await connection.end();
  }
}

fix();
