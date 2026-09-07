/**
 * Middleware para autorizar únicamente a usuarios con rol 'admin'.
 */
export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado. Se requieren permisos de administrador",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error en la verificación de permisos de administrador",
      error: error.message,
    });
  }
};

export default adminMiddleware;
