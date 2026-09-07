import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel, ProfileModel, sequelize } from "../models/index.js";

/**
 * Registro de un nuevo usuario con creación automática de perfil.
 * Ruta: POST /api/auth/register (Público)
 */
export const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      username,
      email,
      password,
      role = "user",
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date,
    } = req.body;

    // Hashear contraseña con bcrypt
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const newUser = await UserModel.create(
      {
        username,
        email,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
      },
      { transaction: t }
    );

    // Creación automática del perfil asociado (1:1)
    const newProfile = await ProfileModel.create(
      {
        user_id: newUser.id,
        first_name: first_name || username,
        last_name: last_name || "Usuario",
        biography: biography || null,
        avatar_url: avatar_url || null,
        birth_date: birth_date || null,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "Usuario registrado y perfil creado exitosamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newProfile,
      },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Error al registrar el usuario",
      error: error.message,
    });
  }
};

/**
 * Inicio de sesión de usuario con envío de JWT mediante cookie segura httpOnly.
 * Ruta: POST /api/auth/login (Público)
 */
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const condition = username ? { username } : { email };
    const user = await UserModel.findOne({
      where: condition,
      include: [
        {
          model: ProfileModel,
          as: "profile",
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas. Usuario no encontrado",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales inválidas. Contraseña incorrecta",
      });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado.
 * Ruta: GET /api/auth/profile (Usuario autenticado)
 */
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: ProfileModel,
          as: "profile",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Perfil de usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Perfil obtenido exitosamente",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el perfil",
      error: error.message,
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado.
 * Ruta: PUT /api/auth/profile (Usuario autenticado)
 */
export const updateProfile = async (req, res) => {
  try {
    let profile = await ProfileModel.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      profile = await ProfileModel.create({
        user_id: req.user.id,
        first_name: req.body.first_name || req.user.username,
        last_name: req.body.last_name || "Usuario",
        biography: req.body.biography || null,
        avatar_url: req.body.avatar_url || null,
        birth_date: req.body.birth_date || null,
      });
    } else {
      const { first_name, last_name, biography, avatar_url, birth_date } = req.body;

      if (first_name !== undefined) profile.first_name = first_name;
      if (last_name !== undefined) profile.last_name = last_name;
      if (biography !== undefined) profile.biography = biography;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
      if (birth_date !== undefined) profile.birth_date = birth_date;

      await profile.save();
    }

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el perfil",
      error: error.message,
    });
  }
};

/**
 * Cierre de sesión limpiando cookie de autenticación.
 * Ruta: POST /api/auth/logout (Usuario autenticado)
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al cerrar sesión",
      error: error.message,
    });
  }
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
};
