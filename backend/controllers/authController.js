const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const Rank = require('../models/Rank');
const AuditLog = require('../models/AuditLog');
 
// ── Helper: generar JWT ───────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
 
// ── Helper: registrar login en audit log ─────────────────────────────────────
const logLogin = async (userId, ip) => {
  await AuditLog.create({
    performedBy: userId,
    action: 'LOGIN',
    ipAddress: ip,
  });
};
 
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Login con email + contraseña
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }
 
  try {
    const user = await User.findOne({ email }).populate('rank').populate('divisions');
 
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
 
    if (user.authProvider === 'discord') {
      return res.status(400).json({
        message: 'Esta cuenta solo permite login con Discord',
      });
    }
 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
 
    await logLogin(user._id, req.ip);
 
    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/create-agent
// Crear cuenta de un nuevo agente (solo Sargento+)
// Body: { username, email, password, jurisdiction, rankId }
// ─────────────────────────────────────────────────────────────────────────────
const createAgent = async (req, res) => {
  const { username, email, password, jurisdiction, rankId } = req.body;
 
  if (!username || !email || !password || !jurisdiction || !rankId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
 
  try {
    // El rango asignado no puede ser superior al de quien lo crea
    const targetRank = await Rank.findById(rankId);
    if (!targetRank) {
      return res.status(404).json({ message: 'Rango no encontrado' });
    }
 
    if (targetRank.level >= req.user.rank.level) {
      return res.status(403).json({
        message: 'No puedes asignar un rango igual o superior al tuyo',
      });
    }
 
    // El rango debe pertenecer a la misma jurisdicción (o ser SAPD)
    if (targetRank.jurisdiction !== jurisdiction && targetRank.jurisdiction !== 'SAPD') {
      return res.status(400).json({
        message: 'El rango no corresponde a la jurisdicción indicada',
      });
    }
 
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'El email o nombre de usuario ya existe' });
    }
 
    const newUser = await User.create({
      username,
      email,
      password,
      jurisdiction,
      rank: rankId,
      authProvider: 'local',
    });
 
    await AuditLog.create({
      performedBy: req.user._id,
      targetUser: newUser._id,
      action: 'USER_CREATED',
      details: {
        newValue: { username, email, jurisdiction, rank: targetRank.name },
      },
      ipAddress: req.ip,
    });
 
    const populated = await newUser.populate(['rank', 'divisions']);
    res.status(201).json({ user: populated });
  } catch (err) {
    console.error('Error al crear agente:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/discord
// Redirige al usuario a la pantalla de autorización de Discord
// ─────────────────────────────────────────────────────────────────────────────
const discordRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });
 
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
};
 
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/discord/callback
// Discord redirige aquí con un `code`. Intercambiamos el code por un token
// y buscamos (o vinculamos) al usuario en nuestra BD.
// ─────────────────────────────────────────────────────────────────────────────
const discordCallback = async (req, res) => {
  const { code } = req.query;
 
  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=discord_no_code`);
  }
 
  try {
    // 1. Intercambiar code por access token de Discord
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
 
    const { access_token } = tokenRes.data;
 
    // 2. Obtener datos del usuario de Discord
    const discordUser = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
 
    const { id: discordId, username: discordUsername, avatar, email } = discordUser.data;
 
    // 3. Buscar si ya existe un usuario vinculado a este discordId
    let user = await User.findOne({ discordId }).populate('rank').populate('divisions');
 
    if (user) {
      // Ya vinculado — actualizar datos de Discord por si cambiaron
      user.discordUsername = discordUsername;
      user.discordAvatar = avatar;
      if (user.authProvider === 'local') user.authProvider = 'both';
      await user.save();
    } else {
      // Buscar por email para vincular cuenta local existente
      user = await User.findOne({ email }).populate('rank').populate('divisions');
 
      if (user) {
        // Vincular Discord a la cuenta local existente
        user.discordId = discordId;
        user.discordUsername = discordUsername;
        user.discordAvatar = avatar;
        user.authProvider = 'both';
        await user.save();
      } else {
        // No existe ninguna cuenta — Discord no puede crear cuentas nuevas
        // solo un superior puede hacerlo desde el panel
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=discord_no_account`
        );
      }
    }
 
    if (!user.active) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=account_inactive`);
    }
 
    await logLogin(user._id, req.ip);
 
    // 4. Redirigir al frontend con el JWT en la URL (el cliente lo guarda)
    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('Error en Discord callback:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=discord_failed`);
  }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// Devuelve el usuario autenticado actual
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('rank')
    .populate('divisions');
 
  res.json({ user });
};
 
module.exports = {
  login,
  createAgent,
  discordRedirect,
  discordCallback,
  getMe,
};