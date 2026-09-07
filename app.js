import express from "express";
import { startDB } from "./src/config/data.base.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { personRouter } from "./src/routes/person.routes.js";
import { taskRouter } from "./src/routes/task.routes.js";
import { userRouter } from "./src/routes/user.routes.js";

import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

// para que entienda el formato json
app.use(express.json());

app.use(cookieParser()); //  para leer req.cookies

//configuracion de las rutas
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.use("/api", personRouter);
app.use("/api", authRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
