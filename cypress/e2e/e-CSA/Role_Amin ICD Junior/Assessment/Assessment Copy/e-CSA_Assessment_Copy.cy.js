describe('e-CSA Assessment Copy', () => {
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

    describe('Modal Copy Assessment', () => {
        it('ตรวจสอบ modal Copy Assessment', () => {
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');

            // ตรวจสอบ title
            cy.get('.ant-modal-title .custom-modal-label').should('contain', 'Copy Assessment');
            cy.wait(1000);

            cy.log('ตรวจสอบช่องค้นหา');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#company').should('be.visible');
                cy.get('#year').should('be.visible');
                cy.get('#assessment_code').should('be.visible');
                cy.get('.ant-select-selection-search > #start_date').should('be.visible');
                cy.get('.ant-select-selection-search > #end_date').should('be.visible');
                cy.contains('button', 'Search').should('be.visible');
                cy.contains('button', 'Reset').should('be.visible');
            });

            cy.wait(1000);
            cy.log('ตรวจสอบตาราง');
            cy.get('.ant-modal-content .ant-table-tbody tr').should('have.length.greaterThan', 0);
            cy.get('.ant-modal-content .ant-table-thead').within(() => {
                cy.contains('th', 'ลำดับ').should('be.visible');
                cy.contains('th', 'บริษัท');
                cy.contains('th', 'ปี');
                cy.contains('th', 'รหัสแบบประเมิน');
                cy.contains('th', 'Assessment');
            });
            cy.wait(1000);
            cy.get('.ant-modal-content').within(() => {
                cy.contains('Search').should('be.visible');
                cy.contains('Reset').should('be.visible');
                cy.contains('ยกเลิก').should('be.visible');
            });
        });


        it.only('ADMINICDSENIOR-SN-136: สามารถสร้างแบบประเมินโดยใช้ Copy Assessment ได้', () => {
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');

            // ตรวจสอบ title
            cy.get('.ant-modal-title .custom-modal-label').should('contain', 'Copy Assessment');
            cy.wait(1000);
            cy.get('.ant-modal-content .ant-table-tbody tr').first().within(() => {
                cy.get('input.ant-radio-input').click({ force: true });
            });
            cy.wait(1000);
            cy.get('.ant-modal-content').within(() => {
                cy.contains('button', 'ยกเลิก').should('be.visible');
                cy.contains('button', 'ถัดไป').should('be.visible').click();
            });

            cy.get('.ant-modal-content').within(() => {
                cy.contains('ตัวอย่างแบบประเมิน').should('be.visible');
            });
            cy.get('.ant-form > .overflow-auto').within(() => {
                cy.contains('การควบคุมภายในองค์กร (Control Environment)').should('be.visible');
            })
            cy.contains('button', 'คัดลอก').should('be.visible').click();

            cy.log('คัดลอกแบบประเมิน')
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').clear().type('BCP_2025_TEST_Copy_Assessment');
                cy.get('#name').clear().type('ทดสอบระบบ Copy แบบประเมิน E-CSA');
                cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');
                cy.get('#start_date').click();
                cy.get('#end_date').click();
                cy.get('#description').clear().type('การทดสอบการ_Copy_แบบประเมินในระบบ E-CSA');
                cy.get('#open_next_round_date').click();
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
                // cy.get('button').contains('ยืนยัน').should('be.visible').click();
            });

        });
    })
})