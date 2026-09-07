import { body } from "express-validatior";

export const createUserValitation = [
    body("name").notEmpty().withMessage("el name no debe ser vacio"),
    body("email")
        .notEmpty()
        .withMessage("el email no debe ser vacio")
        .isEmail()
        .withMessage("el email debe ser valido"),
    body("password").notEmpty().withMessage("el password no debe ser vacia "),
    body("person_id").notEmpty().withMessage("el person id no debe ser vacio"),
];

export const updateUserValidation = [
    body("name").optional().notEmpty().withMessage("el name no debe ser vacio"),
    body("email")
    .notEmpty()
    .withMessage("el email no debe ser vacio"),
    body("password").notEmpty().withMessage("la password no debe ser vacia"),
    body("person_id").notEmpty().withMessage("el person id no debe ser vacio"),
];