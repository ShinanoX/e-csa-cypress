describe('2.6 การจัดการ About Internal Control', () => {
    const automatText = {
        sequence: '999',
        subject: 'Test Cypress Automation',
        description: 'นี่คือการทดสอบด้วย Cypress สำหรับการสร้างรายการใหม่ในระบบ Internal Control',
        coverImage: 'cypress/fixtures/image/jjpng.jpg',
        attachment: 'cypress/fixtures/image/document.png'
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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);
    });

    describe('2.6.2 ไม่สามารถใช้งาน การจัดการ About Internal Control ได้', () => {
        it('ADMINICDJUNIOR-SN-77-78-79-80: ไม่สามารถสร้าง About Internal Control ได้ เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย และ อัพโหลดไฟล์ แนบไฟล์ ที่มีขนาดใหญ่เกิน 20 mb', () => {
            cy.get('button').contains('สร้างรายการ').should('be.visible').click();
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-content').within(() => {
                cy.get('button').contains('ยืนยัน').click();
                cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/Mei50MPpng.png', { force: true });
                cy.get('input[accept=""]').selectFile('cypress/fixtures/30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });
                cy.get('#sequence_help > .ant-form-item-explain-error').contains('กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');
                cy.get('#subject_help > .ant-form-item-explain-error').contains('กรุณากรอกข้อมูล');
                cy.get('#description_help > .ant-form-item-explain-error').contains('กรุณากรอกข้อมูล');
            });
        });

        it.only('ADMINICDJUNIOR-SN-81-82-83-84: ไม่สามารถแก้ไข About Internal Control ได้ เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            cy.get('button').contains('Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('edit').click();
            });
            cy.get('.ant-modal-content').within(() => {
                cy.get('#sequence').should('be.visible').type('A').clear();
                cy.get('#subject').should('be.visible').type('A').clear();
                cy.get('#description').should('be.visible').type('A').clear();
                cy.get('.absolute button').contains('span', 'delete').click({ force: true });
                cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/Mei50MPpng.png', { force: true });
                cy.get('.border-red-500').should('exist');
                cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/ppng.png', { force: true });
                cy.get('.absolute button').contains('span', 'delete').click({ force: true });
                cy.get('input[accept=""]').selectFile('cypress/fixtures/30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });
                cy.get('.border-red-500').should('exist');
                // cy.get('button[type="submit"]').contains('ยืนยัน').should('be.visible').click();
            });
            cy.get('#sequence_help').should('contain', 'กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');
            cy.get('#subject_help').should('contain', 'กรุณากรอกข้อมูล');
            cy.get('#description_help').should('contain', 'กรุณากรอกข้อมูล');
        });
    });


});