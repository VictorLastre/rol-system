require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const mesasRoutes = require("./routes/mesas");

const app = express();
app.use(express.json()); // Permitir recibir JSON en las peticiones

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("?? Conectado a MongoDB Atlas"))
  .catch((err) => console.error("? Error al conectar:", err));

// Rutas de autenticaci�n
app.use("/api/auth", authRoutes);
app.use("/api/mesas", mesasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`?? Servidor corriendo en http://localhost:${PORT}`)
);
