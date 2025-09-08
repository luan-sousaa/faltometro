const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API
app.use('/api/auth', authRoutes);

// Rota principal - redireciona para o login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor' 
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Rota não encontrada' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Faltômetro executando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});

module.exports = app;
