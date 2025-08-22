describe('5.5 ตรวจสอบการทำงานที่หน้า แบบประเมินที่เลือก', () => {
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

    describe('สามารถดาวน์โหลดไฟล์แนบทั้งหมดได้', () => {
        it('ADMINICDSENIOR-SN-170 : สามารถดาวน์โหลดไฟล์แนบทั้งหมดได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_ทดสอบการสร้างแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.get('.p-2 > .rounded-md').click();
            cy.wait(3000);
            cy.get('.ant-dropdown-trigger > .rounded-md').contains('เพิ่มเติม').click();
            cy.get('.ant-dropdown-menu').within(() => {
                cy.contains('ดาวน์โหลดไฟล์ทั้งหมด').click();
            });
        });

        it.only('ADMINICDSENIOR-SN-171 : สามารถดูคำตอบของ Assessor ได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_ทดสอบการสร้างแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.wait(3000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.get('.p-2 > .rounded-md').click();
            cy.wait(3000);
            cy.get(':nth-child(1) > .flex.mt-4 > :nth-child(1) > .text-\\[\\#1F2937\\] > .gap-4 > .w-full.gap-2 > :nth-child(3) > .relative > .absolute > :nth-child(1) > .rounded-md').click();

        });

    });

});
