// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const step1Container = document.getElementById('step1Container');
    const step2Container = document.getElementById('step2Container');
    const messageArea = document.getElementById('messageArea');
    
    // Verificar se há token na URL (para passo 2)
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    // Se há token, mostrar passo 2, senão mostrar passo 1
    if (resetToken) {
        step1Container.style.display = 'none';
        step2Container.style.display = 'block';
        showMessage('Digite sua nova senha abaixo.', 'info');
    }
    
    // Função para exibir mensagens
    function showMessage(message, type = 'info') {
        messageArea.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Remover mensagem após 8 segundos para mensagens de sucesso
        const timeout = type === 'success' ? 8000 : 5000;
        setTimeout(() => {
            messageArea.innerHTML = '';
        }, timeout);
    }
    
    // Função para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para validar senha
    function isValidPassword(password) {
        return password && password.length >= 6;
    }
    
    // PASSO 1: Solicitar redefinição de senha
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('emailRecuperacao').value;
            
            // Validar email
            if (!email.trim()) {
                showMessage('Por favor, insira seu email.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }
            
            try {
                showMessage('Enviando solicitação...', 'info');
                
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showMessage('Se o email estiver cadastrado, você receberá um link de recuperação em breve. Verifique sua caixa de entrada e spam.', 'success');
                    // Limpar campo
                    document.getElementById('emailRecuperacao').value = '';
                } else {
                    showMessage(data.message || 'Erro ao enviar solicitação. Tente novamente.', 'error');
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
            }
        });
    }
    
    // PASSO 2: Redefinir senha
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            // Validações
            if (!novaSenha.trim()) {
                showMessage('Por favor, insira a nova senha.', 'error');
                return;
            }
            
            if (!isValidPassword(novaSenha)) {
                showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }
            
            if (!confirmarSenha.trim()) {
                showMessage('Por favor, confirme a nova senha.', 'error');
                return;
            }
            
            if (novaSenha !== confirmarSenha) {
                showMessage('As senhas não coincidem. Verifique e tente novamente.', 'error');
                return;
            }
            
            if (!resetToken) {
                showMessage('Token de redefinição inválido. Solicite um novo link de recuperação.', 'error');
                return;
            }
            
            try {
                showMessage('Redefinindo senha...', 'info');
                
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        token: resetToken,
                        novaSenha: novaSenha,
                        confirmarSenha: confirmarSenha
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    showMessage('Senha redefinida com sucesso! Redirecionando para o login...', 'success');
                    
                    // Limpar campos
                    resetPasswordForm.reset();
                    
                    // Redirecionar para login após 3 segundos
                    setTimeout(() => {
                        window.location.href = '/html/index.html';
                    }, 3000);
                    
                } else {
                    if (response.status === 400) {
                        showMessage('Link de redefinição expirado ou inválido. Solicite um novo link.', 'error');
                    } else {
                        showMessage(data.message || 'Erro ao redefinir senha. Tente novamente.', 'error');
                    }
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
            }
        });
    }
    
    // Limpar mensagens quando o usuário começar a digitar
    const inputs = ['emailRecuperacao', 'novaSenha', 'confirmarSenha'];
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', function() {
                if (messageArea.innerHTML) {
                    messageArea.innerHTML = '';
                }
            });
        }
    });
    
    // Validação em tempo real para confirmação de senha
    const novaSenhaInput = document.getElementById('novaSenha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    
    if (novaSenhaInput && confirmarSenhaInput) {
        function checkPasswordMatch() {
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
            
            if (confirmarSenha && novaSenha !== confirmarSenha) {
                confirmarSenhaInput.style.borderColor = '#ff6b6b';
                confirmarSenhaInput.style.borderWidth = '2px';
                confirmarSenhaInput.style.borderStyle = 'solid';
            } else {
                confirmarSenhaInput.style.border = 'none';
            }
        }
        
        novaSenhaInput.addEventListener('input', checkPasswordMatch);
        confirmarSenhaInput.addEventListener('input', checkPasswordMatch);
    }
    
    // Função de demonstração - simular recebimento de link por email
    // (Esta função seria chamada quando o usuário clicar em um link do email)
    window.simulateEmailLink = function() {
        // Gerar um token fictício para demonstração
        const demoToken = 'demo_token_' + Date.now();
        
        // Redirecionar com token
        window.location.href = `/html/redefinir-senha.html?token=${demoToken}`;
    };
});
