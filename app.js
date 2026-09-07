import express from "express";
import { startDB } from "./src/config/data.base.js";
import { userRouter } from "./src/routes/user.routes.js";
import { TaskModel } from "./src/models/task.model.js";
import { UserRoleModel } from "./src/models/user_role.model.js";
import { taskRouter } from "./src/routes/task.routes.js";
import { personRouter } from "./src/routes/person.routes.js";

const app = express();
const PORT = 3001;

// para que entienda el formato json
app.use(express.json());

//configuracion de las rutas
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.use("/api", personRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
