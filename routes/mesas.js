const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const Mesa = require("../models/Mesa");

//Ruta protegida: solo jugadores autenticados pueden ver las mesas.
router.get("/", verificarToken, async (req, res) => {
  try {
    res.json({ message: "Lista de mesas (protegida)", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

//📌 Crear una mesa (Solo DMs pueden crear mesas)
router.post("/", verificarToken, async (req, res) => {
  try {
    if (req.user.rol !== "dm") {
      return res
        .status(403)
        .json({ message: "Solo un DM puede crear una mesa." });
    }

    const { sistema, cupos, sinopsis } = req.body;
    const nuevaMesa = new Mesa({
      master: req.user.id,
      sistema,
      cupos,
      sinopsis,
      jugadores: [],
    });

    await nuevaMesa.save();
    res.jason({ message: "Mesa creada con éxito ", mesa: nuevaMesa });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

//📌 Obetener todas las mesas
router.get("/", async (req, res) => {
  try {
    const mesas = await Mesa.find()
      .populate("master", "username")
      .populate("jugadores", "username");
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

//📌 Unirse a una mesa
router.post("/:id/unirse", verificarToken, async (req, res) => {
  try {
    const mesa = await Mesa.findById(req.params.id);
    if (!mesa) return res.status(404).json({ message: "Mesa no encontrada" });

    if (mesa.jugadores.length >= mesa.cupo) {
      return res.status(400).json({ message: "La mesa está llena." });
    }

    if (mesa.jugadores.includes(req.user.id)) {
      return res.status(400).json({ message: "Ya estás en esta mesa " });
    }

    mesa.jugadores.push(req.user.id);
    await mesa.save();

    res.jason({ message: "Te has unido a la mesa", mesa });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
