// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageArea = document.getElementById('messageArea');
    
    // Função para exibir mensagens
    function showMessage(message, type = 'info') {
        messageArea.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            messageArea.innerHTML = '';
        }, 5000);
    }
    
    // Função para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para validar formulário
    function validateForm(formData) {
        const { email, password } = formData;
        
        if (!email.trim()) {
            showMessage('Por favor, insira seu email.', 'error');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Por favor, insira um email válido.', 'error');
            return false;
        }
        
        if (!password.trim()) {
            showMessage('Por favor, insira sua senha.', 'error');
            return false;
        }
        
        if (password.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Função para fazer login
    async function performLogin(formData) {
        try {
            showMessage('Realizando login...', 'info');
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Salvar token no localStorage (se fornecido)
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                
                // Redirecionar após 1 segundos (aqui você redirecionaria para o dashboard)
                setTimeout(() => {
                    window.location.href = '/html/aluno.html'; // Tela de aluno com o quadro de faltas
                }, 1000);
                
            } else {
                showMessage(data.message || 'Erro ao realizar login. Verifique suas credenciais.', 'error');
            }
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
        }
    }
    
    // Event listener para o formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        
        // Validar e enviar
        if (validateForm(formData)) {
            performLogin(formData);
        }
    });
    
    // Limpar mensagens quando o usuário começar a digitar
    document.getElementById('email').addEventListener('input', function() {
        if (messageArea.innerHTML) {
            messageArea.innerHTML = '';
        }
    });
    
    document.getElementById('password').addEventListener('input', function() {
        if (messageArea.innerHTML) {
            messageArea.innerHTML = '';
        }
    });
    
    // Verificar se há token salvo e mostrar mensagem apropriada
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        showMessage('Você já está logado! Faça logout antes de fazer login novamente.', 'info');
    }
});
