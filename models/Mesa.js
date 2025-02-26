const mongoose = require("mongoose");

const MesaSchema = new mongoose.Schema({
  master: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sistema: { type: String, required: true },
  cupos: { type: Number, required: true },
  sinopsis: { type: String, required: true },
  jugadores: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Mesa", MesaSchema);
