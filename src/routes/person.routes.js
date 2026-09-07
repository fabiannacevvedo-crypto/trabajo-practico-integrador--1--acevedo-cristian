import { Router } from "express";
import {
  createPerson,
  deletePerson,
  getAllPeople,
} from "../controllers/person.controller.js";

export const personRouter = Router();

personRouter.get("/people", getAllPeople);
personRouter.post("/people", createPerson);
personRouter.delete("/people/:id", deletePerson);
