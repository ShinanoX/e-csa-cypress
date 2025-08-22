describe('Create Assessment', () => {
    const passEvaluationForm = {
        assessment_code: 'BCP_2025_TEST',
        description: 'การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA',
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
    });

    describe('5.2.2 Create Assessment by Draft', () => {
        it('ADMINICDSENIOR-SN-135 : สามารถสร้างแบบประเมินโดยใช้ Draft ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_Test_Edit_For_Draft');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();
            cy.wait(2000);

            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(1)').click();

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

            cy.log('I การควบคุมภายในองค์กร (Control Environment)');
            cy.contains('I การควบคุมภายในองค์กร (Control Environment)').should('be.visible');
            cy.wait(2000);
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

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(2)').click();
            cy.contains('II การประเมินความเสี่ยง (Risk Assessment)').should('be.visible');
            cy.wait(2000);
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

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(3)').click();
            cy.contains('III การควบคุมการปฎิบัติงาน (Control Activities)').should('be.visible');
            cy.wait(2000);
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

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(4)').click();
            cy.contains('IV ระบบสารสนเทศและการสื่อสารข้อมูล (Information & Communication)').should('be.visible');
            cy.wait(2000);
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

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(5)').click();
            cy.contains('V ระบบติดตาม (Monitoring & Activities)').should('be.visible');
            cy.wait(2000);
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

        });
    })
});