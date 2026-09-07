import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel, ProfileModel } from "../models/index.js";

/**
 * Middleware para autenticar usuarios mediante token JWT almacenado en cookies seguras.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "No autenticado. Token de acceso no proporcionado en las cookies",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        message: "Token inválido o expirado. Inicie sesión nuevamente",
      });
    }

    const user = await UserModel.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: ProfileModel,
          as: "profile",
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado o dado de baja",
      });
    }

    req.user = user;
    req.datosDelUsuarioLogeado = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error interno en la autenticación",
      error: error.message,
    });
  }
};

export default authMiddleware;
