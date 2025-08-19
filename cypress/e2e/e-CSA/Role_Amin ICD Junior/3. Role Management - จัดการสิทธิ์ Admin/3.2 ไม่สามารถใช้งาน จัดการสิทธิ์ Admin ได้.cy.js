describe('Role Management', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/management/admin-management');
        cy.url().should('include', '/management/admin-management');
        cy.wait(1000);
    });

    describe('3.2 ไม่สามารถใช้งาน จัดการสิทธิ์ Admin ได้', () => {
        it('ADMINICDSENIOR-SN-102: ไม่สามารถสร้าง Admin ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใดๆ เลย', () => {
            cy.get('.card').within(() => {
                cy.get('.pt-4.px-4 > .gap-4 > .rounded-md').contains('สร้างผู้ใช้งาน').click();
            });
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.get('button[type="submit"]').contains('สร้างผู้ใช้งาน').click({ force: true });
                // ตรวจสอบข้อความ error ของแต่ละช่อง
                cy.get('#role_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#initial_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('input#full_name').should('be.disabled');
            });
            cy.get('.flex-col.w-full > .justify-end > .transition-transform').click();
            cy.get('.card').within(() => {
                cy.get('.pt-4.px-4 > .gap-4 > .rounded-md').contains('สร้างผู้ใช้งาน').click();
            });
            cy.get('.ant-form-item-control-input-content > .flex-col > .ant-select > .ant-select-selector > .ant-select-selection-wrap > .ant-select-selection-search > #role').click();
            cy.get('[title="Admin ICD Junior"] > .ant-select-item-option-content').click();
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.wait(2000);
                cy.get('button[type="submit"]').contains('สร้างผู้ใช้งาน').click({ force: true });
                // ตรวจสอบข้อความ error ของแต่ละช่อง
                cy.get('#initial_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#internal_phone_number_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('input#full_name').should('be.disabled');
            });
        });
        it.only('ADMINICDSENIOR-SN-103: ไม่สามารถแก้ไขข้อมูล Admin ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'edit').click();
            });
        })
    });
});