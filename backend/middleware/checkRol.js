const ErrorApp = require('../utils/ErrorApp');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new ErrorApp('Usuario no autenticado', 401));
    }
    
    const userRole = (req.usuario.perfil || '').toLowerCase();
    const requiredRoles = roles.map(r => r.toLowerCase());

    console.log(`Verificando rol. Usuario: ${req.usuario.correo}, Rol: ${userRole}, Roles requeridos: ${requiredRoles}`);
    
    if (!requiredRoles.includes(userRole)) {
      return next(new ErrorApp('No tienes permiso para realizar esta acción', 403));
    }
    
    next();
  };
};
