/// <reference types="cypress" />
     
describe('Entrar na pagina login', () => {  
  beforeEach(() => {

  cy.intercept('GET', '**linkedin.com/**', {
    statusCode: 200,
    body: {},
  });

  cy.intercept('GET', '**dynamizecdn.com/**', {
    statusCode: 200,
    body: {},
  });

  cy.intercept('GET', '**facebook.com/**', {
    statusCode: 200,
    body: {},
  });

  cy.intercept('GET', '**analytics.google.com/**', {
    statusCode: 200,
    body: {},
  });
  
  
  cy.visit('https://acessohom.institutoayrtonsenna.org.br/auth/realms/ias/protocol/openid-connect/auth?client_id=bncc&redirect_uri=https%3A%2F%2Fdevplataformafarol.institutoayrtonsenna.org.br%2Fdashboard&state=58b3e694-e4f7-4a54-8328-188821d3da5a&response_mode=fragment&response_type=code&scope=openid&nonce=fba3c315-f065-42b1-b9b2-89ffa57464cf')
})
        //cenário 1
it('cadastra estudante unico', () => { 
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

  cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
    
  cy.get('.MuiTypography-root.jss18.MuiTypography-body1') 
    .should('be.visible')
    .wait(2000)
  
  cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
    .click();
    
  cy.contains(':nth-child(6) > .MuiButtonBase-root > .MuiTypography-root', 'Estudantes')
    .should('be.visible')
    .trigger('mouseover')
    .trigger('mouseup')
    
  cy.contains('li.MuiButtonBase-root', 'Cadastro único')
    .trigger('mouseover')
    .trigger('mouseup')
    .trigger("click");  
    
  cy.get('input[placeholder="Selecione uma regional"]')
    .click()
  cy.get('[role="combobox"] div')
    .wait(1000)
  cy.get('#regional-option-0')
    .first()
    .click();

  cy.get('input[placeholder="Selecione uma ou mais escolas"]')
    .click()
  cy.contains('50001078 - EM TEODORO RONDON')
    .click()
   
  cy.get('input[placeholder="Selecione uma ou mais turmas"]')
    .click()
  cy.contains('Turma Farol 156A - 2025')
    .click()
  
  cy.get('input[placeholder="Selecione a situação do ano anterior"]')
    .click()
  cy.contains('Aprovado')
    .click()
    
  cy.get('input[placeholder="Selecione o ano/série de origem"]')
    .click()
  cy.contains('9º - Ano (Ensino Fundamental)')
    .click()

  cy.get('input[placeholder="Nome completo do estudante')
    .click()
    .type('Aluno Automação')
    .should('have.value', 'Aluno Automação')

  cy.get('input[placeholder="DD/MM/AAAA')
    .click()
    .type( '15/08/2010')
    .should('have.value', '15/08/2010')

  cy.get('#gender')
    .click()
  cy.contains('Feminino')
    .click()

  cy.get('.MuiGrid-root > .MuiButton-contained')
    .should('be.visible')
    .click()
    .wait(5000)

  cy.get('div[class="MuiSnackbarContent-message"]')
    .contains('Cadastro concluído!')
    .should('be.visible')

  cy.get('.jss467 > :nth-child(1) > .MuiTypography-root')//confirma que esta na tela de consulta estudante
    .contains('Estudantes')
    .should('be.visible')
   })
})
     //cenário 2
  it.only('cadastrar regional', () => { 
    
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

  cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {

  cy.get('.MuiTypography-root.jss18.MuiTypography-body1')
     .should('be.visible')
     .wait(3000)

  cy.get('[style="display: flex; flex-direction: row; justify-content: space-evenly; gap: 4px;"] > :nth-child(2) > .MuiTypography-root').wait(1000)
    .click();
           
  cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiTypography-root')
    .should('have.text', 'Regionais e escola')
    .click({force:true});

  cy.get('.MuiList-root > :nth-child(1) > .MuiButtonBase-root')
    .click();
   
  cy.get('.MuiButton-label > .MuiTypography-root')
    .click();
    
  cy.get('#name')
    .should('be.visible')
    .click()
    .type('Teste Automacao 1')
    .should('have.value', 'Teste Automacao 1')
    
    //cy.get('#number') está com bug no sistema
            //.should('be.visible').click().type('12').should('have.value', '12')
    
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
    .click({force:true})
    .type('{uparrow}-{enter}')
  
  cy.get('input[class="MuiInputBase-input MuiOutlinedInput-input MuiAutocomplete-input MuiAutocomplete-inputFocused MuiInputBase-inputAdornedEnd MuiOutlinedInput-inputAdornedEnd"]')
    .eq(2)
  
  cy.get('[role="listbox"] li')
    .first()
    .click();
  
  cy.get('.MuiGrid-justify-content-xs-flex-end > .MuiButtonBase-root > .MuiButton-label > span > .MuiTypography-root')
    .click({force:true});
     
  cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiButton-label > span > .MuiTypography-root')
    .click({force:true});

  cy.get('div[class="MuiSnackbarContent-message"]')
    .contains('Dados salvos com sucesso!')
    .should('be.visible')
  
  })  
})
     //cenário 3
  it('Programas educacionais', () => { 
  cy.get('input[id="user-input"]')
    .should('be.visible')

  cy.get('input[id="user-input"]')
    .click().type('60448288915@gmail.com')
    .should('have.value', '60448288915@gmail.com')

  cy.get('#password-input') 
    .should('be.visible')

  cy.get('#password-input')
    .click().type('123456').should('have.value', '123456')

  cy.get('.bt-entrar')
    .should('be.visible').click()

  cy.origin('https://devplataformafarol.institutoayrtonsenna.org.br', () => {
    
  cy.get('.MuiTypography-root.jss18.MuiTypography-body1') 
    .should('be.visible')

  cy.get(':nth-child(4) > .MuiTypography-root')
    .should('be.visible')
    .click().wait(2000)

  cy.contains('[role="menuitem"]', 'Programas educacionais')
    .should('be.visible')
  cy.get('.MuiList-root > :nth-child(2) > .MuiButtonBase-root')
    .contains('Programas educacionais')
    .wait(1000).trigger("click"); 
  
     })
   })
})
      