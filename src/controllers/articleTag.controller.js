import { ArticleTagModel, ArticleModel, TagModel } from "../models/index.js";

/**
 * Asociar una etiqueta a un artículo.
 * Ruta: POST /api/articles-tags (Solo Autor)
 */
export const addTagToArticle = async (req, res) => {
  try {
    const { article_id, tag_id } = req.body;

    const existingAssociation = await ArticleTagModel.findOne({
      where: { article_id, tag_id },
    });

    if (existingAssociation) {
      return res.status(400).json({
        message: "La etiqueta ya se encuentra asociada a este artículo",
      });
    }

    const newAssociation = await ArticleTagModel.create({
      article_id,
      tag_id,
    });

    return res.status(201).json({
      message: "Etiqueta asociada al artículo exitosamente",
      data: newAssociation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al asociar la etiqueta al artículo",
      error: error.message,
    });
  }
};

/**
 * Desasociar una etiqueta de un artículo por su ID de relación.
 * Ruta: DELETE /api/articles-tags/:articleTagId (Solo Autor)
 */
export const removeTagFromArticle = async (req, res) => {
  try {
    const association = req.articleTag;

    await association.destroy();

    return res.status(200).json({
      message: "Etiqueta desasociada del artículo exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al desasociar la etiqueta del artículo",
      error: error.message,
    });
  }
};

export default {
  addTagToArticle,
  removeTagFromArticle,
};
