const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

    // Encriptar contrase�a
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      rol: rol || "player", // Si no env�a un rol, por defecto es "player"
    });

    // Guardar en la base de datos
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con �xito" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Recibido:", { email, password });

    //Verificar si el usuario existe
    const user = await User.findOne({ email });
    console.log("👤 Usuario encontrado:", user);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    //Comprobar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Coincide la contraseña:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    //Generar Token JWT
    const token = jwt.sign(
      { id: user._id, rol: user.rol }, // ✅ CORRECTO: `user._id` viene de la base de datos
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("🛡️ Token generado:", token);

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("🔥 Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
