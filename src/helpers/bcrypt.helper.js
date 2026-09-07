import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña usando bcrypt.
 * @param {string} password Contraseña en texto plano.
 * @returns {Promise<string>} Contraseña hasheada.
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano con un hash.
 * @param {string} password Contraseña en texto plano.
 * @param {string} hashedPassword Contraseña hasheada.
 * @returns {Promise<boolean>} True si coinciden, false en caso contrario.
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export default { hashPassword, comparePassword };
