describe('1.2.1 Log out Success', () => {
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

    describe('1.2.1 Log out Success', () => {
        it('ADMINICDSENIOR-SN-04: ออกจากระบบสำเร็จ', () => {
            cy.get('#headlessui-popover-button-«rh» > .gap-1').click();
            cy.get('.flex-col.py-2 > .flex').contains('ออกจากระบบ').click();
            cy.wait(1000);
            cy.get('.ant-modal-body > .gap-6').within(() => {
                cy.get('.w-full > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').click();
            })
            cy.url().should('include', '/login');
            cy.wait(1000);
        })

        it('ADMINICDSENIOR-SN-07: ออกจากระบบสำเร็จ', () => {
            cy.get('#headlessui-popover-button-«rh» > .gap-1').click();
            cy.get('.flex-col.py-2 > .flex').contains('ออกจากระบบ').click();
            cy.wait(1000);
            cy.get('.ant-modal-body > .gap-6').within(() => {
                cy.get('.bg-white').contains('ยกเลิก').click();
            })
            cy.wait(1000);
        })
    });
})
