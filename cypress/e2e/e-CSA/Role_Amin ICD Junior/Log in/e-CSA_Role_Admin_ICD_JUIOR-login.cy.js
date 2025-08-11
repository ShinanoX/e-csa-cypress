describe('Role Admin ICD Junior', () => {
    describe('Log in', () => {
        it('TC-A-001 - เทส Ui login', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/auth/login');
            cy.url().should('include', '/auth/login');
            cy.wait(1000);
            cy.on('uncaught:exception', (err, runnable) => {
                if (err.message.includes('Minified React error #418') ||
                    err.message.includes('visit https://react.dev/errors') ||
                    err.message.includes('React') ||
                    err.message.includes('chunk loading failed')) {
                    return false;
                }
                return true;
            });
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').should('be.visible')
            cy.get('.ant-select-selector').click();
            cy.get('.ant-select-item').first().click();
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').click();

        });

        it('TC-A-002 - ไม่สามารถเข้าสู่ระบบได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/auth/login');
            cy.url().should('include', '/auth/login');
            cy.wait(1000);
            cy.on('uncaught:exception', (err, runnable) => {
                if (err.message.includes('Minified React error #418') ||
                    err.message.includes('visit https://react.dev/errors') ||
                    err.message.includes('React') ||
                    err.message.includes('chunk loading failed')) {
                    return false;
                }
                return true;
            });
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').should('be.visible')
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').should('be.visible');
        });

        it('TC-A-003 - ทดสอบเข้าสู่ระบบ', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/auth/login');
            cy.url().should('include', '/auth/login');
            cy.on('uncaught:exception', (err, runnable) => {
                if (err.message.includes('Minified React error #418') ||
                    err.message.includes('visit https://react.dev/errors') ||
                    err.message.includes('React') ||
                    err.message.includes('chunk loading failed')) {
                    return false;
                }
                return true;
            });
            cy.get('body')
                .type('{shift}', { release: false }).type('Y')
                .type('{shift}', { release: true });
            cy.get('#assessed').click();
            cy.get('[title="บริษัทย่อย"]').click();

            cy.get('.flex .flex-col .gap-4 > :nth-child(2)').should('be.visible');
            cy.get('input[id="username"]').should('be.visible').clear().type('rit@looksocial.dev');
            cy.get('input[id="password"]').should('be.visible').clear().type('Bcp1234!');
            cy.get('button[type="submit"]').click();
        })
    });

});
