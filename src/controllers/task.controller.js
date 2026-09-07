import { PersonModel } from "../models/person.model.js";
import { TaskModel } from "../models/task.model.js";
import { UserModel } from "../models/user.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, user_id } = req.body;

    const task = await TaskModel.create({ title, description, user_id });
    return res.status(201).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      attributes: {
        exclude: ["user_id"],
      },
      //   attributes: ["title"],
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: {
            exclude: ["password", "person_id"],
          },
          include: [
            {
              model: PersonModel,
              as: "owner",
            },
          ],
        },
      ],
    });
    return res.status(201).json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
