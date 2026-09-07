import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_blog_2026";
const JWT_EXPIRES_IN = "24h";

/**
 * Genera un token JWT firmado.
 * @param {Object} payload Datos a incluir en el token.
 * @returns {string} Token generado.
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token Token a verificar.
 * @returns {Object} Payload decodificado.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export default { generateToken, verifyToken };
