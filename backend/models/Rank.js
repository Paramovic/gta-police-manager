const mongoose = require('mongoose');
 
const rankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // Ejemplos: 'Oficial I', 'Deputy Sheriff', 'Sargento', 'Jefa SAPD'
    },
    // Nivel de autoridad — rangos equivalentes entre jurisdicciones
    // comparten el mismo level (ej: Sargento LSPD y Sargento BCSO = level 5)
    level: {
      type: Number,
      required: true,
      // LSPD / BCSO:  1=base, 2, 3, 4, 5=Sargento, 6=Sargento II,
      //               7=Teniente, 8=Teniente II, 9=Comandante
      // SAPD global:  10=Jefa SAPD
    },
    // A qué cuerpo pertenece este rango
    jurisdiction: {
      type: String,
      required: true,
      enum: ['LSPD', 'BCSO', 'SAPD'],
      // SAPD = rangos globales por encima de las dos jurisdicciones (Jefa)
    },
    // Permisos
    canEditRanks: {
      type: Boolean,
      default: false,
      // Sargento en adelante (level >= 5)
    },
    canManageDivisions: {
      type: Boolean,
      default: false,
      // Teniente en adelante (level >= 7)
    },
    canApproveJurisdictionChange: {
      type: Boolean,
      default: false,
      // Solo Comandante (level 9) y Jefa SAPD (level 10)
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
 
// Un mismo nombre puede existir en LSPD y BCSO (ej: 'Sargento' en ambas),
// pero no puede repetirse dentro de la misma jurisdicción
rankSchema.index({ name: 1, jurisdiction: 1 }, { unique: true });
rankSchema.index({ level: 1, jurisdiction: 1 });
 
module.exports = mongoose.model('Rank', rankSchema);