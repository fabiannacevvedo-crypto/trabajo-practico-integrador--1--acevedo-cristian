import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { startDB } from "./src/config/database.js";
import apiRouter from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales básicos
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Rutas principales de la API
app.use("/api", apiRouter);

// Manejador para rutas no encontradas (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada en el servidor",
  });
});

// Inicio del servidor y conexión con la base de datos
app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});

export { app, startDB };
export default app;
