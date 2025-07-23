describe('Bypass Login Tests', () => {
    beforeEach(() => {
        cy.loginApiAssessor();
    });

    it('TC-B-001 - Bypass login and access dashboard', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
        cy.get('.ant-card-head-title').should('contain', 'Dashboard');
    });
});



