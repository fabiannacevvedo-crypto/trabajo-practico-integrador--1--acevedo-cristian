import { Router } from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  validateIdParam,
  validateCreateTag,
  validateUpdateTag,
} from "../middlewares/validators.middleware.js";

const router = Router();

// Todas las rutas requieren usuario autenticado
router.use(authMiddleware);

// Listar todas las etiquetas (usuario autenticado)
router.get("/", getAllTags);

// Endpoints reservados solo para administradores
router.post("/", adminMiddleware, validateCreateTag, createTag);
router.get("/:id", adminMiddleware, validateIdParam("id"), getTagById);
router.put("/:id", adminMiddleware, validateIdParam("id"), validateUpdateTag, updateTag);
router.delete("/:id", adminMiddleware, validateIdParam("id"), deleteTag);

export const tagRouter = router;
export default router;
