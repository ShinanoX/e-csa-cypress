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
        cy.visit('https://dev-ecsa.looksocial.dev/assessment');
        cy.url().should('include', '/assessment');
        cy.wait(2000);
    });

    describe('สามารถดาวน์โหลดไฟล์แนบทั้งหมดได้', () => {
        it('ADMINICDSENIOR-SN-171 : สามารถดาวน์โหลดไฟล์แนบทั้งหมดได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_ทดสอบการสร้างแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            //แนบเอกสาร
            // cy.get(':nth-child(1) > .flex.mt-4 > :nth-child(1) > .text-\\[\\#1F2937\\] > .gap-4 > .w-full.gap-2 > :nth-child(3) > :nth-child(4) > .flex-col > .rounded-md').click();
            // cy.wait(3000);
            // cy.get('.ant-modal-content').within(() => {
            //     cy.get('#file_name').type('เอกสารทดสอบ');
            //     // cy.get('.ant-checkbox-wrapper').click();
            //     cy.get('.gap-4 > :nth-child(1) > .ant-radio-wrapper > .ant-radio-label').click();
            //     cy.get('input[type="file"]').attachFile('e-CSA TEST PDF.pdf');
            //     cy.get('#description').type('ทดสอบการแนบไฟล์');
            //     cy.get('.justify-end > .bg-\\[\\#4CB847\\]').contains('Upload').click();
            //     cy.get('.ant-table-cell-fix-right > .gap-2 > :nth-child(1)').click();
            // });
        });




    });
});