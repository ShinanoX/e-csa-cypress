describe('View FAQ', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/');
        cy.url().should('include', '/dashboard');
        cy.wait(2000);
    });

    describe('4.1 Dashboard', () => {
        it('ADMINICDJUNIOR-SN-108: แสดงรายการ FAQ ที่พบในหน้า', () => {
            cy.get('nav').contains('Home').click();
            cy.get('.flex-col.gap-4 > :nth-child(2) > .gap-4 > :nth-child(1)').click();

            cy.get('.bg-white.border.rounded-[8px]', { timeout: 10000 }).should('exist').each(($el, index) => {
                cy.wrap($el)
                    .find('.font-normal')
                    .invoke('text')
                    .then((text) => {
                        cy.log(`FAQ #${index + 1}: ${text.trim()}`);
                    });
            });
        });
    });
});