describe('Teste de Cadastro - Faltômetro', () => {
  it('Deve cadastrar um novo usuário aluno com sucesso', () => {
    //  Visita a página de cadastro
    cy.visit('http://localhost:3000/html/cadastro.html');


    //  Preenche os campos do formulário
    cy.get('#nomeCompleto').type('Aluno Teste');
    cy.get('#matricula').type('ABC321');


    // email 
    const randomEmail = `aluno${Date.now()}@teste.com`;
    cy.get('#email').type(randomEmail);


    cy.get('#senha').type('654321');


    //  Seleciona o tipo de usuário
    cy.get('#aluno').check();


    //  Clica no botão de cadastro
    cy.get('button[type="submit"]').click();


    // Verifica se a mensagem de sucesso apareceu
    cy.get('#messageArea', { timeout: 5000 })
      .should('contain.text', 'Cadastro realizado com sucesso!');


    // aAguarda redirecionamento para login
    cy.url({ timeout: 5000 }).should('include', '/html/index.html');
  });
});



