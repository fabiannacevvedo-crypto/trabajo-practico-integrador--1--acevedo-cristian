import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/task.controller.js";

export const taskRouter = Router();

taskRouter.post("/tasks", createTask);
taskRouter.get("/tasks", getAllTasks);
// taskRouter.get("/tasks/:id", getTaskById);
// taskRouter.put("/tasks/:id", updateTask);
// taskRouter.delete("/tasks/:id", deleteTask);
