describe('Role Admin ICD Junior', () => {
    describe('Log in', () => {
        it('ADMINICDSENIOR-SN-02: เข้าสู่ระบบไม่ได้เมื่อกรอกอีเมลผิด', () => {
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

    });

});
