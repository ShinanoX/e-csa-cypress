describe('Site Map', () => {
    beforeEach(() => {
        cy.loginApiRoleAdmin();
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
        cy.wait(1000);

        // Navigate to Role Management
        // cy.get('nav').contains('Role Management').click();
        // cy.get('.p-1').should('be.visible');
        // cy.get('.p-1 > button:nth-child(1)').contains('จัดการสิทธิ์ Admin').click();
        // cy.wait(1000);
    });

    describe('Site Map', () => {
        it('Site Map', () => {
            cy.contains('Site Map').should('be.visible').click();
            cy.wait(1000);
            cy.url().should('include', '/site-map');

            cy.get('.flex-1 > .h-full > :nth-child(1) > .bg-white').within(() => {
                cy.contains('Home').should('be.visible');
                cy.contains('Assessment Form').should('be.visible');
                cy.contains('Report').should('be.visible');
                cy.contains('Notification').should('be.visible');
                cy.contains('User Manual').should('be.visible');
            });

            cy.log('Master Data')
            cy.get(':nth-child(2) > .py-4').within(() => {
                cy.contains('Master Data').should('be.visible');
                cy.contains('การจัดการ e-mail Template').should('be.visible');
                cy.contains('การจัดการ FAQ Page').should('be.visible');
                cy.contains('การกำหนดจำนวนวันสูงสุดที่ระบบ จะยอมขยายเวลาให้ผู้ประเมิน (maximum extend)').should('be.visible');
                cy.contains('การจัดการ User Manual').should('be.visible');
                cy.contains('การจัดการ Portal').should('be.visible');
                cy.contains('การจัดการ About Internal Control').should('be.visible');
            });

            cy.log('Role Management')
            cy.get('.space-y-6').within(() => {
                cy.contains('Role Management').should('be.visible');
                cy.contains('จัดการสิทธิ์ Admin').should('be.visible');

                cy.contains('FAQ').should('be.visible');
                cy.contains('About Internal Control').should('be.visible');
                cy.contains('Portal').should('be.visible');
            });

        });
    });
})