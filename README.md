# 🎯 FALTÔMETRO

**O site que te livra da reprovação**

Sistema web para controle de faltas escolares desenvolvido com HTML, CSS, JavaScript e Node.js + Express.js.

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm

### Instalação
1. Navegue até a pasta do projeto:
   ```bash
   cd faltometro
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

### Para Desenvolvimento
Use o comando com nodemon para reinicialização automática:
```bash
npm run dev
```

## 📱 Funcionalidades Implementadas

### ✅ Telas Desenvolvidas
- **Login** (`/`) - Tela inicial com autenticação
- **Cadastro** (`/html/cadastro.html`) - Registro de novos usuários
- **Redefinição de Senha** (`/html/redefinir-senha.html`) - Recuperação de conta

### 🔧 APIs Disponíveis
- `POST /api/auth/login` - Autenticação de usuário
- `POST /api/auth/register` - Cadastro de novo usuário
- `POST /api/auth/forgot-password` - Solicitação de redefinição de senha
- `POST /api/auth/reset-password` - Redefinição de senha com token
- `POST /api/auth/verify-token` - Verificação de token JWT
- `GET /api/auth/profile` - Obter perfil do usuário autenticado
- `POST /api/auth/logout` - Logout do usuário

## 🎨 Design

O projeto segue fielmente os protótipos fornecidos com:

### Cores
- **Fundo**: `#FFFBF6` (branco-creme suave)
- **Texto**: `#000000` (preto)
- **Campos/Botões**: `#FFFFFF` (branco)
- **Placeholder**: `#AAAAAA` (cinza claro)

### Tipografia
- **Fonte**: Poppins (Google Fonts)
- **Títulos**: 48px, bold
- **Texto**: 16px, normal

### Componentes
- Campos de input com bordas arredondadas (10px)
- Sombras suaves: `0px 4px 10px rgba(0, 0, 0, 0.1)`
- Radio buttons customizados (quadrados)
- Design responsivo

## 🔒 Segurança Implementada

- **Criptografia de senhas** com bcryptjs (salt rounds: 12)
- **Rate limiting** para prevenir ataques de força bruta
- **Validação** rigorosa de dados de entrada
- **JWT tokens** para autenticação
- **Helmet.js** para headers de segurança
- **CORS** configurado

## 📋 Validações

### Cadastro
- Nome completo (mínimo nome + sobrenome)
- Matrícula única (alfanumérica, 3+ caracteres)
- Email válido e único
- Senha mínima de 6 caracteres
- Tipo de usuário (Aluno/Professor)

### Login
- Email válido
- Senha mínima de 6 caracteres

### Redefinição de Senha
- Email válido
- Token válido e não expirado
- Senhas coincidentes
- Senha mínima de 6 caracteres

## 📁 Estrutura do Projeto

```
faltometro/
├── public/                # Front-end
│   ├── css/
│   │   └── style.css      # Estilos principais
│   ├── js/
│   │   ├── login.js       # Lógica da tela de login
│   │   ├── cadastro.js    # Lógica da tela de cadastro
│   │   └── redefinir-senha.js # Lógica de redefinição
│   └── html/
│       ├── index.html     # Tela de login
│       ├── cadastro.html  # Tela de cadastro
│       └── redefinir-senha.html # Tela de redefinição
├── src/                   # Back-end
│   ├── controllers/
│   │   └── authController.js # Lógica de autenticação
│   ├── routes/
│   │   └── authRoutes.js     # Rotas da API
│   └── server.js            # Servidor principal
├── package.json
└── README.md
```

## 🧪 Testando o Sistema

### 1. Cadastro
1. Acesse `/html/cadastro.html`
2. Preencha todos os campos
3. Selecione Aluno ou Professor
4. Clique em "Cadastrar"

### 2. Login
1. Acesse `/` 
2. Use email e senha cadastrados
3. Clique em "Login"

### 3. Redefinição de Senha
1. Na tela de login, clique "Esqueceu a senha?"
2. Digite seu email
3. Clique "Enviar"
4. O link será exibido no console do servidor
5. Acesse o link e defina nova senha

## 🔄 Banco de Dados

Atualmente utiliza armazenamento em memória para demonstração. Para produção, integre com:
- PostgreSQL
- MySQL
- MongoDB
- SQLite

## 📧 Configuração de Email

Para funcionalidade completa de redefinição de senha, configure as variáveis:

```bash
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

## 🚦 Status do Projeto

- ✅ Interface pixel-perfect conforme protótipos
- ✅ Todas as telas funcionais
- ✅ API completa de autenticação
- ✅ Validações rigorosas
- ✅ Segurança implementada
- ✅ Design responsivo
- 🔄 Pronto para integração com banco de dados real
- 🔄 Pronto para configuração de email em produção

---

**Desenvolvido seguindo as especificações técnicas fornecidas**
