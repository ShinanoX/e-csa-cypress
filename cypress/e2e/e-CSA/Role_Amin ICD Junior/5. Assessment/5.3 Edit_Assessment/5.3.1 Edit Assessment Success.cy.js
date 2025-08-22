describe('5.2 Create Assessment', () => {
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

    describe('5.3 Edit Assessment', () => {
        it.only('ADMINICDSENIOR-SN-161 : สามารถแก้ไขข้อมูลแบบประเมินได้', () => {
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
                cy.get('#assessment_code').clear().type('BCP_Test_Edit(2)');
                cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA-Automate_cypress(G)');
                cy.get('#description').clear().type('การทดสอบการสร้างแบบประเมินสำหรับทดสอบ Draft');
                // cy.wait(2000)
                cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');
                cy.get('#start_date').click();
                cy.get('#end_date').click();
                cy.get('.ant-form-item-control-input-content > .flex-col > .ant-picker > .ant-picker-input > #end_date').click();
                // cy.wait(2000)
                cy.get('#open_next_round_date').click();
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
                cy.get('button[type="submit"]').should('not.be.disabled');
                cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
                cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');
                // cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });
        });

        it('ADMINICDSENIOR-SN-162 : สามารถแก้ไขข้อมูลแบบประเมินได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type(searchData.edit_assessment_code);
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();
            cy.wait(2000);

            cy.get('textarea[placeholder="Section"]').first().type('การควบคุมภายในองค์กร (Control Environment)');

            // 1.1 Yes/No
            cy.get('textarea[placeholder="คำถาม"]').eq(0).type('องค์กรมีการกำหนดนโยบายควบคุมภายในหรือไม่');
            cy.get('input[type="radio"][value="Yes"]').first().check({ force: true });
            cy.get('input[type="checkbox"][id$="checkbox_config_yes_required_description"]').check({ force: true });
            cy.get('input[type="checkbox"][id$="checkbox_config_yes_required_attachment"]').check({ force: true });
            cy.get('input[type="checkbox"][id$="checkbox_config_no_required_description"]').check({ force: true });
            cy.get('input[type="checkbox"][id$="checkbox_config_no_required_attachment"]').check({ force: true });
            cy.get('input[type="checkbox"][id$="checkbox_config_no_est_time"]').check({ force: true });
            cy.get('textarea[id$="placeholder_description"]').eq(0).type('มีการกำหนดนโยบายและสื่อสารให้พนักงานรับทราบ');
            cy.get('textarea[id$="placeholder_improvement_plan"]').eq(0).type('ปรับปรุงการสื่อสารนโยบายให้ทั่วถึง');

            // 1.2 Choice
            cy.get('textarea[placeholder="คำถาม"]').eq(1).type('องค์กรมีการประเมินความเสี่ยงเป็นประจำหรือไม่');
            cy.get('button').contains('Add Options').click();
            // สมมติว่ามีช่องให้กรอกตัวเลือกเพิ่ม
            cy.get('textarea[id$="placeholder_description"]').eq(1).type('มีการประเมินความเสี่ยงทุกปี');

            // 1.3 Checkbox
            cy.get('textarea[placeholder="คำถาม"]').eq(2).type('องค์กรมีการตรวจสอบภายในหรือไม่');
            cy.get('input[type="checkbox"][id$="checkbox_config_is_required_attachment"]').check({ force: true });
            cy.get('textarea[id$="placeholder_description"]').eq(2).type('มีการตรวจสอบภายในทุกไตรมาส');

            // 1.4 Text
            cy.get('textarea[placeholder="คำถาม"]').eq(3).type('โปรดอธิบายวิธีการควบคุมภายในที่องค์กรใช้');
            cy.get('textarea[id$="placeholder_description"]').eq(3).type('ใช้ระบบ IT ในการควบคุมและติดตามการทำงาน');

            // 1.5 Rating
            cy.get('textarea[placeholder="คำถาม"]').eq(4).type('ประเมินระดับความเข้มงวดของการควบคุมภายใน');
            cy.get('ul.ant-rate li').eq(4).click(); // ให้คะแนน 5 ดาว
            cy.get('textarea[id$="placeholder_description"]').eq(4).type('การควบคุมภายในอยู่ในระดับดีมาก');

            // 1.6 Ranking
            cy.get('textarea[placeholder="คำถาม"]').eq(5).type('จัดอันดับความสำคัญของมาตรการควบคุมภายใน');
            cy.get('textarea[id$="placeholder_description"]').eq(5).type('1. นโยบาย 2. การตรวจสอบ 3. การประเมินความเสี่ยง');

            // 1.7 Date
            cy.get('textarea[placeholder="คำถาม"]').eq(6).type('วันที่มีการทบทวนมาตรการควบคุมภายในล่าสุด');
            cy.get('input[id$="_date"]').type('2025-08-15', { force: true });
            cy.get('textarea[id$="placeholder_description"]').eq(6).type('ทบทวนล่าสุดเมื่อวันที่ 15 สิงหาคม 2025');

        });
    })

});