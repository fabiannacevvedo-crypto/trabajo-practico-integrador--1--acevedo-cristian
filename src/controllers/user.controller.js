import { hashPassword } from "../helpers/bcrypt.helper.js";
import { UserModel, ProfileModel, ArticleModel, sequelize } from "../models/index.js";

/**
 * Listar todos los usuarios con sus perfiles.
 * Ruta: GET /api/users (Solo Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: ProfileModel,
          as: "profile",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Usuarios listados exitosamente",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al listar los usuarios",
      error: error.message,
    });
  }
};

/**
 * Obtener un usuario específico por su ID con perfil y artículos.
 * Ruta: GET /api/users/:id (Solo Admin)
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: ProfileModel,
          as: "profile",
        },
        {
          model: ArticleModel,
          as: "articles",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario obtenido exitosamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

/**
 * Crear un usuario con su perfil.
 * Ruta: POST /api/users (Solo Admin)
 */
export const createUser = async (req, res) => {
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

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create(
      {
        username,
        email,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
      },
      { transaction: t }
    );

    const newProfile = await ProfileModel.create(
      {
        user_id: newUser.id,
        first_name,
        last_name,
        biography: biography || null,
        avatar_url: avatar_url || null,
        birth_date: birth_date || null,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "Usuario y perfil creados exitosamente por el administrador",
      data: {
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
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

/**
 * Actualizar datos de un usuario existente.
 * Ruta: PUT /api/users/:id (Solo Admin)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

/**
 * Eliminación lógica de usuario (paranoid: true).
 * Ruta: DELETE /api/users/:id (Solo Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado para eliminar",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "Usuario eliminado lógicamente de manera exitosa",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
