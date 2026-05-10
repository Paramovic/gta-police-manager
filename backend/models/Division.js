const mongoose = require('mongoose');
 
const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Divisiones troncales: 'Detective Bureau', 'Metropolitan Division'
      // Divisiones adicionales: 'RTD', 'ASD', 'SAHP', 'PPD', 'SASPA', 'PD', 'RRPP', 'K9 Unit'
    },
    acronym: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 6,
    },
    description: {
      type: String,
      default: '',
    },
    // Las divisiones troncales (DB y METRO) son mutuamente excluyentes:
    // un agente solo puede pertenecer a una de ellas.
    // Las divisiones no troncales se pueden combinar libremente.
    troncal: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Coordinadores de la división (pueden ser varios)
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Miembros activos en la división
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        // Nota interna del coordinador sobre el miembro (opcional)
        notes: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
 
// Índice para buscar divisiones activas rápidamente
divisionSchema.index({ active: 1 });
 
// Virtual: número de miembros actuales
divisionSchema.virtual('memberCount').get(function () {
  return this.members.length;
});
 
module.exports = mongoose.model('Division', divisionSchema);