console.log('🔍 Testando imports...');

try {
    console.log('1. Carregando express...');
    const express = require('express');
    console.log('✅ Express carregado');

    console.log('2. Carregando authController...');
    const authController = require('./src/controllers/authController');
    console.log('✅ AuthController carregado');
    console.log('Métodos disponíveis:', Object.keys(authController));

    console.log('3. Carregando authRoutes...');
    const authRoutes = require('./src/routes/authRoutes');
    console.log('✅ AuthRoutes carregado');

    console.log('4. Testando rota de cadastro...');
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    // Testar se as rotas estão registradas
    console.log('✅ Todas as dependências carregadas com sucesso!');

} catch (error) {
    console.error('❌ Erro ao carregar dependências:');
    console.error(error.message);
    console.error(error.stack);
}
