describe('e-CSA Master Data Portal Page', () => {
    const portalName = 'Test Required create Fields Portal';
    const portalDescription = 'ทดสอบ Required create Fields สำหรับการสร้าง Portal';

    const modalTitle = 'ทดสอบแก้ไข โดย Cypress';
    const modalDescription = 'ทดสอบแก้ไขรายละเอียด โดย Cypress';

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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
        cy.url().should('include', '/master-data/portal');
        cy.wait(3000);
    });

    describe('2.5.2 ไม่สามารถใช้งาน การจัดการ Portal ได้', () => {
        it('ADMINICDJUNIOR-SN-59: ตรวจสอบ validation ทุกช่องในฟอร์มสร้าง Portal', () => {
            cy.log('➕ เปิด Modal สร้าง Portal');
            cy.get('button').contains('สร้าง Portal').should('be.visible').click();
            cy.get('.ant-modal-content').should('be.visible');

            cy.log('❌ ทดสอบส่งฟอร์มโดยไม่กรอกข้อมูล');
            cy.get('.ant-modal-content').within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });

            // ตรวจสอบข้อความ error ของแต่ละช่อง
            cy.get('#sequence_help').should('contain', 'กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');
            cy.get('#subject_help').should('contain', 'กรุณากรอกข้อมูล');
            cy.get('#description_help').should('contain', 'กรุณากรอกข้อมูลที่ต้องการสื่อสารกับผู้ประเมิน');
            cy.get('#link_help').should('contain', 'กรุณากรอกข้อมูล');
            cy.get('#image_form_help').should('contain', 'กรุณาแนบรูปหน้าปก');

            cy.log('❌ ทดสอบกรอกข้อมูลผิด/ไม่ครบ');
            // กรอกข้อมูลผิดบางช่อง
            cy.get('input#sequence').type('0'); // สมมติว่าต้องมากกว่า 0
            cy.get('textarea#subject').type(''); // ไม่กรอก
            cy.get('textarea#description').type(''); // ไม่กรอก
            cy.get('input#link').type('ไม่ใช่ลิงก์'); // สมมติว่าต้องเป็น URL
            // ไม่แนบไฟล์

            cy.get('.ant-modal-content').within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });

            // ตรวจสอบ error เฉพาะช่องที่ยังผิด
            cy.get('#subject_help').should('contain', 'กรุณากรอกข้อมูล');
            cy.get('#description_help').should('contain', 'กรุณากรอกข้อมูลที่ต้องการสื่อสารกับผู้ประเมิน');
            cy.get('#link_help').should('contain', 'กรุณากรอกข้อมูล');
            cy.get('#image_form_help').should('contain', 'กรุณาแนบรูปหน้าปก');
        });

        it('ADMINICDJUNIOR-SN-60, ADMINICDJUNIOR-SN-61: สามารถดาวน์โหลดรูปหน้าปก Portal ได้', () => {
            cy.get('button').contains('สร้าง Portal').should('be.visible').click();
            cy.wait(1000);
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.custom-modal-label').should('contain', 'สร้าง Portal');
            cy.get('.ant-modal-content').within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });
            cy.wait(1000);
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-content').within(() => {
                cy.get('input[accept=".jpg,.jpeg"]').selectFile('cypress\\fixtures\\image\\Mei50MPpng.png', { force: true });
                cy.get('.justify-end > .border-zinc-300').should('be.visible');
            });

        });
    });

});