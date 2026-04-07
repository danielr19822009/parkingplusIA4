const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api/auth', require('./routes/autenticacionRutas'));
app.use('/api/vehiculos', require('./routes/vehiculoRutas'));
app.use('/api/registros', require('./routes/registroRutas'));
app.use('/api/novedades', require('./routes/novedadRutas'));
app.use('/api/picoplaca', require('./routes/picoPlacaRutas'));
app.use('/api/celdas', require('./routes/celdaRutas'));
app.use('/api/clientes', require('./routes/clienteRutas'));
app.use('/api/reportes', require('./routes/reporteRutas'));

// Ruta principal para el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de errores centralizado
app.use(require('./middleware/errorMiddleware'));

module.exports = app;
