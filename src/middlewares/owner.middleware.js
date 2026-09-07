import { ArticleModel, ArticleTagModel } from "../models/index.js";

/**
 * Middleware que verifica si el usuario autenticado es el autor del artículo o es administrador.
 */
export const checkArticleAuthorOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await ArticleModel.findByPk(id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    const isAuthor = article.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el autor del artículo o un administrador pueden realizar esta acción",
      });
    }

    req.article = article;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error en la verificación de propiedad del artículo",
      error: error.message,
    });
  }
};

/**
 * Middleware que verifica que el usuario autenticado sea estrictamente el autor del artículo.
 */
export const checkArticleAuthorOnly = async (req, res, next) => {
  try {
    const articleId = req.body.article_id || req.params.articleId;

    if (!articleId) {
      return res.status(400).json({
        message: "El ID del artículo es requerido",
      });
    }

    const article = await ArticleModel.findByPk(articleId);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    if (article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el autor del artículo puede gestionar sus etiquetas",
      });
    }

    req.article = article;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error en la verificación de autoría del artículo",
      error: error.message,
    });
  }
};

/**
 * Middleware para verificar que solo el autor pueda desasociar una etiqueta de su artículo.
 */
export const checkArticleTagAuthorOnly = async (req, res, next) => {
  try {
    const { articleTagId } = req.params;

    const association = await ArticleTagModel.findByPk(articleTagId, {
      include: [
        {
          model: ArticleModel,
          as: "article",
        },
      ],
    });

    if (!association) {
      return res.status(404).json({
        message: "Asociación entre artículo y etiqueta no encontrada",
      });
    }

    if (association.article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el autor del artículo puede remover esta etiqueta",
      });
    }

    req.articleTag = association;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error en la verificación de propiedad de la asociación de etiqueta",
      error: error.message,
    });
  }
};

export default {
  checkArticleAuthorOrAdmin,
  checkArticleAuthorOnly,
  checkArticleTagAuthorOnly,
};
