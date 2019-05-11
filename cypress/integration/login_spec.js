const username = 'agusti';
const passwd = '1234';
const wrongPasswd = '1111';

describe('Fiberfy-nt Login', () => {
    it('Login', () => {
        cy.visit('/');

        cy.get('#usernameInput').type(username);

        cy.get('#authInput').select('Local');

        cy.get('#passwordInput').type(wrongPasswd);

        cy.get('.btn').click();

        cy.get('.alert').should('be.visible');

        cy.get('.close').click();

        cy.get('#passwordInput')
            .clear()
            .type(passwd);

        cy.get('#authInput').select('Local');

        cy.get('.btn').click();

        cy.url().should('include', '/#/map');
    });
});
