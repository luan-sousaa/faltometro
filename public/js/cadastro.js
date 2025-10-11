// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
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
    
    // Função para validar matrícula (apenas números e letras)
    function isValidMatricula(matricula) {
        const matriculaRegex = /^[A-Za-z0-9]+$/;
        return matriculaRegex.test(matricula) && matricula.length >= 3;
    }
    
    // Função para validar nome (pelo menos nome e sobrenome)
    function isValidName(nome) {
        const trimmedName = nome.trim();
        const words = trimmedName.split(' ').filter(word => word.length > 0);
        return words.length >= 2 && trimmedName.length >= 3;
    }
    
    // Função para validar formulário
    function validateForm(formData) {
        const { nomeCompleto, matricula, email, senha, tipoUsuario } = formData;
        
        // Validar nome completo
        if (!nomeCompleto.trim()) {
            showMessage('Por favor, insira seu nome completo.', 'error');
            return false;
        }
        
        if (!isValidName(nomeCompleto)) {
            showMessage('Por favor, insira seu nome e sobrenome completos.', 'error');
            return false;
        }
        
        // Validar matrícula
        if (!matricula.trim()) {
            showMessage('Por favor, insira sua matrícula.', 'error');
            return false;
        }
        
        if (!isValidMatricula(matricula)) {
            showMessage('A matrícula deve conter apenas letras e números, com pelo menos 3 caracteres.', 'error');
            return false;
        }
        
        // Validar email
        if (!email.trim()) {
            showMessage('Por favor, insira seu email institucional.', 'error');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Por favor, insira um email válido.', 'error');
            return false;
        }
        
        // Validar senha
        if (!senha.trim()) {
            showMessage('Por favor, insira uma senha.', 'error');
            return false;
        }
        
        if (senha.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return false;
        }
        
        // Validar tipo de usuário
        if (!tipoUsuario) {
            showMessage('Por favor, selecione se você é Aluno ou Professor.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Função para realizar cadastro
    async function performCadastro(formData) {
        try {
            showMessage('Realizando cadastro...', 'info');
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showMessage('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
                
                // Limpar formulário
                cadastroForm.reset();
                
                // Redirecionar para login após 1 segundos
                setTimeout(() => {
                    window.location.href = '/html/index.html';
                }, 1000);
                
            } else {
                // Tratar diferentes tipos de erro
                if (response.status === 409) {
                    showMessage('Email ou matrícula já cadastrados. Tente fazer login ou use dados diferentes.', 'error');
                } else {
                    showMessage(data.message || 'Erro ao realizar cadastro. Tente novamente.', 'error');
                }
            }
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
        }
    }
    
    // Event listener para o formulário
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = {
            nomeCompleto: document.getElementById('nomeCompleto').value,
            matricula: document.getElementById('matricula').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            tipoUsuario: document.querySelector('input[name="tipoUsuario"]:checked')?.value
        };
        
        // Validar e enviar
        if (validateForm(formData)) {
            performCadastro(formData);
        }
    });
    
    // Limpar mensagens quando o usuário começar a digitar
    const inputs = ['nomeCompleto', 'matricula', 'email', 'senha'];
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function() {
            if (messageArea.innerHTML) {
                messageArea.innerHTML = '';
            }
        });
    });
    
    // Limpar mensagens quando selecionar tipo de usuário
    document.querySelectorAll('input[name="tipoUsuario"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (messageArea.innerHTML) {
                messageArea.innerHTML = '';
            }
        });
    });
    
    // Formatação automática da matrícula (apenas números e letras)
    document.getElementById('matricula').addEventListener('input', function(e) {
        let value = e.target.value;
        // Remover caracteres especiais, manter apenas letras e números
        value = value.replace(/[^A-Za-z0-9]/g, '');
        // Converter para maiúsculas
        value = value.toUpperCase();
        e.target.value = value;
    });
    
    // Formatação automática do nome (primeira letra maiúscula)
    document.getElementById('nomeCompleto').addEventListener('blur', function(e) {
        let value = e.target.value;
        // Capitalizar primeira letra de cada palavra
        value = value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        e.target.value = value;
    });
});
