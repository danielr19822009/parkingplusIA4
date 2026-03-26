const ErrorApp = require('../utils/ErrorApp');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    mensaje: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      mensaje: err.message
    });
  } else {
    // Error desconocido
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      mensaje: 'Algo salió mal en el servidor'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
