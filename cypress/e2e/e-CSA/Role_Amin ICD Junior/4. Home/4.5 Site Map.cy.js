describe('Site Map', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/site-map');
        cy.url().should('include', '/site-map');
        cy.wait(2000);
    });

    describe('4.5 Site Map', () => {
        it('ADMINICDJUNIOR-SN-127/128: สามารถดูข้อมูล Portal ที่หน้า Home ได้/ สามารถเข้าสู่เว็บไซต์ผ่าน Portal ได้', () => {
            cy.contains('Site Map').should('be.visible').click();
            cy.wait(1000);
            cy.url().should('include', '/site-map');

            cy.get('.grid.grid-cols-3').within(() => {
                cy.contains('Home').should('be.visible');
                cy.contains('Assessment Form').should('be.visible');
                cy.contains('Notification').should('be.visible');
                cy.contains('FAQ').should('be.visible');
                cy.contains('About Internal Control').should('be.visible');
                cy.contains('Portal').should('be.visible');
                cy.contains('User Manual').should('be.visible');
            });
        });
        it.only('ADMINICDJUNIOR-SN-129: สามารถดาวน์โหลด User Manual ที่หน้า Site Map ได้', () => {
            cy.contains('Site Map').should('be.visible').click();
            cy.wait(1000);
            cy.url().should('include', '/site-map');

            // ตรวจสอบแต่ละเมนูใน Site Map
            cy.get('.grid.grid-cols-3').within(() => {
                cy.contains('User Manual').should('be.visible').click();
            });
        });
    });

});