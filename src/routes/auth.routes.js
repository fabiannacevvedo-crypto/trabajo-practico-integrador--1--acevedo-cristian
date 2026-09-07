import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

authRouter.get("/logout", logout);
// authRouter.post("/profile", createPerson);
