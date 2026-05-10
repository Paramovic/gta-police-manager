const express = require('express');
const router = express.Router();
const {
  login,
  createAgent,
  discordRedirect,
  discordCallback,
  getMe,
} = require('../controllers/authController');
const { protect, canEditRanks } = require('../middleware/auth');
 
// Login con email + contraseña
router.post('/login', login);
 
// Crear cuenta de nuevo agente (solo Sargento+)
router.post('/create-agent', protect, canEditRanks, createAgent);
 
// Discord OAuth2
router.get('/discord', discordRedirect);
router.get('/discord/callback', discordCallback);
 
// Usuario autenticado actual
router.get('/me', protect, getMe);
 
module.exports = router;