import express from "express";
import { startDB } from "./src/config/data.base.js";



const app = express();
const PORT = process.env.PORT || 3001;

// para que entienda el formato json
app.use(express.json());


//configuracion de las rutas
// app.use("/api", userRouter);
// app.use("/api", taskRouter);


app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
