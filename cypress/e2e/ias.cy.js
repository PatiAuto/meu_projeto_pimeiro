/// <reference types="cypress" />

describe('Entrar na página de login', () => {

  beforeEach(() => {
    cy.intercept('GET', '**linkedin.com/**', { statusCode: 200, body: {} });
    cy.intercept('GET', '**dynamizecdn.com/**', { statusCode: 200, body: {} });
    cy.intercept('GET', '**facebook.com/**', { statusCode: 200, body: {} });
    cy.intercept('GET', '**analytics.google.com/**', { statusCode: 200, body: {} });


    cy.visit('https://acessohom.institutoayrtonsenna.org.br/auth/realms/ias/protocol/openid-connect/auth?client_id=bncc&redirect_uri=https%3A%2F%2Fdevplataformafarol.institutoayrtonsenna.org.br%2Fdashboard&state=58b3e694-e4f7-4a54-8328-188821d3da5a&response_mode=fragment&response_type=code&scope=openid&nonce=fba3c315-f065-42b1-b9b2-89ffa57464cf');
  });

  //1 cadastro estudante unico

  it('cadastra estudante único', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
      return `${dia}/${mes}/${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    // Login
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin(
      'https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeEstudante, dataNascimento } },
      ({ nomeEstudante, dataNascimento }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(2000);
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
          .wait(1000)
          .click();
        cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
          .should('be.visible')
          .trigger('mouseover')
          .trigger('mouseup');
        cy.contains('li.MuiButtonBase-root', 'Cadastro único')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('input[placeholder="Selecione uma regional"]')
          .click();
        cy.get('[role="combobox"] div')
          .wait(1000);
        cy.get('#regional-option-0')
          .first()
          .click();
        cy.get('input[placeholder="Selecione uma ou mais escolas"]')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click();
        cy.get('#classRooms')
          .click();
        cy.get('#classRooms-option-0')
          .click();
        cy.get('input[placeholder="Selecione a situação do ano anterior"]')
          .click();
        cy.contains('Aprovado')
          .click();
        cy.get('input[placeholder="Selecione o ano/série de origem"]')
          .click();
        cy.contains('3º - Ano (Ensino Fundamental)')
          .click();
        cy.get('input[placeholder="Nome completo do estudante"]')
          .click()
          .type(nomeEstudante)
          .should('be.visible');
        cy.get('input[placeholder="DD/MM/AAAA"]')
          .click()
          .type(dataNascimento)
          .should('be.visible');
        cy.get('#gender')
          .click();
        cy.contains('Feminino')
          .click();
        cy.get('.MuiGrid-root > .MuiButton-contained')
          .should('be.visible')
          .click()
          .wait(5000);
        cy.get('div[class="MuiSnackbarContent-message"]')
          .contains('Cadastro concluído!')
          .should('be.visible');
        cy.get('li[class="MuiBreadcrumbs-li"]')
          .contains('Estudantes')
          .should('be.visible');
        cy.get('input[placeholder="Nome ou código"]')
          .click()
        cy.get('td[class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1rm6ur4"]')
          .contains(nomeEstudante)
          .should('be.visible');
      });
  });

  //1.1 cadastro estudante unico exceção - número presente no nome

  it('cadastro estudante único com erro no nome contendo numeral', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Carla'];
      const sobrenomes = ['1', '2'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      // getMonth() começa em 0, então adicionamos 1. padStart garante 2 dígitos (ex: 05)
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      return `${dia}-${mes}-${ano}`; // Ex: "2023-10-27"
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    // Login
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin(
      'https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeEstudante, dataNascimento } },
      ({ nomeEstudante, dataNascimento }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(2000);
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
          .wait(1000)
          .click();
        cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
          .should('be.visible')
          .trigger('mouseover')
          .trigger('mouseup');
        cy.contains('li.MuiButtonBase-root', 'Cadastro único')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('input[placeholder="Selecione uma regional"]')
          .click();
        cy.get('[role="combobox"] div')
          .wait(1000);
        cy.get('#regional-option-0')
          .first()
          .click();
        cy.get('input[placeholder="Selecione uma ou mais escolas"]')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click();
        cy.get('#classRooms')
          .click();
        cy.get('#classRooms-option-0')
          .click();
        cy.get('input[placeholder="Selecione a situação do ano anterior"]')
          .click();
        cy.contains('Aprovado')
          .click();
        cy.get('input[placeholder="Selecione o ano/série de origem"]')
          .click();
        cy.contains('9º - Ano (Ensino Fundamental)')
          .click()
        cy.get('input[placeholder="Nome completo do estudante"]')
          .click()
          .type(nomeEstudante)
          .should('be.visible');
        cy.get('input[placeholder="DD/MM/AAAA"]')
          .click()
          .type(dataNascimento)
          .should('be.visible');
        cy.get('#gender')
          .click();
        cy.contains('Feminino')
          .click();
        cy.get('.MuiGrid-root > .MuiButton-contained')
          .should('be.visible')
          .click()
        cy.get('#name-helper-text')
          .contains('Nome do estudante inválido. O nome deve conter apenas letras e não pode conter números, ou caracteres especiais, como espaço, @, _, ou -.')
          .should('be.visible')
      });
  });

  //1.2 cadastro estudante unico exceção - data de nascimento inválida, dia atual

  it('cadastra estudante único com erro na data nasc. dia atual', () => {
    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carina', 'Daniela', 'Eduardo'];
      const sobrenomes = ['Santos', 'Dumont', 'Santana', 'Silva', 'Duarte'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const amanha = new Date();
      // Adiciona 1 ao dia atual
      amanha.setDate(amanha.getDate() + 1);
      const ano = amanha.getFullYear();
      // getMonth() começa em 0, padStart garante 2 dígitos
      const dia = String(amanha.getDate()).padStart(2, '0');
      const mes = String(amanha.getMonth() + 1).padStart(2, '0');
      return `${dia}-${mes}-${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    // Login
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin(
      'https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeEstudante, dataNascimento } },
      ({ nomeEstudante, dataNascimento }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(2000);
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
          .wait(1000)
          .click();
        cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
          .should('be.visible')
          .trigger('mouseover')
          .trigger('mouseup');
        cy.contains('li.MuiButtonBase-root', 'Cadastro único')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('input[placeholder="Selecione uma regional"]')
          .click();
        cy.get('[role="combobox"] div')
          .wait(1000);
        cy.get('#regional-option-0')
          .first()
          .click();
        cy.get('input[placeholder="Selecione uma ou mais escolas"]')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click();
        cy.get('#classRooms')
          .click();
        cy.get('#classRooms-option-0')
          .click();
        cy.get('input[placeholder="Selecione a situação do ano anterior"]')
          .click();
        cy.contains('Aprovado')
          .click();
        cy.get('input[placeholder="Selecione o ano/série de origem"]')
          .click();
        cy.contains('3º - Ano (Ensino Fundamental)')
          .click()
        cy.get('input[placeholder="Nome completo do estudante"]')
          .click()
          .type(nomeEstudante)
          .should('be.visible');
        cy.get('input[placeholder="DD/MM/AAAA"]')
          .click()
          .type(dataNascimento)
          .should('be.visible');
        cy.get('#gender')
          .click();
        cy.contains('Feminino')
          .click();
        cy.get('.MuiGrid-root > .MuiButton-contained')
          .should('be.visible')
          .click()
        cy.get('#name-helper-text')
          .contains('Nome do estudante inválido. O nome deve conter apenas letras e não pode conter números, ou caracteres especiais, como espaço, @, _, ou -.')
          .should('be.visible') //esta com erro, mudar a mensagem depois da correção
      });
  });

  //1.3 cadastro estudante unico ano/série divergente

  it('cadastro estudante unico exceção - ano/série divergente ', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
      return `${dia}/${mes}/${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    // Login
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin(
      'https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeEstudante, dataNascimento } },
      ({ nomeEstudante, dataNascimento }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(2000);
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
          .wait(1000)
          .click();
        cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
          .should('be.visible')
          .trigger('mouseover')
          .trigger('mouseup');
        cy.contains('li.MuiButtonBase-root', 'Cadastro único')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('input[placeholder="Selecione uma regional"]')
          .click();
        cy.get('[role="combobox"] div')
          .wait(1000);
        cy.get('#regional-option-0')
          .first()
          .click();
        cy.get('input[placeholder="Selecione uma ou mais escolas"]')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click();
        cy.get('#classRooms')
          .click();
        cy.get('#classRooms-option-0')
          .click();
        cy.get('input[placeholder="Selecione a situação do ano anterior"]')
          .click();
        cy.contains('Aprovado')
          .click();
        cy.get('input[placeholder="Selecione o ano/série de origem"]')
          .click();
        cy.contains('9º - Ano (Ensino Fundamental)')
          .click()
        cy.get('input[placeholder="Nome completo do estudante"]')
          .click()
          .type(nomeEstudante)
          .should('be.visible');
        cy.get('input[placeholder="DD/MM/AAAA"]')
          .click()
          .type(dataNascimento)
          .should('be.visible');
        cy.get('#gender')
          .click();
        cy.contains('Feminino')
          .click();
        cy.get('.MuiGrid-root > .MuiButton-contained')
          .should('be.visible')
          .click()
        cy.get('.MuiSnackbarContent-message')
          .contains('Ano/Série inválido. Verifique se o Ano/série inserido corresponde à turma do estudante.')
          .should('be.visible')
      });
  });

  //1.4 cadastro estudante unico exceção campos obrigatorios
  it('cadastro estudante unico exceção campos obrigatorios ', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
      return `${dia}/${mes}/${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
      //{ args: { nomeEstudante, dataNascimento} }
      //({ nomeEstudante, dataNascimento     }) => {
      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
        .should('be.visible')
        .wait(2000);
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
        .wait(1000)
        .click();
      cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
        .should('be.visible')
        .trigger('mouseover')
        .trigger('mouseup');
      cy.contains('li.MuiButtonBase-root', 'Cadastro único')
        .trigger('mouseover')
        .trigger('mouseup')
        .trigger("click");
      cy.get('.MuiGrid-root > .MuiButton-contained')
        .should('be.visible')
        .click()
      cy.get('#regional-helper-text')
        .contains('Selecione uma regional')
        .should('be.visible');
      cy.get('#previousYearSituation-helper-text')
        .contains('Selecione a situação no ano anterior do estudante')
        .should('be.visible');
      cy.get('#grade-helper-text')
        .contains('Ano/Série escolar de origem não selecionado. Escolha ano/série para continuar.')
        .should('be.visible');
      cy.get('#name-helper-text')
        .contains('Campo obrigatório não preenchido. Preencha o nome do estudante para continuar.')
        .should('be.visible');
      cy.get('#birthDay-helper-text')
        .contains('Campo obrigatório não preenchido. Preencha a data para continuar.')
        .should('be.visible');
    });
  });

  //1.5 edita estudante unico exceção campos obrigatorios

  it('edita estudante unico exceção campos obrigatorios ', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
      return `${dia}/${mes}/${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
      //{ args: { nomeEstudante, dataNascimento} }
      //({ nomeEstudante, dataNascimento     }) => {
      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
        .should('be.visible')
        .wait(2000);
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
        .wait(1000)
        .click();
      cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
        .trigger('mouseover')
        .trigger('mouseup')
        .trigger("click")
      cy.get(':nth-child(1) > .css-c8cc8o > [style="display: flex; justify-content: center;"] > :nth-child(1) > .MuiIconButton-label > .MuiGrid-root > img')
        .should('be.visible')
        .click({ force: true })
      cy.get('#name')
        .clear()
      cy.get(':nth-child(2) > :nth-child(2) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
        .click()
      cy.get('#classRooms')
        .click()
      cy.get('#regional')
        .clear()
      cy.get('#name')
        .click()
      cy.get('#regional-helper-text')
        .contains('Selecione uma regional')
        .should('be.visible');
      cy.get('p[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
        .contains('Escolha uma ou mais escolas')
        .should('be.visible');
      cy.get('#name-helper-text')
        .contains('Campo obrigatório não preenchido. Preencha o nome do estudante para continuar.')
        .should('be.visible')
      cy.contains('button', 'Confirmar edição').should('be.visible')
        .should('be.disabled')
    });
  });

  //1.6 edita estudante unico

  it('edita estudante unico', () => {

    // Funções utilitárias
    function gerarNomeComposto() {
      const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarDataNascimento() {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
      return `${dia}/${mes}/${ano}`;
    }
    const nomeEstudante = gerarNomeComposto();
    const dataNascimento = gerarDataNascimento();
    cy.wrap(nomeEstudante).as('nomeEstudante');

    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
      //{ args: { nomeEstudante, dataNascimento} }
      //({ nomeEstudante, dataNascimento     }) => {
      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
        .should('be.visible')
        .wait(2000);
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
        .wait(1000)
        .click();
      cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
        .trigger('mouseover')
        .trigger('mouseup')
        .trigger("click")
      cy.get(':nth-child(1) > .css-c8cc8o > [style="display: flex; justify-content: center;"] > :nth-child(1) > .MuiIconButton-label > .MuiGrid-root > img')
        .should('be.visible')
        .click({ force: true })
      cy.get('#classRooms')
        .click()
        .clear()
      cy.get('#classRooms-option-1')
        .click()
      cy.get('#name')
        .clear()
        .click()
        .type('Estudante editado')
        .should('be.visible');
      cy.get('.MuiGrid-root > .MuiButton-contained > .MuiButton-label')
        .click()
      cy.get('.MuiGrid-root > .MuiDialogContent-root')
        .contains('Atenção!')
      cy.get('.MuiGrid-root > .MuiDialogContent-root')
        .contains('Declaro e me responsabilizo pela declaração, de que tenho autorização para realizar a edição dos dados e alterá-los. Declaro também, que os dados foram e sempre serão obtidos de forma legitima e me responsabilizo pela transcrição corretas deles nessa plataforma, comprometendo-me a mantê-los sempre atualizados.')
      cy.get('.MuiButton-label')
        .contains('Salvar Edição')
        .click()
      cy.get('.MuiSnackbarContent-message')
        .contains('Edição realizada com sucesso!')
      cy.get(':nth-child(1) > .MuiTypography-root')
        .contains('Estudantes')
      cy.get('.MuiGrid-item.MuiGrid-justify-content-xs-center > :nth-child(1) > .MuiPaper-root')
        .contains('Estudante editado')
    });
  });

  it.only('cadastra estudante em lote', () => {

    //// Funções utilitárias
    //function gerarNomeComposto() {
    //  const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
    //  const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
    //  const nome = nomes[Math.floor(Math.random() * nomes.length)];
    //  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    //  return `${nome} ${sobrenome}`;
    //}
    //function gerarDataNascimento() {
    //  const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    //  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    //  const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
    //  return `${dia}/${mes}/${ano}`;
    //}
    // const nomeEstudante = gerarNomeComposto();
    // const dataNascimento = gerarDataNascimento();
    // cy.wrap(nomeEstudante).as('nomeEstudante');

    // Login
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    // Fluxo na origem diferente
    cy.origin(
      'https://devplataformafarol.institutoayrtonsenna.org.br', () => {

        function gerarNomeComposto() {
          const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'];
          const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
          const nome = nomes[Math.floor(Math.random() * nomes.length)];
          const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
          return `${nome} ${sobrenome}`;
        }

        function gerarDataNascimento() {
          const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
          const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
          const ano = Math.floor(Math.random() * (2008 - 1995 + 1) + 1995);
          return `${dia}/${mes}/${ano}`;
        }

        cy.get('.MuiTypography-root.MuiTypography-body1')
          .should('be.visible')
          .wait(2000);
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root')
          .wait(1000)
          .click();
        cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
          .should('be.visible')
          .trigger('mouseover')
          .trigger('mouseup');
        cy.contains('li.MuiButtonBase-root', 'Cadastro em lote')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('span[class="MuiButton-label"]')
          .contains('Novo Cadastro')
          .click();
        cy.get(':nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click();
        cy.get('ul[class="MuiAutocomplete-listbox"]')
          .contains('Regional Farol 156A')
          .click();
        cy.get(':nth-child(2) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click();
        cy.contains('COLEGIO CELQ')
          .click();
        cy.get('span[class="MuiButton-label"]')
          .contains('INICIAR CADASTRO')
          .click();
        cy.get('td[data-x="1"][data-y="0"]')
          .click({ force: true })
          .type(gerarNomeComposto())
        cy.get('td[data-x="2"][data-y="0"]')
          .click({ force: true })
          .type(gerarDataNascimento())
        cy.get('td[data-x="3"][data-y="0"]')
          .click({ force: true })
          .type('Masculino')
        cy.contains('Masculino')
          .click({ force: true })
        cy.get('td[data-x="4"][data-y="0"]')
          .click({ force: true })
          .type('6º - Ano (Ensino Fundamental)')
        cy.contains('6º - Ano (Ensino Fundamental)')
          .click({ force: true })
        cy.get('td[data-x="5"][data-y="0"]')
          .click({ force: true })
        cy.focused().type(' ')
        cy.contains('Turma Automação 6 ano')
          .click({ force: true })
        cy.get('td[data-x="6"][data-y="0"]')
          .click({ force: true })
        cy.focused().type(' ')
        cy.contains('Aprovado')
          .click({ force: true })


        cy.get('td[data-x="1"][data-y="1"]')
          .click({ force: true })
          .type(gerarNomeComposto())
        cy.get('td[data-x="2"][data-y="1"]')
          .click({ force: true })
          .type(gerarDataNascimento())
        cy.get('td[data-x="3"][data-y="1"]').click({ force: true }).type('Masculino');
        // O .within garante que o Cypress só vai procurar o botão de clique dentro da célula correta
        cy.get('td[data-x="3"][data-y="1"]').within(() => {
          cy.contains('Masculino').click({ force: true });
        });
        cy.get('td[data-x="4"][data-y="1"]').click({ force: true }).type('6º - Ano (Ensino Fundamental)');
        cy.get('td[data-x="4"][data-y="1"]').within(() => {
          cy.contains('6º - Ano (Ensino Fundamental)').click({ force: true });
        });

        // COLUNA 5: Turma (Isolado na Linha 2)
        cy.get('td[data-x="5"][data-y="1"]').click({ force: true });
        cy.focused().type(' ');
        cy.get('td[data-x="5"][data-y="1"]').within(() => {
          cy.contains('Turma Automação 6 ano').click({ force: true });
        });

        // COLUNA 6: Situação (Isolado na Linha 2)
        cy.get('td[data-x="6"][data-y="1"]').click({ force: true });
        cy.focused().type(' ');
        cy.get('td[data-x="6"][data-y="1"]').within(() => {
          cy.contains('Aprovado').click({ force: true });
        });


        // cy.get(':nth-child(2) > .MuiGrid-root > .MuiButtonBase-root')
        //   .contains('SALVAR OS DADOS')
        //   .click()
        // cy.get('.MuiSnackbar-root > .MuiPaper-root')
        //   .contains('Histórico salvo com sucesso')
        //   .should('be.visible')
        //   .wait(5000);
        // cy.get('img[alt="refresh"]').click({ force: true })
        // cy.get('[index="0"] > [value="CONCLUIDO"] > .MuiBox-root')
        //   .should('be.visible')
        //












        // cy.contains('3º - Ano (Ensino Fundamental)')
        //   .click();
        // cy.get('input[placeholder="Nome completo do estudante"]')
        //   .click()
        //   .type(nomeEstudante)
        //   .should('be.visible');
        // cy.get('input[placeholder="DD/MM/AAAA"]')
        //   .click()
        //   .type(dataNascimento)
        //   .should('be.visible');
        // cy.get('#gender')
        //   .click();
        // cy.contains('Feminino')
        //   .click();
        // cy.get('.MuiGrid-root > .MuiButton-contained')
        //   .should('be.visible')
        //   .click()
        //   .wait(5000);
        // cy.get('div[class="MuiSnackbarContent-message"]')
        //   .contains('Cadastro concluído!')
        //   .should('be.visible');
        // cy.get('li[class="MuiBreadcrumbs-li"]')
        //   .contains('Estudantes')
        //   .should('be.visible');
        // cy.get('input[placeholder="Nome ou código"]')
        //   .click()
        // cy.get('td[class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1rm6ur4"]')
        //   .contains(nomeEstudante)
        //   .should('be.visible');
      });
  });


  //2 cadastra regional

  it('cadastra regional', () => {
    cy.get('input[id="user-input"]')
      .should('be.visible')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
        .click();
      cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiTypography-root')
        .should('have.text', 'Regionais e escola')
        .click({ force: true });
      cy.get('.MuiList-root > :nth-child(1) > .MuiButtonBase-root')
        .click();
      cy.get('.MuiButton-label > .MuiTypography-root')
        .click();
      cy.get('#name')
        .should('be.visible')
        .click()
        .type('Teste Automacao 3')
        .should('have.value', 'Teste Automacao 3')
      //cy.get('#number') está com bug no sistema
      //.should('be.visible')
      cy.get('input[placeholder="Selecione o estado"]')
        .type('Ceará')
      cy.contains('li', 'Ceará')
        .click()
      cy.get('input[placeholder="Selecione o município"]')
        .type('Acopiara')
      cy.contains('li', 'Acopiara')
        .click()
      cy.get('input[placeholder="Selecione o tipo de escola"]')
        .type('Não se aplica')
      cy.contains('li', 'Não se aplica')
        .click()
      cy.get('div[class="MuiInputBase-root MuiOutlinedInput-root MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd"]')
        .eq(1)
        .click({ force: true })
        .type('{uparrow}-{enter}')
      cy.get('input[class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"]')
        .eq(2)
      cy.get('[role="listbox"] li')
        .first()
        .click();
      cy.get('.MuiGrid-justify-content-xs-flex-end > .MuiButtonBase-root > .MuiButton-label > span > .MuiTypography-root')
        .click({ force: true });
      cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiButton-label > span > .MuiTypography-root')
        .click({ force: true });
      cy.get('div[class="MuiSnackbarContent-message"]')
        .contains('Dados salvos com sucesso!')
        .should('be.visible')
        .contains('Dados salvos com sucesso!')
        .should('be.visible')
    });
  });

  //2.1 editar regional

  it('edita regional', () => {
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {

      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
        .should('be.visible')
        .wait(3000)
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
        .click();
      cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiTypography-root')
        .should('have.text', 'Regionais e escola')
        .click({ force: true })
      cy.get('.MuiList-root > :nth-child(1) > .MuiButtonBase-root')
        .click()
        .wait(3000)
      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
        .should('be.visible')
        .click();
      cy.get('#name')
        .clear()
        .click()
        .type('Teste Automacao editar')
        .should('have.value', 'Teste Automacao editar')
        .should('be.visible')
      cy.get('#state')
        .click()
        .first()
        .click()
      //  .type('Bahia')
      //cy.contains('li', 'Bahia')
      //  .click()
      //cy.get('input[placeholder="Selecione o município"]')
      //  .type('Abaré')
      //cy.contains('li', 'Abaré')
      //  .click()
      cy.get('input[placeholder="Selecione o tipo de escola"]')
        .type('Não se aplica')
      cy.contains('li', 'Não se aplica')
        .click()
      cy.get('div[class="MuiInputBase-root MuiOutlinedInput-root MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd"]')
        .eq(1)
        .click({ force: true })
        .type('{uparrow}-{enter}')
      cy.get('input[class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"]')
        .eq(2)
      cy.get('[role="listbox"] li')
        .first()
        .click()
      cy.get('.MuiGrid-justify-content-xs-flex-end > .MuiButtonBase-root > .MuiButton-label > span > .MuiTypography-root')
        .click()
      cy.get('.MuiGrid-grid-md-3 > :nth-child(2)')
        .contains('Teste Automacao editar')
      cy.get('.MuiGrid-spacing-xs-3 > :nth-child(3) > :nth-child(2)')
        .contains('Bahia')
      cy.get('.MuiGrid-spacing-xs-3 > :nth-child(4) > :nth-child(2)')
        .contains('Não se aplica')
      cy.get('.MuiTableCell-alignRight')
        .contains('Abaré') //esta com erro, sistema não atualiza o municipio
      cy.get('.jss318 > :nth-child(2) > .MuiButtonBase-root')
        .click()
    });
  });

  //2.2 editar regional exceção campos obrigatorios

  it('edita regional exceção campos obrigatorios', () => {
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {

      cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
        .should('be.visible')
        .wait(3000)
      cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
        .click();
      cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiTypography-root')
        .should('have.text', 'Regionais e escola')
        .click({ force: true })
      cy.get('.MuiList-root > :nth-child(1) > .MuiButtonBase-root')
        .click()
        .wait(3000)
      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
        .should('be.visible')
        .click();
      cy.get('#name')
        .should('be.visible')
        .clear();
      cy.get('#state')
        .should('be.visible')
        .clear();
      cy.get('input[placeholder="Selecione o município"]')
        .should('be.visible')
        .clear();
      cy.get('#typeRegional')
        .should('be.visible')
        .clear();
      cy.get('.MuiGrid-grid-md-6 > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
        .should('be.visible')
        .click();
      cy.get('#name-helper-text')
        .contains('É necessário informar o nome da regional')
        .should('be.visible')
      cy.get('#state-helper-text')
        .contains('É necessário informar o estado')
        .should('be.visible')
      cy.get('#typeRegional-helper-text')
        .contains('É necessário informar o tipo de escola')
        .should('be.visible')
      cy.contains('Continuar')
        .should('be.disabled')
    });
  });

  //3 cadastra coordenador

  it('cadastra coordenador', () => {
    // Funções utilitárias
    function gerarNomeCoordenador() {
      const nomes = ['Jhonathan', 'Bruno', 'Charlie', 'Sonia', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailCoordenador(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome, sobrenome] = nomeCoordenador.split(' ');
      return `${nome}.${sobrenome}.${Date.now()}@${dominio}`
        .toLowerCase()
        .replace(/\s+/g, '');
    }
    const nomeCoordenador = gerarNomeCoordenador();
    cy.wrap(nomeCoordenador).as('nomeCoordenador');
    const email = gerarEmailCoordenador();
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeCoordenador, email } },
      ({ nomeCoordenador, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiTypography-root')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .click();
        cy.get('#name')
          .click({ force: true });
        cy.get('input[placeholder="Nome completo"]')
          .click()
          .type(nomeCoordenador)
          .should('be.visible');
        //cy.get('input[placeholder="000.000.000-00"]')
        //  .click()
        //  .type('139.768.114-10') //trocar sempre
        //  .should('be.visible');   
        cy.get('input[placeholder="Informe o e-mail"]')
          .click()
          .type(email)
          .should('be.visible');
        cy.get('input[placeholder="Selecione uma ou mais regionais"]')
          .click();
        cy.contains('Regional Farol 156A')
          .click();
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label')
          .click()
          .wait(1000);
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
          .contains('Coordenador salvo com sucesso! Um e-mail de confirmação foi enviado para ele(a).')
          .should('be.visible');
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Coordenador de Regional')
          .should('be.visible');
        cy.get('#name')
          .type(nomeCoordenador);
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiGrid-spacing-xs-2 > :nth-child(1) > .MuiGrid-root > :nth-child(1) > .MuiBox-root')
          .should('contain', (email));
      });
  });

  //3.1 cadastra coordenador unico campos obrigatorios

  it('cadastra coordenador exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeCoordenador() {
      const nomes = ['Jhonathan', 'Bruno', 'Charlie', 'Sonia', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailCoordenador(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome, sobrenome] = nomeCoordenador.split(' ');
      return `${nome}.${sobrenome}.${Date.now()}@${dominio}`
        .toLowerCase()
        .replace(/\s+/g, '');
    }
    const nomeCoordenador = gerarNomeCoordenador();
    cy.wrap(nomeCoordenador).as('nomeCoordenador');
    const email = gerarEmailCoordenador();
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeCoordenador, email } },
      ({ nomeCoordenador, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiTypography-root')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .click();
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
          .should('be.visible')
        cy.get('#email-helper-text')
          .contains('É necessário informar um e-mail válido')
          .should('be.visible')
        cy.get('p[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
          .contains('É necessário informar as regionais associadas')
          .should('be.visible')
      });
  });

  //3.2 editar coordenador unico exceção campos obrigatorios

  it('editar coordenador exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeCoordenador() {
      const nomes = ['Jhonathan', 'Bruno', 'Charlie', 'Sonia', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailCoordenador(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome, sobrenome] = nomeCoordenador.split(' ');
      return `${nome}.${sobrenome}.${Date.now()}@${dominio}`
        .toLowerCase()
        .replace(/\s+/g, '');
    }
    const nomeCoordenador = gerarNomeCoordenador();
    cy.wrap(nomeCoordenador).as('nomeCoordenador');
    const email = gerarEmailCoordenador();
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeCoordenador, email } },
      ({ nomeCoordenador, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiTypography-root')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
          .wait(2000)
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .jss271')
          .should('be.visible')
          .click()
        cy.get('form > :nth-child(1) > :nth-child(1) > .MuiTypography-root')
          .contains('Edição de Coordenador de Regional')
          .should('be.visible')
        cy.get('#name')
          .clear()
        cy.get('.MuiChip-root .MuiChip-deleteIcon')
          .click({ force: true });
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
        cy.contains('SALVAR EDIÇÃO')
          .should('be.disabled')
      });
  });

  //3.3 editar coordenador unico

  it('editar coordenador', () => {
    // Funções utilitárias
    function gerarNomeCoordenador() {
      const nomes = ['Jhonathan', 'Bruno', 'Charlie', 'Sonia', 'Eduardo', 'Fernanda'];
      const sobrenomes = ['Silva', 'Souza', 'Pereira', 'Costa', 'Oliveira', 'Santos'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailCoordenador(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome, sobrenome] = nomeCoordenador.split(' ');
      return `${nome}.${sobrenome}.${Date.now()}@${dominio}`
        .toLowerCase()
        .replace(/\s+/g, '');
    }
    const nomeCoordenador = gerarNomeCoordenador();
    cy.wrap(nomeCoordenador).as('nomeCoordenador');
    const email = gerarEmailCoordenador();
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com');
    cy.get('#password-input')
      .should('be.visible')
      .click()
      .type('123456')
      .should('have.value', '123456');
    cy.get('.bt-entrar')
      .should('be.visible')
      .click();
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeCoordenador, email } },
      ({ nomeCoordenador, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiTypography-root')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
          .wait(2000)
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root button')
          .click();
        cy.get('form > :nth-child(1) > :nth-child(1) > .MuiTypography-root')
          .contains('Edição de Coordenador de Regional')
          .should('be.visible')
        cy.get('#name')
          .clear()
          .type(nomeCoordenador)
          .should('be.visible');
        cy.get('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
        cy.get('[role="listbox"] li')
          .eq(2)
          .click();
        cy.get('#name')
          .click()
        cy.get('div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-2"]')
          .contains('SALVAR EDIÇÃO')
          .should('be.visible')
          .click();
        cy.get('.MuiGrid-root')
          .contains('Atenção!')
          .should('be.visible')
        cy.get('.MuiGrid-root')
          .contains('Declaro e me responsabilizo pela declaração, de que tenho autorização para realizar a edição dos dados e alterá-los. Declaro também, que os dados foram e sempre serão obtidos de forma legitima e me responsabilizo pela transcrição corretas deles nessa plataforma, comprometendo-me a mantê-los sempre atualizados.')
          .should('be.visible')
        cy.get('.MuiGrid-root > .MuiDialogActions-root')
          .contains('Salvar Edição')
          .should('be.visible')
          .click()
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
          .contains('Edição realizada com sucesso!')
          .should('be.visible')
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Coordenador de Regional')
          .should('be.visible');
        cy.get('#name')
          .type(nomeCoordenador)
          .should('be.visible')
          .click()
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
          .should('be.visible')
      });
  });

  //4 cadastra gestor escolar único

  it('cadastra gestor escolar único', () => {
    // Funções utilitárias
    function gerarNomeGestor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailGestor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeGestor = gerarNomeGestor();
    cy.wrap(nomeGestor).as('nomeGestor');
    const email = gerarEmailGestor(nomeGestor); // <-- agora passa o nome!
    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeGestor, email } },
      ({ nomeGestor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Gestores escolares')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar gestor escolar')
          .click()
        cy.get('#name')
          .click()
          .type(nomeGestor)
          .should('be.visible');
        //cy.get('#cpf')
        //  .click()
        //  .type('624.587.568-40')//trocar sempre
        //  .should('be.visible');  
        cy.get('#email')
          .click()
          .type(email)
          .should('be.visible');
        cy.get(':nth-child(7) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment')
          .click()
        cy.contains('Regional Farol 156A')
          .click()
          .wait(1000);
        cy.get(':nth-child(8) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click()
          .wait(1000);
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label')
          .click()
          .wait(3000);
        cy.get('.MuiSnackbarContent-message')
          .contains('Dados cadastrados com sucesso!')
          .should('be.visible');
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Gestores Escolares')
          .should('be.visible');
        cy.get('#name')
          .type(nomeGestor);
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiGrid-spacing-xs-2 > :nth-child(1) > .MuiGrid-root > :nth-child(1) > .MuiBox-root')
          .should('contain', (email));
      });
  });

  //4.1 cadastra gestor escolar único exceção campos obrigatorios

  it('cadastra gestor escolar único exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeGestor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailGestor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeGestor = gerarNomeGestor();
    cy.wrap(nomeGestor).as('nomeGestor');
    const email = gerarEmailGestor(nomeGestor); // <-- agora passa o nome!
    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeGestor, email } },
      ({ nomeGestor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Gestores escolares')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar gestor escolar')
          .click()
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label')
          .click()
          .wait(3000);
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
          .should('be.visible')
        cy.get('#email-helper-text')
          .contains('É necessário informar um e-mail válido')
          .should('be.visible')
        cy.get('P[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
          .contains('É necessário informar a regional')
          .should('be.visible')
        cy.get('P[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
          .contains('É necessário informar a escola')
          .should('be.visible')
      });
  });

  //4.2 edita gestor escolar único 

  it('edita gestor escolar único', () => {
    // Funções utilitárias
    function gerarNomeGestor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Maria', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailGestor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeGestor = gerarNomeGestor();
    cy.wrap(nomeGestor).as('nomeGestor');
    const email = gerarEmailGestor(nomeGestor); // <-- agora passa o nome!
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeGestor, email } },
      ({ nomeGestor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click()
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Gestores escolares')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root button')
          .click()
        cy.get('form > :nth-child(1) > :nth-child(2) > .MuiTypography-root')
          .contains('Edição de Gestor escolar')
          .should('be.visible')
        cy.get(':nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
        cy.get('[role="listbox"] li')
          .should('be.visible')
          .eq(1)
          .click()
        cy.get('#name')
          .clear()
          .type(nomeGestor)
          .blur()
        cy.get('#name')
          .should('have.value', nomeGestor)
        cy.get('.MuiGrid-root > .MuiButton-contained > .MuiButton-label')
          .contains('SALVAR EDIÇÃO')
          .should('be.visible')
          .click()
        cy.get('.MuiGrid-root > .MuiDialogContent-root')
          .contains('Atenção!')
          .should('be.visible')
        cy.get('.MuiGrid-root > .MuiDialogContent-root')
          .contains('Declaro e me responsabilizo pela declaração, de que tenho autorização para realizar a edição dos dados e alterá-los. Declaro também, que os dados foram e sempre serão obtidos de forma legitima e me responsabilizo pela transcrição corretas deles nessa plataforma, comprometendo-me a mantê-los sempre atualizados.')
          .should('be.visible')
        cy.get('.MuiGrid-root > .MuiDialogActions-root')
          .contains('Salvar Edição')
          .should('be.visible')
          .click()
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
          .contains('Dados salvos com sucesso!')
          .should('be.visible')
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Gestores Escolares')
          .should('be.visible');
        cy.get('#name')
          .click()
          .type(nomeGestor)
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.contains('p', nomeGestor)
      });
  });

  //4.3 edita gestor escolar único exceção campos obrigatorios

  it('edita gestor escolar único exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeGestor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Maria', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailGestor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeGestor = gerarNomeGestor();
    cy.wrap(nomeGestor).as('nomeGestor');
    const email = gerarEmailGestor(nomeGestor); // <-- agora passa o nome!
    cy.wrap(email).as('email');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeGestor, email } },
      ({ nomeGestor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click()
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Gestores escolares')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root button')
          .click()
        cy.get('form > :nth-child(1) > :nth-child(2) > .MuiTypography-root')
          .contains('Edição de Gestor escolar')
          .should('be.visible')
        cy.get('#name')
          .clear()
        cy.get(':nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
          .should('be.visible')
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
          .should('be.visible')
        cy.get('.MuiChip-root').each(($chip) => {
          cy.wrap($chip)
            .find('.MuiChip-deleteIcon')
            .click({ force: true })
        })
        cy.contains('button', 'SALVAR EDIÇÃO').should('be.visible')
          .should('be.disabled')
      });
  });

  //5 cadastra professor único

  it('cadastra professor único exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeProfessor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailProfessor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeProfessor = gerarNomeProfessor();
    cy.wrap(nomeProfessor).as('nomeProfessor');
    const email = gerarEmailProfessor(nomeProfessor); // <-- agora passa o nome!

    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeProfessor, email } },
      ({ nomeProfessor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Professores')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar Professor')
          .click()
        cy.get('#name')
          .click()
          .type(nomeProfessor)
          .should('be.visible');
        cy.get('#email')
          .click()
          .type(email)
          .should('be.visible');
        cy.get(':nth-child(7) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
        cy.contains('Regional Farol 156A')
          .click()
          .wait(1000);
        cy.get(':nth-child(8) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click();
        cy.contains('50001078 - EM TEODORO RONDON')
          .click()
          .wait(1000);
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root')
          .click()
          .wait(3000);
        cy.get('.MuiSnackbarContent-message')
          .contains('Professor salvo com sucesso! Um e-mail de confirmação foi enviado para ele(a).')
          .should('be.visible');
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Professores')
          .should('be.visible');
        cy.get('#name')
          .type(nomeProfessor);
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .MuiGrid-spacing-xs-2 > :nth-child(1) > .MuiGrid-root > :nth-child(1) > .MuiBox-root')
          .should('contain', (email));
      });
  });

  //5.1 cadastra professor único exceção campos obrigatorios

  it('cadastra professor único exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeProfessor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailProfessor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeProfessor = gerarNomeProfessor();
    cy.wrap(nomeProfessor).as('nomeProfessor');
    const email = gerarEmailProfessor(nomeProfessor); // <-- agora- agora passa o nome!

    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeProfessor, email } },
      ({ nomeProfessor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Professores')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar Professor')
          .click()
        cy.get(':nth-child(2) > .MuiGrid-container > .MuiGrid-root > .MuiButtonBase-root')
          .click()
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
          .should('be.visible')
        cy.get('#email-helper-text')
          .contains('É necessário informar um e-mail válido')
          .should('be.visible')
        cy.get('P[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
          .contains('Informe a regional')
          .should('be.visible')
        cy.get('P[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
          .contains('Informe a a escola') //bug para correção
          .should('be.visible')
      });
  });

  //5.2 edita professor único

  it('edita professor único', () => {
    // Funções utilitárias
    function gerarNomeProfessor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailProfessor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeProfessor = gerarNomeProfessor();
    cy.wrap(nomeProfessor).as('nomeProfessor');
    const email = gerarEmailProfessor(nomeProfessor); // <-- agora- agora passa o nome!

    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeProfessor, email } },
      ({ nomeProfessor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Professores')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
          .click();
        cy.get('form > :nth-child(1) > :nth-child(2) > .MuiTypography-root')
          .contains('Edição de Professor')
        cy.get(':nth-child(7) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
        cy.get('[role="listbox"] li')
          .should('be.visible')
          .eq(1)
          .click({ force: true })
        cy.get('#name')
          .click()
        cy.get(':nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
        cy.get('[role="listbox"] li')
          .should('be.visible')
          .eq(1)
          .click({ force: true })
        cy.get('#name')
          .clear()
          .type(nomeProfessor)
          .blur()
        cy.get('#name')
          .should('have.value', nomeProfessor)
        cy.get('.MuiGrid-root > .MuiButton-contained')
          .should('be.visible')
          .click()
        cy.get('.MuiGrid-root > .MuiDialogContent-root')
          .contains('Atenção!')
          .should('be.visible')
        cy.get('.MuiGrid-root > .MuiDialogContent-root')
          .contains('Declaro e me responsabilizo pela declaração, de que tenho autorização para realizar a edição dos dados e alterá-los. Declaro também, que os dados foram e sempre serão obtidos de forma legitima e me responsabilizo pela transcrição corretas deles nessa plataforma, comprometendo-me a mantê-los sempre atualizados.')
          .should('be.visible')
        cy.get('.MuiGrid-root > .MuiDialogActions-root')
          .contains('Cancelar')
        cy.get('.MuiGrid-root > .MuiDialogActions-root')
          .contains('Salvar Edição')
          .click()
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
          .contains('Edição realizada com sucesso!')
          .should('be.visible')
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .contains('Professores')
          .should('be.visible');
        cy.get('#name')
          .click()
          .type(nomeProfessor)
        cy.get('.MuiGrid-grid-md-2 > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.contains('p', nomeProfessor)

      });
  });

  //5.3 edita professor único exceção campos obrigatorios

  it('edita professor único exceção campos obrigatorios', () => {
    // Funções utilitárias
    function gerarNomeProfessor() {
      const nomes = ['Maria', 'João', 'Manuel', 'Thiago', 'Silvana', 'Mônica'];
      const sobrenomes = ['França', 'Leite', 'Cavalcante', 'Pinheiro', 'Siqueira', 'Coelho'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      return `${nome} ${sobrenome}`;
    }
    function gerarEmailProfessor(nomeCompleto) {
      const dominio = 'teste.com';
      const [nome] = nomeCompleto.split(' ');
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}@${dominio}`.toLowerCase();
    }
    const nomeProfessor = gerarNomeProfessor();
    cy.wrap(nomeProfessor).as('nomeProfessor');
    const email = gerarEmailProfessor(nomeProfessor); // <-- agora- agora passa o nome!

    cy.wrap(email).as('email');
    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeProfessor, email } },
      ({ nomeProfessor, email }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Professores')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click")
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
          .click();
        cy.get('form > :nth-child(1) > :nth-child(2) > .MuiTypography-root')
          .contains('Edição de Professor')
        cy.get('#name')
          .clear()
        cy.get(':nth-child(1) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
          .click()
          .should('be.visible')
        cy.get('#name-helper-text')
          .contains('É necessário informar seu nome completo')
          .should('be.visible')
        cy.get('.MuiChip-root').each(($chip) => {
          cy.wrap($chip)
            .find('.MuiChip-deleteIcon')
            .click({ force: true })
        })
        cy.contains('button', 'SALVAR EDIÇÃO').should('be.visible')
          .should('be.disabled')

      });
  });

  //6 cadastra turma única

  it('cadastra turma única', () => {
    // Funções utilitárias
    function gerarNomeTurma(NomeTurma) {
      const nomes = ['Turma'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}`.toLowerCase();
    }
    const nomeTurma = gerarNomeTurma();
    cy.wrap(nomeTurma).as('nomeTurma');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeTurma } },
      ({ nomeTurma }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Turmas')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar turma')
          .click()
        cy.get('#name')
          .click()
          .type(nomeTurma)
          .should('be.visible');
        cy.get('#grade')
          .click();
        cy.contains('7º - Ano (Ensino Fundamental)')
          .click();
        cy.get('#schoolShift')
          .click()
        cy.contains('Matutino')
          .should('be.visible')
          .click()
        cy.get('#schoolYear')
          .click()
        cy.contains('2026')
          .should('be.visible')
          .click({ force: true });
        cy.get('#school')
          .click()
        cy.contains('50001078 - EM TEODORO RONDON')
          .should('be.visible')
          .click({ force: true });
        cy.get('#schoolZone')
          .click()
        cy.contains('Urbana')
          .should('be.visible')
          .click({ force: true });
        cy.get('#teacherDisciplines')
          .click()
        cy.get('[role="listbox"] li')
          .first()
          .click({ force: true });
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
        cy.contains(/^SALVAR$/)
          .click();
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
          .should('be.visible')
        cy.contains(/^Sim, podemos continuar$/)
          .click();
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
        cy.contains(/^Turma salva com sucesso$/)
          .wait(3000)
        cy.get('#name')
          .type(nomeTurma)
          .should('be.visible')
        cy.contains('Pesquisar')
          .click();
      });
  });

  //6.1 cadastra turma única exceção campos obrigatorios

  it('cadastra turma única exceção campos obrigatorios botão Salvar', () => {
    // Funções utilitárias
    function gerarNomeTurma(NomeTurma) {
      const nomes = ['Turma'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}`.toLowerCase();
    }
    const nomeTurma = gerarNomeTurma();
    cy.wrap(nomeTurma).as('nomeTurma');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeTurma } },
      ({ nomeTurma }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Turmas')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar turma')
          .click()
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
        cy.contains(/^SALVAR$/)
          .click();
        cy.get('#name-helper-text')
          .contains('O nome da turma é obrigatório')
          .should('be.visible')
        cy.get('#grade-helper-text')
          .contains('Selecione a série escolar')
          .should('be.visible')
        cy.get('#schoolShift-helper-text')
          .contains('Selecione o turno')
          .should('be.visible')
        cy.get('#schoolYear-helper-text')
          .contains('Selecione o período letivo')
          .should('be.visible')
        cy.get('#school-helper-text')
          .contains('Selecione uma escola')
          .should('be.visible')
        cy.get('#schoolZone-helper-text')
          .contains('Selecione uma Zona')
          .should('be.visible')
        cy.get('#teacherDisciplines-helper-text')
          .contains('Selecione o(a) professor(a) da turma')
          .should('be.visible')
      });
  });

  //6.2  cadastra turma única exceção campos obrigatorios

  it('cadastra turma única exceção campos obrigatorios botão Salvar e cadastrar nova', () => {
    // Funções utilitárias
    function gerarNomeTurma(NomeTurma) {
      const nomes = ['Turma'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}`.toLowerCase();
    }
    const nomeTurma = gerarNomeTurma();
    cy.wrap(nomeTurma).as('nomeTurma');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeTurma } },
      ({ nomeTurma }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Turmas')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get('.MuiButton-label > .MuiTypography-root')
          .should('have.text', 'Cadastrar turma')
          .click()
        cy.get('div[class="MuiGrid-root MuiGrid-item"]')
        cy.contains(/^SALVAR E CADASTRAR NOVA$/)
          .click();
        cy.get('#name-helper-text')
          .contains('O nome da turma é obrigatório')
          .should('be.visible')
        cy.get('#grade-helper-text')
          .contains('Selecione a série escolar')
          .should('be.visible')
        cy.get('#schoolShift-helper-text')
          .contains('Selecione o turno')
          .should('be.visible')
        cy.get('#schoolYear-helper-text')
          .contains('Selecione o período letivo')
          .should('be.visible')
        cy.get('#school-helper-text')
          .contains('Selecione uma escola')
          .should('be.visible')
        cy.get('#schoolZone-helper-text')
          .contains('Selecione uma Zona')
          .should('be.visible')
        cy.get('#teacherDisciplines-helper-text')
          .contains('Selecione o(a) professor(a) da turma')
          .should('be.visible')
      });
  });

  //6.3 edita turma única

  it('edita turma única', () => {
    // Funções utilitárias
    function gerarNomeTurma(NomeTurma) {
      const nomes = ['Turma'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}`.toLowerCase();
    }
    const nomeTurma = gerarNomeTurma();
    cy.wrap(nomeTurma).as('nomeTurma');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeTurma } },
      ({ nomeTurma }) => {
        cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Turmas')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
          .click();
        cy.get('.MuiGrid-spacing-xs-3.MuiGrid-grid-xs-12 > :nth-child(2)')
          .contains('Edição de Turma')
        cy.get('#grade')
          .click()
        cy.contains('8º - Ano (Ensino Fundamental)')
          .should('be.visible')
          .click()
        cy.get('#schoolShift')
          .click()
        cy.contains('Integral')
          .should('be.visible')
          .click()
        //cy.get('#school')
        //  .click()
        //cy.contains('50015095 - COLEGIO CELQ')
        //  .should('be.visible')
        //  .click({ force: true });
        cy.get('#schoolZone')
          .click()
        cy.contains('Rural')
          .should('be.visible')
          .click({ force: true });
        //cy.get('#teacherDisciplines')
        //  .click()
        //cy.get('[role="listbox"] li')
        //  .eq(1)
        //  .click({ force: true });
        cy.get('#name')
          .clear()
          .type(nomeTurma)
          .should('be.visible')
        cy.get('.MuiGrid-align-items-xs-center > :nth-child(2) > .MuiGrid-container > :nth-child(2) > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get('.MuiDialog-container > .MuiPaper-root > .MuiDialogContent-root')
          .should('be.visible')
          .contains('Autodeclaração')
          .should('be.visible')
        cy.get('.MuiDialog-container > .MuiPaper-root > .MuiDialogContent-root')
          .contains('Declaro que os dados pessoais que estão sendo editados foram obtidos de forma legítima e estão devidamente atualizados.')
          .should('be.visible')
        cy.get('.MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root')
          .contains('Sim, podemos continuar')
          .should('be.visible')
          .click()
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
          .contains('Turma salva com sucesso')
        cy.get('.MuiSnackbarContent-action > .MuiButtonBase-root')
          .click()
        cy.get('form > .MuiGrid-spacing-xs-3')
          .contains('Turmas')
          .should('be.visible')
        cy.get('.MuiGrid-spacing-xs-3')
          .contains(nomeTurma)
          .should('be.visible')

      });
  });

  //6.4 edita turma única exceção campos obrigatórios

  it('edita turma única exceção campos obrigatórios', () => {
    // Funções utilitárias
    function gerarNomeTurma(NomeTurma) {
      const nomes = ['Turma'];
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sufixo = Math.random().toString(36).substring(2, 6); // gera 4 letras/números
      return `${nome}${sufixo}`.toLowerCase();
    }
    const nomeTurma = gerarNomeTurma();
    cy.wrap(nomeTurma).as('nomeTurma');

    cy.get('input[id="user-input"]')
      .should('be.visible')
    cy.get('input[id="user-input"]')
      .click()
      .type('60448288915@gmail.com')
      .should('have.value', '60448288915@gmail.com')
    cy.get('#password-input')
      .should('be.visible')
    cy.get('#password-input')
      .click()
      .type('123456')
      .should('have.value', '123456')
    cy.get('.bt-entrar')
      .should('be.visible')
      .click()
    cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br',
      { args: { nomeTurma } },
      ({ nomeTurma }) => {
        cy.contains('Cadastros')
          .should('be.visible')
          .wait(3000)
        cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
          .click();
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiTypography-root')
          .should('have.text', 'Turmas')
          .trigger('mouseover')
          .trigger('mouseup')
          .trigger("click");
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root')
          .click();
        cy.get('.MuiGrid-spacing-xs-3.MuiGrid-grid-xs-12 > :nth-child(2)')
          .contains('Edição de Turma')
        cy.get('#grade')
          .clear()
        cy.get('#schoolShift')
          .click()
        cy.get(':nth-child(4) > :nth-child(2) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiAutocomplete-clearIndicator')
          .click()
        cy.get('#schoolYear')
          .click()
        cy.get(':nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiAutocomplete-clearIndicator > .MuiIconButton-label > .MuiSvgIcon-root')
          .click()
        cy.get('#school')
          .click()
          .clear()
        cy.get('#schoolZone')
          .click()
          .clear()
        cy.get('#name')
          .click()
          .clear()
        cy.get('.MuiGrid-align-items-xs-center > :nth-child(2) > .MuiGrid-container > :nth-child(2) > .MuiButtonBase-root > .MuiButton-label')
          .click()
        cy.get('#name-helper-text')
          .contains('O nome da turma é obrigatório')
          .should('be.visible')
        cy.get('#grade-helper-text')
          .contains('Selecione a série escolar')
          .should('be.visible')
        cy.get('#schoolShift-helper-text')
          .contains('Selecione o turno')
          .should('be.visible')
        cy.get('#schoolYear-helper-text')
          .contains('Selecione o período letivo')
          .should('be.visible')
        cy.get('#school-helper-text')
          .contains('Selecione uma escola')
          .should('be.visible')
        cy.get('#schoolZone-helper-text')
          .contains('Selecione uma Zona')
          .should('be.visible')

      });
  });
});
