import { body, param, validationResult } from "express-validator";
import { UserModel, TagModel, ArticleModel } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Middleware que evalúa las validaciones de express-validator.
 * Devuelve 400 Bad Request en caso de error.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación en la solicitud",
      errors: errors.array().map((err) => ({
        campo: err.path || err.param,
        mensaje: err.msg,
        valor: err.value,
      })),
    });
  }
  next();
};

/**
 * Validador para IDs numéricos recibidos como parámetro en URL.
 */
export const validateIdParam = (paramName = "id") => [
  param(paramName)
    .isInt({ min: 1 })
    .withMessage(`El parámetro ${paramName} debe ser un número entero positivo`),
  handleValidationErrors,
];


// Validaciones de Autenticación y Registro


export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre de usuario solo puede contener letras y números (alfanumérico)")
    .custom(async (username) => {
      const existingUser = await UserModel.findOne({ where: { username } });
      if (existingUser) {
        throw new Error("El nombre de usuario ya se encuentra registrado");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El formato del correo electrónico no es válido")
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("El correo electrónico ya se encuentra registrado");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener al menos una mayúscula, una minúscula y un número"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol solo puede ser 'user' o 'admin'"),

  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras"),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras"),

  body("biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La biografía no puede superar los 500 caracteres"),

  body("avatar_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("El avatar_url debe tener un formato de URL válido"),

  body("birth_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)"),

  handleValidationErrors,
];

export const validateLogin = [
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío si se proporciona"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("El correo electrónico debe ser válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error("Debe proporcionar un nombre de usuario o un correo electrónico para iniciar sesión");
    }
    return true;
  }),

  handleValidationErrors,
];

export const validateUpdateProfile = [
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras"),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras"),

  body("biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La biografía no puede superar los 500 caracteres"),

  body("avatar_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("El avatar_url debe tener un formato de URL válido"),

  body("birth_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)"),

  handleValidationErrors,
];

// ==========================================
// Validaciones para Gestión de Usuarios (Admin)
// ==========================================

export const validateCreateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre de usuario solo puede contener letras y números")
    .custom(async (username) => {
      const existingUser = await UserModel.findOne({ where: { username } });
      if (existingUser) {
        throw new Error("El nombre de usuario ya está en uso");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("El correo electrónico ya está en uso");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener mayúscula, minúscula y número"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),

  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras"),

  body("biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La biografía no puede superar los 500 caracteres"),

  body("avatar_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("El avatar_url debe ser una URL válida"),

  body("birth_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("La fecha de nacimiento debe ser válida (YYYY-MM-DD)"),

  handleValidationErrors,
];

export const validateUpdateUser = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de usuario debe ser un entero positivo")
    .custom(async (id) => {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw new Error("El usuario a actualizar no existe en la base de datos");
      }
      return true;
    }),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre de usuario solo puede ser alfanumérico")
    .custom(async (username, { req }) => {
      const existingUser = await UserModel.findOne({
        where: {
          username,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (existingUser) {
        throw new Error("El nombre de usuario ya se encuentra en uso por otro usuario");
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .custom(async (email, { req }) => {
      const existingUser = await UserModel.findOne({
        where: {
          email,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (existingUser) {
        throw new Error("El correo electrónico ya se encuentra en uso por otro usuario");
      }
      return true;
    }),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener mayúscula, minúscula y número"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),

  handleValidationErrors,
];


// Validaciones de Artículos (Articles)


export const validateCreateArticle = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("El contenido es obligatorio")
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener un mínimo de 50 caracteres"),

  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El resumen no puede superar los 500 caracteres"),

  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El estado solo puede ser 'published' o 'archived'"),

  body("user_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El user_id debe ser un entero positivo")
    .custom(async (userId, { req }) => {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error("El usuario asignado al artículo no existe");
      }
      if (req.user.role !== "admin" && userId !== req.user.id) {
        throw new Error("No puedes crear un artículo a nombre de otro usuario");
      }
      return true;
    }),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Las etiquetas deben enviarse como un arreglo de IDs")
    .custom(async (tags) => {
      if (Array.isArray(tags) && tags.length > 0) {
        const foundTags = await TagModel.findAll({
          where: { id: tags },
        });
        if (foundTags.length !== tags.length) {
          throw new Error("Una o más etiquetas especificadas no existen en la base de datos");
        }
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateArticle = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del artículo debe ser un número entero positivo")
    .custom(async (id) => {
      const article = await ArticleModel.findByPk(id);
      if (!article) {
        throw new Error("El artículo no existe");
      }
      return true;
    }),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener un mínimo de 50 caracteres"),

  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El resumen no puede superar los 500 caracteres"),

  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El estado solo puede ser 'published' o 'archived'"),

  handleValidationErrors,
];

// ==========================================
// Validaciones de Etiquetas (Tags)
// ==========================================

export const validateCreateTag = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la etiqueta es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre de la etiqueta debe tener entre 2 y 30 caracteres")
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("El nombre de la etiqueta no puede contener espacios");
      }
      return true;
    })
    .custom(async (name) => {
      const existingTag = await TagModel.findOne({ where: { name } });
      if (existingTag) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateTag = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de la etiqueta debe ser un número entero positivo")
    .custom(async (id) => {
      const tag = await TagModel.findByPk(id);
      if (!tag) {
        throw new Error("La etiqueta a actualizar no existe");
      }
      return true;
    }),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la etiqueta es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre de la etiqueta debe tener entre 2 y 30 caracteres")
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("El nombre de la etiqueta no puede contener espacios");
      }
      return true;
    })
    .custom(async (name, { req }) => {
      const existingTag = await TagModel.findOne({
        where: {
          name,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (existingTag) {
        throw new Error("Ya existe otra etiqueta registrada con ese nombre");
      }
      return true;
    }),

  handleValidationErrors,
];

// ==========================================
// Validaciones de Asociación Artículo-Etiqueta
// ==========================================

export const validateAddArticleTag = [
  body("article_id")
    .notEmpty()
    .withMessage("El ID del artículo es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El article_id debe ser un número entero positivo")
    .custom(async (article_id) => {
      const article = await ArticleModel.findByPk(article_id);
      if (!article) {
        throw new Error("El artículo especificado no existe");
      }
      return true;
    }),

  body("tag_id")
    .notEmpty()
    .withMessage("El ID de la etiqueta es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El tag_id debe ser un número entero positivo")
    .custom(async (tag_id) => {
      const tag = await TagModel.findByPk(tag_id);
      if (!tag) {
        throw new Error("La etiqueta especificada no existe en la base de datos");
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateRemoveArticleTag = [
  param("articleTagId")
    .isInt({ min: 1 })
    .withMessage("El parámetro articleTagId debe ser un número entero positivo"),

  handleValidationErrors,
];

export default {
  handleValidationErrors,
  validateIdParam,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateCreateUser,
  validateUpdateUser,
  validateCreateArticle,
  validateUpdateArticle,
  validateCreateTag,
  validateUpdateTag,
  validateAddArticleTag,
  validateRemoveArticleTag,
};
