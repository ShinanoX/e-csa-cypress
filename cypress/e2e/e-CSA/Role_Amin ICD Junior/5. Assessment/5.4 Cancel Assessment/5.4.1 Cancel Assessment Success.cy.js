describe('5.4.1 Cancel Assessment Success ', () => {

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

        cy.visit('https://dev-ecsa.looksocial.dev/assessment');
        cy.url().should('include', '/assessment');
        cy.wait(2000);
    });

    describe('5.4.1 Cancel Assessment Success', () => {
        it('ADMINICDJUNIOR-SN-164 : สามารถยกเลิกแบบประเมินที่หน้าแบบประเมินทั้งหมดได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_Test_สำหรับยกเลิกแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-dropdown-trigger').click();
            });
            cy.get('.ant-dropdown-menu-item').contains('ยกเลิกแบบประเมิน').should('be.visible').click();
            cy.wait(2000);

            cy.get('.ant-modal-content').within(() => {
                cy.get('#remark').type('ต้องทดสอบยกเลิกแบบประเมิน');
                cy.contains('กรุณาระบุเหตุผลที่ทำการยกเลิกแบบประเมินฉบับนี้').should('be.visible');
                cy.contains('ยืนยัน')
                    .should('be.visible')
                // .click();
                cy.contains('ยกเลิก')
                    .should('be.visible')
                // .click();
            });

        });

        it.only('ADMINICDJUNIOR-SN-165 : สามารถยกเลิกแบบประเมินที่หน้าแบบประเมินทั้งหมดได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_Test_สำหรับยกเลิกแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.get('.ant-dropdown-trigger > .rounded-md').contains('เพิ่มเติม').click();
            cy.get('.ant-dropdown-menu-item').contains('ยกเลิกแบบประเมิน').should('be.visible').click();
            cy.get('.ant-modal-content').within(() => {
                cy.get('#remark').type('ต้องทดสอบยกเลิกแบบประเมิน');
                cy.contains('กรุณาระบุเหตุผลที่ทำการยกเลิกแบบประเมินฉบับนี้').should('be.visible');
                cy.contains('ยืนยัน')
                    .should('be.visible')
                // .click();
                cy.contains('ยกเลิก')
                    .should('be.visible')
                // .click();
            });

        });

    })

});