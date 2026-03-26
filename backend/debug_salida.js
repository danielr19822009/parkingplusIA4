const pool = require('./config/db');
const RegistroModelo = require('./models/registroModelo');

async function testSalida() {
  try {
    console.log('Testing salida for ID 11...');
    const res = await RegistroModelo.registrarSalida(11, 1); // Prueba con usuario admin 1 o similar
    console.log('Resultado:', res);
  } catch (e) {
    console.error('Error detallado:', e);
  } finally {
    pool.end();
  }
}

testSalida();
