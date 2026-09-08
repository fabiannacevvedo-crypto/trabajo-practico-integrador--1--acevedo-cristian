import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "blog_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3001,
    dialect: "mysql",
    logging: false,
  }
);

export const startDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
    await sequelize.sync({ alter: false });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error.message);
  }
};

export default { sequelize, startDB };
