import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createUserValidation,
  updateUserValidation,
} from "../middlewares/validations/user.validation.js";

export const userRouter = Router();

userRouter.post("/users", createUserValidation, validate, createUser);
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUserValidation, validate, updateUser);
userRouter.delete("/users/:id", deleteUser);
