const jwt = require('jsonwebtoken');
const User = require('../models/User');
 
// ── Verificar JWT ─────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;
 
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
 
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, token requerido' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Cargamos el usuario con su rango para tener level y permisos disponibles
    req.user = await User.findById(decoded.id)
      .select('-password')
      .populate('rank');
 
    if (!req.user || !req.user.active) {
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo' });
    }
 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
 
// ── Solo admins de la app (isAdmin: true) ─────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Acceso restringido a administradores' });
  }
  next();
};
 
// ── Rango mínimo requerido ─────────────────────────────────────────────────────
// Uso: requireLevel(5)  → solo Sargento en adelante
const requireLevel = (minLevel) => (req, res, next) => {
  if (!req.user?.rank || req.user.rank.level < minLevel) {
    return res.status(403).json({
      message: `Se requiere al menos nivel ${minLevel} para esta acción`,
    });
  }
  next();
};
 
// ── Puede crear/editar cuentas (Sargento+, level >= 5) ────────────────────────
const canEditRanks = (req, res, next) => {
  if (!req.user?.rank?.canEditRanks) {
    return res.status(403).json({
      message: 'No tienes permisos para gestionar rangos',
    });
  }
  next();
};
 
// ── Puede aprobar cambios de jurisdicción (Comandante+, level >= 9) ───────────
const canApproveJurisdictionChange = (req, res, next) => {
  if (!req.user?.rank?.canApproveJurisdictionChange) {
    return res.status(403).json({
      message: 'Solo Comandantes y la Jefa SAPD pueden aprobar cambios de jurisdicción',
    });
  }
  next();
};
 
module.exports = {
  protect,
  adminOnly,
  requireLevel,
  canEditRanks,
  canApproveJurisdictionChange,
};