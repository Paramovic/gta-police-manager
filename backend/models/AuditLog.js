const mongoose = require('mongoose');
 
const auditLogSchema = new mongoose.Schema(
  {
    // Quién realizó la acción
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // A quién le afecta la acción
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Tipo de acción realizada
    action: {
      type: String,
      required: true,
      enum: [
        'RANK_CHANGE',        // Cambio de rango a un usuario
        'DIVISION_ADD',       // Usuario añadido a una división
        'DIVISION_REMOVE',    // Usuario eliminado de una división
        'USER_CREATED',       // Nuevo usuario registrado
        'USER_DEACTIVATED',   // Usuario desactivado
        'DIVISION_CREATED',   // Nueva división creada
        'DIVISION_UPDATED',   // División modificada
        'LOGIN',              // Inicio de sesión
      ],
    },
    // Datos del cambio: valor anterior y nuevo valor
    details: {
      previousValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
      extra: mongoose.Schema.Types.Mixed, // Info adicional (ej: nombre de división)
    },
    // IP desde la que se realizó la acción (opcional, para seguridad)
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    // Solo createdAt, los logs no se editan
    timestamps: { createdAt: true, updatedAt: false },
  }
);
 
// Índices para consultas frecuentes
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ targetUser: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
 
module.exports = mongoose.model('AuditLog', auditLogSchema);