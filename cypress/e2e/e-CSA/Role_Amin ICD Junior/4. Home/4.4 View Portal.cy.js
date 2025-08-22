describe('View Portal', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/config/portal');
        cy.url().should('include', '/portal');
        cy.wait(2000);
    });

    describe('4.4.1 View Portal Success', () => {
        it('ADMINICDJUNIOR-SN-124/125: สามารถดูข้อมูล Portal ที่หน้า Home ได้/ สามารถเข้าสู่เว็บไซต์ผ่าน Portal ได้', () => {
            cy.get('.pb-0 > .flex > .text-neutral-800').should('be.visible').should('have.text', 'Portal');
            cy.get(':nth-child(1) > .bg-white > :nth-child(2) > .flex > div').contains('เข้าสู่เว็บไซต์').click();
        });
    });

    // describe('4.4.2 View Portal Failed', () => {
    //     it('ADMINICDJUNIOR-SN-126: ไม่สามารถเข้าสู่เว็บไซต์ผ่าน Portal ได้เนื่องจากกรอก Link ผิดที่ Master Data', () => {
    //         cy.get('.pb-0 > .flex > .text-neutral-800').should('be.visible').should('have.text', 'Portal');
    //         cy.get(':nth-child(1) > .bg-white > :nth-child(2) > .flex > div').contains('เข้าสู่เว็บไซต์').click();
    //     });
    // });

});