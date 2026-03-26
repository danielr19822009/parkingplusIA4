const pool = require('./config/db');

async function fixUnique() {
  try {
    const [create] = await pool.query('SHOW CREATE TABLE registros_ingreso');
    console.log(create[0]['Create Table']);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

fixUnique();
