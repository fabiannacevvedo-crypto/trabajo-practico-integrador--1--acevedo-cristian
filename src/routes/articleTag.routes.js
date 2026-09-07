import { Router } from "express";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articleTag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  checkArticleAuthorOnly,
  checkArticleTagAuthorOnly,
} from "../middlewares/owner.middleware.js";
import {
  validateAddArticleTag,
  validateRemoveArticleTag,
} from "../middlewares/validators.middleware.js";

const router = Router();

// Rutas de asociación de artículos con etiquetas (solo autor del artículo)
router.use(authMiddleware);

router.post("/", validateAddArticleTag, checkArticleAuthorOnly, addTagToArticle);
router.delete("/:articleTagId", validateRemoveArticleTag, checkArticleTagAuthorOnly, removeTagFromArticle);

export const articleTagRouter = router;
export default router;
