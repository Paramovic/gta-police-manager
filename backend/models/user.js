const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    discordId: { type: String, required: true },
    rank: { type: String, default: "Cadete" },
    jurisdiccion: { type: String, default: "SAPD" },
    placa: { type: String, default: "000" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);