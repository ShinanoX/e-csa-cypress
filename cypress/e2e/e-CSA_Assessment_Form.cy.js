describe('Assessment', () => {
    beforeEach('', () => {
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
        cy.get('.hidden > :nth-child(3)').click(); // คลิกเมนู Assessment
        cy.get('.gap-1 > .flex > .text-left > .text-\\[\\#64748B\\]').should('have.text', 'Admin ICD Junior').should('be.visible');
    })


    it('ตรวจสอบ modal Copy Assessment', () => {
        // เปิด modal
        cy.get('.p-4 > .gap-4 > .bg-white').click();
        cy.get('.ant-modal-content').should('be.visible');

        // ตรวจสอบ title
        cy.get('.ant-modal-title .custom-modal-label').should('contain', 'Copy Assessment');

        // ตรวจสอบช่องค้นหา
        cy.get('.ant-modal-content').within(() => {
            cy.get('#company').should('exist');
            cy.get('#year').should('exist');
            cy.get('#assessment_code').should('exist');
            cy.get('#start').should('exist');
            cy.get('#end').should('exist');
            cy.contains('button', 'Search').should('exist');
            cy.contains('button', 'Reset').should('exist');
        });

        // ตรวจสอบตาราง
        cy.get('.ant-modal-content .ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.get('.ant-modal-content .ant-table-thead').within(() => {
            cy.contains('th', 'บริษัท');
            cy.contains('th', 'ปี');
            cy.contains('th', 'รหัสแบบประเมิน');
            cy.contains('th', 'Assessment');
        });
        // ตรวจสอบปุ่มยืนยัน/ยกเลิก
        cy.get('.ant-modal-content').within(() => {
            cy.contains('button', 'ยืนยัน').should('exist');
            cy.contains('button', 'ยกเลิก').should('exist');
        });
        cy.get('.flex.p-4 > .bg-white').click(); // ปิด modal
    });

    it.only('page pagination', () => {
        for (let i = 0; i < 20; i++) {
            cy.get('.ant-pagination-item-active').should('have.text', (i + 1).toString()); // ตรวจสอบหมายเลขหน้า
            cy.get('.ant-pagination-next').click(); // คลิกปุ่มถัดไป
        }
    })

});