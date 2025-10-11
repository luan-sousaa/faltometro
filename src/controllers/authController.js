const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Simulação de banco de dados em memória (substitua por banco real)
let users = [];
let resetTokens = [];

// Configurações
const JWT_SECRET = process.env.JWT_SECRET || 'faltometro_secret_key_2025';
const JWT_EXPIRES_IN = '24h';
const RESET_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1 hora em ms

// Configuração do nodemailer (configure com suas credenciais reais)
const transporter = nodemailer.createTransport({
    // Para Gmail:
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'seu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua-senha-de-app'
    }
    // Para outros provedores, ajuste conforme necessário
});

// Funções auxiliares
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const generateResetToken = () => {
    return Math.random().toString(36).substr(2, 10) + Date.now().toString(36);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const findUserByEmail = (email) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const findUserByMatricula = (matricula) => {
    return users.find(user => user.matricula.toLowerCase() === matricula.toLowerCase());
};

// Controllers

/**
 * Registrar novo usuário
 */
const register = async (req, res) => {
    try {
        const { nomeCompleto, matricula, email, senha, tipoUsuario } = req.body;

        // Validações
        if (!nomeCompleto || !matricula || !email || !senha || !tipoUsuario) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido.'
            });
        }

        if (!validatePassword(senha)) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres.'
            });
        }

        if (!['aluno', 'professor'].includes(tipoUsuario)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de usuário inválido.'
            });
        }

        // Verificar se email já existe
        if (findUserByEmail(email)) {
            return res.status(409).json({
                success: false,
                message: 'Email já cadastrado.'
            });
        }

        // Verificar se matrícula já existe
        if (findUserByMatricula(matricula)) {
            return res.status(409).json({
                success: false,
                message: 'Matrícula já cadastrada.'
            });
        }

        // Criptografar senha
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Criar novo usuário
        const newUser = {
            id: generateId(),
            nomeCompleto: nomeCompleto.trim(),
            matricula: matricula.trim().toUpperCase(),
            email: email.trim().toLowerCase(),
            senha: hashedPassword,
            tipoUsuario,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso.',
            data: {
                id: newUser.id,
                nomeCompleto: newUser.nomeCompleto,
                email: newUser.email,
                matricula: newUser.matricula,
                tipoUsuario: newUser.tipoUsuario
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
};

/**
 * Autenticar usuário
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validações
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios.'
            });
        }

        // Buscar usuário
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                tipoUsuario: user.tipoUsuario
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso.',
            token,
            data: {
                id: user.id,
                nomeCompleto: user.nomeCompleto,
                email: user.email,
                matricula: user.matricula,
                tipoUsuario: user.tipoUsuario
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
};

/**
 * Solicitar redefinição de senha
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório.'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido.'
            });
        }

        // Buscar usuário
        const user = findUserByEmail(email);
        
        // Sempre retorna sucesso por segurança (não revelar se email existe)
        if (user) {
            // Gerar token de redefinição
            const resetToken = generateResetToken();
            const expiresAt = Date.now() + RESET_TOKEN_EXPIRES_IN;

            // Remover tokens anteriores do usuário
            resetTokens = resetTokens.filter(token => token.userId !== user.id);

            // Adicionar novo token
            resetTokens.push({
                token: resetToken,
                userId: user.id,
                email: user.email,
                expiresAt,
                used: false
            });

            // Enviar email (em produção, configure corretamente)
            try {
                const resetLink = `http://localhost:3000/html/redefinir-senha.html?token=${resetToken}`;
                
                const mailOptions = {
                    from: process.env.EMAIL_USER || 'noreply@faltometro.com',
                    to: user.email,
                    subject: 'Faltômetro - Redefinição de Senha',
                    html: `
                        <h2>Redefinição de Senha - Faltômetro</h2>
                        <p>Olá, ${user.nomeCompleto}!</p>
                        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para prosseguir:</p>
                        <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
                        <p>Este link expira em 1 hora.</p>
                        <p>Se você não solicitou esta redefinição, ignore este email.</p>
                        <br>
                        <p>Equipe Faltômetro</p>
                    `
                };

                // Em desenvolvimento, vamos apenas logar o link
                console.log('\n🔗 LINK DE REDEFINIÇÃO DE SENHA:');
                console.log(resetLink);
                console.log('📧 Email seria enviado para:', user.email);
                
                // await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error('Erro ao enviar email:', emailError);
                // Continue sem falhar - em produção você pode querer tratar isso diferente
            }
        }

        res.json({
            success: true,
            message: 'Se o email estiver cadastrado, você receberá um link de recuperação.'
        });

    } catch (error) {
        console.error('Erro ao solicitar redefinição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
};

/**
 * Redefinir senha
 */
const resetPassword = async (req, res) => {
    try {
        const { token, novaSenha, confirmarSenha } = req.body;

        // Validações
        if (!token || !novaSenha || !confirmarSenha) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.'
            });
        }

        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({
                success: false,
                message: 'As senhas não coincidem.'
            });
        }

        if (!validatePassword(novaSenha)) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres.'
            });
        }

        // Buscar token
        const resetTokenData = resetTokens.find(t => t.token === token && !t.used);
        
        if (!resetTokenData) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou já utilizado.'
            });
        }

        // Verificar expiração
        if (Date.now() > resetTokenData.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Token expirado. Solicite um novo link de redefinição.'
            });
        }

        // Buscar usuário
        const user = users.find(u => u.id === resetTokenData.userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Usuário não encontrado.'
            });
        }

        // Criptografar nova senha
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);

        // Atualizar senha do usuário
        user.senha = hashedPassword;
        user.updatedAt = new Date().toISOString();

        // Marcar token como usado
        resetTokenData.used = true;

        res.json({
            success: true,
            message: 'Senha redefinida com sucesso.'
        });

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
};

/**
 * Verificar token JWT
 */
const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido.'
            });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido.'
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                nomeCompleto: user.nomeCompleto,
                email: user.email,
                matricula: user.matricula,
                tipoUsuario: user.tipoUsuario
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

/**
 * Logout
 */
const logout = async (req, res) => {
    // Em uma implementação real, você adicionaria o token a uma blacklist
    res.json({
        success: true,
        message: 'Logout realizado com sucesso.'
    });
};

/**
 * Obter perfil do usuário
 */
const getProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido.'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado.'
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                nomeCompleto: user.nomeCompleto,
                email: user.email,
                matricula: user.matricula,
                tipoUsuario: user.tipoUsuario,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

// Função para debug (apenas desenvolvimento)
const getUsers = () => {
    return users;
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    verifyToken,
    logout,
    getProfile,
    getUsers
};
