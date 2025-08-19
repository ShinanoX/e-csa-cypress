const { faker } = require("@faker-js/faker");

describe('Maximum Extend', () => {
    const randomStageNo = faker.number.int({ min: 1, max: 365 }); // เลข 1-10
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
        cy.wait(3000);
    });

    describe('2.3.1 Maximum Extend Success', () => {
        it('ADMINICDJUNIOR-SN-36 - สามารถกำหนดจำนวนวันสูงสุดที่ระบบจะยอมขยายเวลาตอบแบบประเมินให้ผู้ประเมินได้', () => {
            cy.get('#config_value')
                .clear()
                .type(randomStageNo);
            cy.contains('ยืนยัน').click();
            cy.wait(2000);
            cy.get('.gap-12').should('contain', `บันทึกการเปลี่ยนแปลงจำนวนวันสูงสุดที่ระบบจะยอมขยายเวลาให้ผู้ประเมิน (Maximum Extend) เป็น ${randomStageNo} วันสำเร็จ`);
            cy.contains('ปิด').click();
        });
    })

});