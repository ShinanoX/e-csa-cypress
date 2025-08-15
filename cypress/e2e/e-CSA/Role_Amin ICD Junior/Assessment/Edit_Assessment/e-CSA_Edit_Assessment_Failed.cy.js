describe('5.3.2 Edit Assessment Failed ', () => {
    const passEvaluationForm = {
        assessment_code: 'BCP_2025_TEST',
        description: 'การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA',
    };
    const searchData = {
        assessment_code: 'BCP_Test_Edit_For_Copy',
        edit_assessment_code: 'BCP_Test_Edit_For_Draft',
    };
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

    describe('5.3.2 Edit Assessment Failed', () => {
        it.only('ADMINICDSENIOR-SN-163 : ไม่สามารถแก้ไขข้อมูลแบบประเมินได้ เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type(searchData.edit_assessment_code);
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.get('.bg-white.p-4 > .flex.gap-4 > .rounded-md').click()

            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

            //  ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                // ขั้แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
                cy.get('#assessment_code').clear();
                cy.get('#name').clear();
                cy.get('#description').clear();
                // cy.wait(2000)
                cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');
                cy.get('#start_date').click();
                cy.get('#end_date').click();
                cy.get('.ant-form-item-control-input-content > .flex-col > .ant-picker > .ant-picker-input > #end_date').click();
                // cy.wait(2000)
                cy.get('#open_next_round_date').click();
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
                cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });
        });

    })

});