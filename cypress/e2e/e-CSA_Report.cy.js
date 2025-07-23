describe('CSA Report', () => {
    beforeEach(() => {
        cy.loginApiAssessor();
        cy.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('Minified React error #418') ||
                err.message.includes('visit https://react.dev/errors') ||
                err.message.includes('React') ||
                err.message.includes('chunk loading failed')) {
                return false;
            }
            return true;
        });
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
    });

    it.only('TC-R-001: Verify Report Generation', () => {
        cy.get('.hidden > :nth-child(4)').should('be.visible').click();
        cy.url().should('include', '/report');
        cy.get('.flex.flex-col.w-full.gap-4 > button > div').each(($el, index) => {
            const text = $el.text().trim();
            cy.log(`รายการที่ ${index + 1}: ${text}`);
            // หรือเก็บค่าไว้ใช้งานต่อ
        });
    });

    it('TC-R-002: Verify Report Download', () => {
        cy.get('.report-button').click();
        cy.get('.report-modal').should('be.visible');
        cy.get('.report-modal .download-button').click();
        cy.get('.report-modal .success-message').should('be.visible');
    });
});
