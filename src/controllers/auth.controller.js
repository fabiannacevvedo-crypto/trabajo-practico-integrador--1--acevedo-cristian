import { matchedData } from "express-validator";
import { PersonModel } from "../models/person.model.js";
import { UserModel } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../helpers/bcript.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // const { username, password } = matchedData(req, { locations: ["body"] });

    const userExist = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!userExist) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    //llega a este punto
    const validPassword = await comparePassword(password, userExist.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    //generar el token
    const token = generateToken({ idUser: userExist.id });

    // Enviar token como cookie
    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    // const user = await UserModel.create(validatedData);
    return res.status(201).json({
      message: "Usuario logueado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;
    // const { name, lastname, username, email, password } = matchedData(req, { locations: ["body"] });

    const newPerson = await PersonModel.create({ name, lastname });

    const hashedPassword = await hashPassword(password);

    // validacion para ver si el username o email ya existen

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
      person_id: newPerson.id,
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token"); // Eliminar cookie del navegador
  return res.json({ message: "Logout exitoso" });
};
