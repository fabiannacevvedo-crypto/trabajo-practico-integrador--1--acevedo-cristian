import { Router } from "express";
import {
  createArticle,
  getPublishedArticles,
  getArticleById,
  getUserPublishedArticles,
  getUserArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkArticleAuthorOrAdmin } from "../middlewares/owner.middleware.js";
import {
  validateIdParam,
  validateCreateArticle,
  validateUpdateArticle,
} from "../middlewares/validators.middleware.js";

const router = Router();

// Todas las rutas de artículos requieren autenticación
router.use(authMiddleware);

// Rutas de artículos del usuario logueado (deben registrarse ANTES de /:id para evitar colisiones)
router.get("/user", getUserPublishedArticles);
router.get("/user/:id", validateIdParam("id"), getUserArticleById);

// Listar publicados y crear artículo
router.get("/", getPublishedArticles);
router.post("/", validateCreateArticle, createArticle);

// Operaciones por ID de artículo
router.get("/:id", validateIdParam("id"), getArticleById);
router.put("/:id", validateIdParam("id"), checkArticleAuthorOrAdmin, validateUpdateArticle, updateArticle);
router.delete("/:id", validateIdParam("id"), checkArticleAuthorOrAdmin, deleteArticle);

export const articleRouter = router;
export default router;
