require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor cargado con éxito`);
  console.log(`Puerto configurado: ${PORT}`);
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
