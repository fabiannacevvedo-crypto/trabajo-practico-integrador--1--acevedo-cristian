import { ArticleModel, UserModel, TagModel, ArticleTagModel, sequelize } from "../models/index.js";

/**
 * Crear un nuevo artículo.
 * Ruta: POST /api/articles (Usuario Autenticado)
 */
export const createArticle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { title, content, excerpt, status = "published", tags } = req.body;

    const userId = req.user.role === "admin" && req.body.user_id ? req.body.user_id : req.user.id;

    const newArticle = await ArticleModel.create(
      {
        title,
        content,
        excerpt: excerpt || null,
        status,
        user_id: userId,
      },
      { transaction: t }
    );

    if (Array.isArray(tags) && tags.length > 0) {
      const tagAssociations = tags.map((tagId) => ({
        article_id: newArticle.id,
        tag_id: tagId,
      }));
      await ArticleTagModel.bulkCreate(tagAssociations, { transaction: t });
    }

    await t.commit();

    const fullArticle = await ArticleModel.findByPk(newArticle.id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "username", "email"],
        },
        {
          model: TagModel,
          as: "tags",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json({
      message: "Artículo creado exitosamente",
      data: fullArticle,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Error al crear el artículo",
      error: error.message,
    });
  }
};

/**
 * Listar todos los artículos publicados.
 * Ruta: GET /api/articles (Usuario Autenticado)
 */
export const getPublishedArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.findAll({
      where: { status: "published" },
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "username", "email"],
        },
        {
          model: TagModel,
          as: "tags",
          through: { attributes: [] },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Artículos publicados listados exitosamente",
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al listar los artículos publicados",
      error: error.message,
    });
  }
};

/**
 * Listar artículos publicados del usuario logueado.
 * Ruta: GET /api/articles/user (Usuario Autenticado)
 */
export const getUserPublishedArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.findAll({
      where: {
        user_id: req.user.id,
        status: "published",
      },
      include: [
        {
          model: TagModel,
          as: "tags",
          through: { attributes: [] },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Artículos del usuario logueado listados exitosamente",
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al listar los artículos del usuario",
      error: error.message,
    });
  }
};

/**
 * Obtener un artículo del usuario logueado por su ID.
 * Ruta: GET /api/articles/user/:id (Usuario Autenticado)
 */
export const getUserArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await ArticleModel.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
      include: [
        {
          model: TagModel,
          as: "tags",
          through: { attributes: [] },
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "Artículo del usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Artículo del usuario obtenido exitosamente",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el artículo del usuario",
      error: error.message,
    });
  }
};

/**
 * Obtener artículo específico por su ID.
 * Ruta: GET /api/articles/:id (Usuario Autenticado)
 */
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await ArticleModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ["id", "username", "email"],
        },
        {
          model: TagModel,
          as: "tags",
          through: { attributes: [] },
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    return res.status(200).json({
      message: "Artículo obtenido exitosamente",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el artículo",
      error: error.message,
    });
  }
};

/**
 * Actualizar artículo existente.
 * Ruta: PUT /api/articles/:id (Solo Autor o Admin)
 */
export const updateArticle = async (req, res) => {
  try {
    const article = req.article;
    const { title, content, excerpt, status } = req.body;

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (status !== undefined) article.status = status;

    await article.save();

    return res.status(200).json({
      message: "Artículo actualizado exitosamente",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el artículo",
      error: error.message,
    });
  }
};

/**
 * Eliminación lógica del artículo y eliminación en cascada de sus asociaciones con etiquetas.
 * Ruta: DELETE /api/articles/:id (Solo Autor o Admin)
 */
export const deleteArticle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const article = req.article;

    // Eliminación en cascada de las asociaciones con etiquetas
    await ArticleTagModel.destroy({
      where: { article_id: article.id },
      transaction: t,
    });

    // Eliminación lógica del artículo (paranoid: true)
    await article.destroy({ transaction: t });

    await t.commit();

    return res.status(200).json({
      message: "Artículo eliminado lógicamente y sus asociaciones eliminadas en cascada exitosamente",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      message: "Error al eliminar el artículo",
      error: error.message,
    });
  }
};

export default {
  createArticle,
  getPublishedArticles,
  getArticleById,
  getUserPublishedArticles,
  getUserArticleById,
  updateArticle,
  deleteArticle,
};
