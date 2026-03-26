const pool = require('./config/db');

async function fixSchema() {
  try {
    console.log('Adding estado to registros_ingreso...');
    await pool.query("ALTER TABLE registros_ingreso ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Dentro' AFTER usuario_ingreso");
    console.log('Done!');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    pool.end();
  }
}

fixSchema();
