const UsuarioModelo = require('../models/usuarioModelo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorApp = require('../utils/ErrorApp');

class AutenticacionControlador {
  static registrar = asyncHandler(async (req, res, next) => {
    console.log('Datos recibidos para registro:', req.body);
    const { password, ...datosUsuario } = req.body;
    
    if (!password || !datosUsuario.correo) {
      return next(new ErrorApp('Correo y contraseña son obligatorios', 400));
    }

    const hashClave = await bcrypt.hash(password, 10);
    const id = await UsuarioModelo.crear({ ...datosUsuario, password: hashClave });
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id });
  });

  static login = asyncHandler(async (req, res, next) => {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
      return next(new ErrorApp('Por favor proporcione correo y contraseña', 400));
    }

    const usuario = await UsuarioModelo.buscarPorCorreo(correo);
    
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return next(new ErrorApp('Credenciales inválidas', 401));
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.rol, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      mensaje: 'Login exitoso', 
      token, 
      usuario: { 
        nombre: usuario.nombres, 
        apellido: usuario.apellidos,
        perfil: usuario.rol 
      } 
    });
  });

  static obtenerPerfiles = asyncHandler(async (req, res, next) => {
    const perfiles = await UsuarioModelo.obtenerPerfiles();
    res.json(perfiles);
  });

  static listado = asyncHandler(async (req, res, next) => {
    const usuarios = await UsuarioModelo.obtenerTodos();
    res.json(usuarios);
  });

  static obtenerUsuario = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const usuario = await UsuarioModelo.obtenerPorId(id);
    if (!usuario) {
      return next(new ErrorApp('Usuario no encontrado', 404));
    }
    res.json(usuario);
  });

  static actualizarUsuario = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await UsuarioModelo.actualizar(id, req.body);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Usuario no encontrado o sin cambios', 404));
    }
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });

  static eliminarUsuario = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const filasAfectadas = await UsuarioModelo.eliminar(id);
    if (filasAfectadas === 0) {
      return next(new ErrorApp('Usuario no encontrado', 404));
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });

  static cambiarPassword = asyncHandler(async (req, res, next) => {
    const { passwordActual, passwordNueva, verificarPassword } = req.body;
    const usuarioId = req.usuario.id;

    if (!passwordActual || !passwordNueva || !verificarPassword) {
      return next(new ErrorApp('Todos los campos son obligatorios', 400));
    }

    if (passwordNueva !== verificarPassword) {
      return next(new ErrorApp('La nueva contraseña y su verificación no coinciden', 400));
    }

    const passwordHashActual = await UsuarioModelo.obtenerPasswordPorId(usuarioId);
    
    if (!passwordHashActual || !(await bcrypt.compare(passwordActual, passwordHashActual))) {
      return next(new ErrorApp('La contraseña actual es incorrecta', 401));
    }

    const nuevoHash = await bcrypt.hash(passwordNueva, 10);
    await UsuarioModelo.actualizarPassword(usuarioId, nuevoHash);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  });
}

module.exports = AutenticacionControlador;
