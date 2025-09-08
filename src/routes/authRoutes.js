const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware para rate limiting específico da autenticação
const rateLimit = require('express-rate-limit');

// Rate limit mais rigoroso para tentativas de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: { 
    success: false, 
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit para cadastro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 cadastros por IP por hora
  message: { 
    success: false, 
    message: 'Muitas tentativas de cadastro. Tente novamente em 1 hora.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit para redefinição de senha
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 solicitações por IP por hora
  message: { 
    success: false, 
    message: 'Muitas solicitações de redefinição. Tente novamente em 1 hora.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rotas de autenticação

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuário e retornar token
 * @access  Public
 */
router.post('/login', loginLimiter, authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public
 */
router.post('/register', registerLimiter, authController.register);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Enviar email de redefinição de senha
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir senha usando token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verificar se token JWT é válido
 * @access  Private
 */
router.post('/verify-token', authController.verifyToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Fazer logout do usuário (invalidar token)
 * @access  Private
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Obter perfil do usuário autenticado
 * @access  Private
 */
router.get('/profile', authController.getProfile);

module.exports = router;
