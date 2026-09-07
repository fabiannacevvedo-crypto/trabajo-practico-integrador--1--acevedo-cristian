import { Sequelize } from "sequelize";

// conexion a la base de datos
export const sequelize = new Sequelize("tasks_users_db_2", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// testear la conexion
export const startDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Conexion a la db esta lista");
  } catch (error) {
    console.error("No se pudo conectar a la db:", error);
  }
};
