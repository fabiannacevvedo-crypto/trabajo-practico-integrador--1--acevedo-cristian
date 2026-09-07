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

export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;

    const personExist = await PersonModel.findByPk(id);

    if (!personExist) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }

    await personExist.destroy();

    return res.status(200).json({ message: "Persona eliminada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAllPeople = async (req, res) => {
  try {
    const people = await PersonModel.findAll({
      paranoid: false,
    });

    return res.status(200).json(people);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
