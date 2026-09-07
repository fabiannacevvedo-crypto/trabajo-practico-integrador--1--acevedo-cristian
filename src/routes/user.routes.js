import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  validateIdParam,
  validateCreateUser,
  validateUpdateUser,
} from "../middlewares/validators.middleware.js";

const router = Router();

// Todas las rutas de gestión de usuarios requieren autenticación y rol 'admin'
router.use(authMiddleware, adminMiddleware);

router.get("/", getAllUsers);
router.get("/:id", validateIdParam("id"), getUserById);
router.post("/", validateCreateUser, createUser);
router.put("/:id", validateIdParam("id"), validateUpdateUser, updateUser);
router.delete("/:id", validateIdParam("id"), deleteUser);

export const userRouter = router;
export default router;
