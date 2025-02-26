const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ?? Registro de Usuario
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      rol: rol || "player",  // Si no envía un rol, por defecto es "player"
    });

    // Guardar en la base de datos
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
