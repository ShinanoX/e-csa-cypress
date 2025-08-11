describe('Role Admin ICD Junior', () => {
    describe('Log in', () => {
        it('ADMINICDSENIOR-SN-01 - Log in Success', () => {
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
            cy.wait(5000);
        })
    });

    describe('Log in Failed', () => {
        it('ADMINICDSENIOR-SN-02 - Log in Failed', () => {
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
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').should('be.visible');
            cy.get(':nth-child(2) > .ant-form-item > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .flex').should('be.visible');
        });
    })

    describe.only('Log out Success', () => {
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
        });
        it('ADMINICDSENIOR-SN-04 - ออกจากระบบสำเร็จ', () => {
            cy.wait(2000);
            cy.get('button[id^="headlessui-popover-button"]').eq(0).click();
            cy.get('.flex-col.py-2 > .flex').contains('ออกจากระบบ').click();

            cy.get('.ant-modal-body > .gap-6').should('be.visible').within(() => {
                cy.contains('คุณต้องการออกจากระบบใช่หรือไม่?').should('be.visible').should('have.text', 'คุณต้องการออกจากระบบใช่หรือไม่?');
                cy.contains('กรุณายืนยันการออกจากระบบ').should('be.visible').should('have.text', 'กรุณายืนยันการออกจากระบบ');
                cy.get('button[type="button"]').contains('ยืนยัน').should('be.visible').click();

            })
            cy.url().should('include', '/auth/login');
            cy.on('uncaught:exception', (err, runnable) => {
                if (err.message.includes('Minified React error #418') ||
                    err.message.includes('visit https://react.dev/errors') ||
                    err.message.includes('React') ||
                    err.message.includes('chunk loading failed') ||
                    err.message.includes('HTML')) {
                    return false;
                }
                return true;
            });
        });

    })

});
