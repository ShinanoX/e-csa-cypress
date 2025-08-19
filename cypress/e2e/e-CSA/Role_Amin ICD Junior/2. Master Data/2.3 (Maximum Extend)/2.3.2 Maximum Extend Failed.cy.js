describe('Maximum Extend', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/maximum-extend');
        cy.url().should('include', '/master-data/maximum-extend');
    });

    describe('2.3.2 Maximum Extend Failed', () => {
        it.only('ADMINICDJUNIOR-SN-37 - ไม่สามารถกำหนดจำนวนวันสูงสุดที่ระบบจะยอมขยายเวลาตอบแบบประเมินให้ผู้ประเมินได้ เมื่อกรอกข้อมูลไม่ถูกต้อง', () => {
            cy.log('ไม่กรอกข้อมูล');
            cy.get('#config_value').clear();
            cy.get('button[type="submit"]').should('be.disabled');
            cy.get('#config_value_help > :nth-child(1)').should('be.visible').should('contain', 'กรุณากรอกข้อมูล');

            cy.log('กรอกจำนวนตัวเลขเกิน 366');
            cy.get('#config_value').type('367');
            cy.get('button[type="submit"]').should('be.disabled');
            cy.get('#config_value_help > :nth-child(1)').should('be.visible').should('contain', 'สามารถกรอกข้อมูลได้มากสุด 366 วัน');
        });

        it('ADMINICDJUNIOR-SN-38 - ไม่สามารถกำหนดจำนวนวันสูงสุดที่ระบบจะยอมขยายเวลาตอบแบบประเมินให้ผู้ประเมินได้ เมื่อกรอกข้อมูลไม่ถูกต้อง', () => {
            cy.get('#config_value').clear();
            cy.get('button[type="submit"]').should('be.disabled');
            cy.get('#config_value_help > :nth-child(1)').should('be.visible').should('contain', 'กรุณากรอกข้อมูล');
        });
    })

});