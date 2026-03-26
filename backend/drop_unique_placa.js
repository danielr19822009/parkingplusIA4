const pool = require('./config/db');

async function dropUnique() {
  try {
    console.log('Dropping unique placa from registros_ingreso...');
    await pool.query('ALTER TABLE registros_ingreso DROP INDEX placa');
    console.log('Done!');
  } catch (e) {
    if (e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
       console.log('Index already dropped.');
    } else {
       console.error(e);
    }
  } finally {
    pool.end();
  }
}

dropUnique();
