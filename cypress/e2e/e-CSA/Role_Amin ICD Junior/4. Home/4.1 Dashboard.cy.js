describe('5.5 ตรวจสอบการทำงานที่หน้า แบบประเมินที่เลือก', () => {
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
        it('ADMINICDJUNIOR-SN-108: สามารถนำข้อมูลมาแสดงผลได้อย่างถูกต้องครบถ้วน', () => {
            cy.get('nav').contains('Home').click();
        });

        it('ADMINICDJUNIOR-SN-109: แสดงผลตาม Filter ได้อย่างถูกต้อง', () => {
            cy.get('.ant-picker-input > input').click();
            cy.get('[title="2026"]').click();
            cy.get('.justify-start > .gap-2 > .bg-\\[\\#4CB847\\]').click();
        });

        it('ADMINICDJUNIOR-SN-110: สามารถดาวน์โหลด User Manual ได้', () => {
            cy.get('.border > .flex-col > .flex').contains('คลิกที่นี่').should('be.visible').click();
        });

    });
});