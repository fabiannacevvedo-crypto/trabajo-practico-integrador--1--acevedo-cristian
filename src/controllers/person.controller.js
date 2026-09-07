import { PersonModel } from "../models/person.model.js";

export const createPerson = async (req, res) => {
  try {
    const { name, lastname } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El name no debe ser vacio" });
    }

    const person = await PersonModel.create({ name, lastname });
    return res.status(201).json(person);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
