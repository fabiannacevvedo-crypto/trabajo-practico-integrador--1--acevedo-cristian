import { TagModel, ArticleModel } from "../models/index.js";

/**
 * Crear una nueva etiqueta.
 * Ruta: POST /api/tags (Solo Admin)
 */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const newTag = await TagModel.create({ name });

    return res.status(201).json({
      message: "Etiqueta creada exitosamente",
      data: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la etiqueta",
      error: error.message,
    });
  }
};

/**
 * Listar todas las etiquetas existentes.
 * Ruta: GET /api/tags (Usuario Autenticado)
 */
export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.findAll({
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      message: "Etiquetas listadas exitosamente",
      data: tags,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al listar las etiquetas",
      error: error.message,
    });
  }
};

/**
 * Obtener etiqueta específica con sus artículos asociados.
 * Ruta: GET /api/tags/:id (Solo Admin)
 */
export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await TagModel.findByPk(id, {
      include: [
        {
          model: ArticleModel,
          as: "articles",
          through: { attributes: [] },
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada",
      });
    }

    return res.status(200).json({
      message: "Etiqueta obtenida exitosamente",
      data: tag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la etiqueta",
      error: error.message,
    });
  }
};

/**
 * Actualizar una etiqueta existente.
 * Ruta: PUT /api/tags/:id (Solo Admin)
 */
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await TagModel.findByPk(id);

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada para actualizar",
      });
    }

    tag.name = name;
    await tag.save();

    return res.status(200).json({
      message: "Etiqueta actualizada exitosamente",
      data: tag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la etiqueta",
      error: error.message,
    });
  }
};

/**
 * Eliminar una etiqueta.
 * Ruta: DELETE /api/tags/:id (Solo Admin)
 */
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await TagModel.findByPk(id);

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada para eliminar",
      });
    }

    await tag.destroy();

    return res.status(200).json({
      message: "Etiqueta eliminada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la etiqueta",
      error: error.message,
    });
  }
};

export default {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
