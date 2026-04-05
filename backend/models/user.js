const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = new mongoose.Schema(
  {
    // --- Identidad ---
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Nombre del personaje en el servidor de roleplay
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Permite null si se registró solo con Discord
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // No required: puede registrarse solo con Discord OAuth
    },
 
    // --- Discord ---
    discordId: {
      type: String,
      unique: true,
      sparse: true,
    },
    discordUsername: {
      type: String,
      default: null,
    },
    discordAvatar: {
      type: String,
      default: null,
    },
 
    // --- Jurisdicción a la que pertenece el agente ---
    jurisdiction: {
      type: String,
      required: true,
      enum: ['LSPD', 'BCSO'],
      // La Jefa SAPD también tiene jurisdicción (la suya es SAPD,
      // pero su rango ya lo indica — aquí guardamos LSPD o BCSO
      // para todos los demás, y para la Jefa ponemos su origen)
    },
 
    // --- Rango actual (referencia a Rank, que incluye la jurisdicción) ---
    rank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rank',
      required: true,
    },
 
    // --- Divisiones en las que participa (compartidas entre LSPD y BCSO) ---
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
      },
    ],
 
    // --- Solicitud de cambio de jurisdicción pendiente ---
    jurisdictionChangeRequest: {
      requested: { type: Boolean, default: false },
      targetJurisdiction: {
        type: String,
        enum: ['LSPD', 'BCSO', null],
        default: null,
      },
      requestedAt: { type: Date, default: null },
      // Quién aprobó/rechazó la solicitud
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', null],
        default: null,
      },
    },
 
    // --- Estado ---
    active: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      // Superadmin de la aplicación web (normalmente la Jefa SAPD)
    },
 
    // --- Método de registro ---
    authProvider: {
      type: String,
      enum: ['local', 'discord', 'both'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);
 
// Hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 
// Comparar contraseña en el login
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};
 
// No exponer la contraseña en respuestas JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
 
module.exports = mongoose.model('User', userSchema);