const ClienteModelo = require('../models/clienteModelo');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class ClienteControlador {
  static obtenerTodos = asyncHandler(async (req, res, next) => {
    const clientes = await ClienteModelo.obtenerTodos();
    res.json(clientes);
  });

  static obtenerPorId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const cliente = await ClienteModelo.obtenerPorId(id);
    if (!cliente) {
      return next(new ErrorApp('Cliente no encontrado', 404));
    }
    res.json(cliente);
  });

  static crear = asyncHandler(async (req, res, next) => {
    const { nombre_completo, num_documento } = req.body;
    if (!nombre_completo || !num_documento) {
      return next(new ErrorApp('Nombre completo y número de documento son obligatorios', 400));
    }
    const id = await ClienteModelo.crear(req.body);
    res.status(201).json({ mensaje: 'Cliente creado correctamente', id });
  });

  static actualizar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await ClienteModelo.actualizar(id, req.body);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Cliente no encontrado', 404));
    }
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  });

  static eliminar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await ClienteModelo.eliminar(id);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Cliente no encontrado', 404));
    }
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  });
}

module.exports = ClienteControlador;
