describe('สร้างแบบประเมิน', () => {

    const createAss = {
        cr_assessment_code: 'BCP_ทดสอบการสร้างแบบประเมิน_2',
        cr_name: 'ทดสอบการสร้างแบบประเมิน',
        cr_description: 'ทดสอบการสร้างแบบประเมิน',
    }

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
        it.only('สร้างแบบประเมินสำหรับยกเลิก', () => {
            cy.contains('Create New Assessment').click();
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').clear().type(createAss.cr_assessment_code);
                cy.get('#name').clear().type(createAss.cr_name);
                cy.get('#description').clear().type(createAss.cr_description);
                cy.get('#open_next_round_date').click();
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
                cy.wait(1000);
                cy.get('button[type="submit"]').contains('ยืนยัน').click();

                cy.wait(3000);
            });
            const sectionCount = 1; // กำหนดจำนวน Section ที่ต้องการสร้าง
            const widgetsInSection = [
                'Yes/No',
                'Choice',
                'Checkbox',
                'Text',
                'Rating',
                'Ranking',
                'Date'
            ];

            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }

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

            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(2)').click();
            // cy.contains('II การประเมินความเสี่ยง (Risk Assessment)').should('be.visible');
            // cy.wait(2000);
            // for (let i = 0; i < sectionCount; i++) {
            //     const dataTransfer = new DataTransfer();
            //     cy.contains('Section').trigger('dragstart', { dataTransfer });
            //     cy.wait(1000);
            //     cy.get('.ant-form > .p-4')
            //         .trigger('drop', { dataTransfer, force: true })
            //         .trigger('dragend', { dataTransfer, force: true });
            //     cy.wait(1000);

            //     widgetsInSection.forEach((text) => {
            //         cy.contains(text).first().trigger('dragstart', { dataTransfer });
            //         cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
            //             .last()
            //             .find('.gap-4')
            //             .first()
            //             .trigger('drop', { dataTransfer, force: true })
            //             .trigger('dragend', { dataTransfer, force: true });
            //         cy.wait(1000);
            //     });
            // }

            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(3)').click();
            // cy.contains('III การควบคุมการปฎิบัติงาน (Control Activities)').should('be.visible');
            // cy.wait(2000);
            // for (let i = 0; i < sectionCount; i++) {
            //     const dataTransfer = new DataTransfer();
            //     cy.contains('Section').trigger('dragstart', { dataTransfer });
            //     cy.wait(1000);
            //     cy.get('.ant-form > .p-4')
            //         .trigger('drop', { dataTransfer, force: true })
            //         .trigger('dragend', { dataTransfer, force: true });
            //     cy.wait(1000);

            //     widgetsInSection.forEach((text) => {
            //         cy.contains(text).first().trigger('dragstart', { dataTransfer });
            //         cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
            //             .last()
            //             .find('.gap-4')
            //             .first()
            //             .trigger('drop', { dataTransfer, force: true })
            //             .trigger('dragend', { dataTransfer, force: true });
            //         cy.wait(1000);
            //     });
            // }
            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(4)').click();
            // cy.contains('IV ระบบสารสนเทศและการสื่อสารข้อมูล (Information & Communication)').should('be.visible');
            // cy.wait(2000);
            // for (let i = 0; i < sectionCount; i++) {
            //     const dataTransfer = new DataTransfer();
            //     cy.contains('Section').trigger('dragstart', { dataTransfer });
            //     cy.wait(1000);
            //     cy.get('.ant-form > .p-4')
            //         .trigger('drop', { dataTransfer, force: true })
            //         .trigger('dragend', { dataTransfer, force: true });
            //     cy.wait(1000);

            //     widgetsInSection.forEach((text) => {
            //         cy.contains(text).first().trigger('dragstart', { dataTransfer });
            //         cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
            //             .last()
            //             .find('.gap-4')
            //             .first()
            //             .trigger('drop', { dataTransfer, force: true })
            //             .trigger('dragend', { dataTransfer, force: true });
            //         cy.wait(1000);
            //     });
            // }

            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(5)').click();
            // cy.contains('V ระบบติดตาม (Monitoring & Activities)').should('be.visible');
            // cy.wait(2000);
            // for (let i = 0; i < sectionCount; i++) {
            //     const dataTransfer = new DataTransfer();
            //     cy.contains('Section').trigger('dragstart', { dataTransfer });
            //     cy.wait(1000);
            //     cy.get('.ant-form > .p-4')
            //         .trigger('drop', { dataTransfer, force: true })
            //         .trigger('dragend', { dataTransfer, force: true });
            //     cy.wait(1000);

            //     widgetsInSection.forEach((text) => {
            //         cy.contains(text).first().trigger('dragstart', { dataTransfer });
            //         cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
            //             .last()
            //             .find('.gap-4')
            //             .first()
            //             .trigger('drop', { dataTransfer, force: true })
            //             .trigger('dragend', { dataTransfer, force: true });
            //         cy.wait(1000);
            //     });
            // }

        });

    })

});