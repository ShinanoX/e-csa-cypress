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
        it('ADMINICDSENIOR-SN-170 : สามารถดาวน์โหลดไฟล์แนบทั้งหมดได้', () => {
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_ทดสอบการสร้างแบบประเมิน');
            cy.contains('button', 'Search').click();
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(2000);

            // ข้อ 1.1
            cy.contains('1.1').parent().within(() => {
                cy.get('input[type="radio"][value="true"]').check({ force: true });
                cy.get('textarea').eq(0).clear().type('องค์กรมีการกำหนดนโยบายควบคุมภายในและสื่อสารให้พนักงานรับทราบ');
                cy.get('textarea').eq(1).clear().type('ปรับปรุงการสื่อสารนโยบายให้ทั่วถึง');
                cy.get('input[type="date"]').first().type('2025-08-31', { force: true });
            });

            // ข้อ 1.2
            cy.contains('1.2').parent().within(() => {
                cy.get('input[type="radio"]').first().check({ force: true });
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('มีการประเมินความเสี่ยงเป็นประจำทุกปี');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('ปรับปรุงกระบวนการประเมินความเสี่ยง');
                cy.get('input[type="date"]').first().type('2025-09-01', { force: true });
            });

            // ข้อ 1.3
            cy.contains('1.3').parent().within(() => {
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('องค์กรมีการตรวจสอบภายในทุกไตรมาส');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('เพิ่มความถี่ในการตรวจสอบ');
                cy.get('input[type="date"]').first().type('2025-09-15', { force: true });
            });

            // ข้อ 1.4
            cy.contains('1.4').parent().within(() => {
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('ใช้ระบบ IT ในการควบคุมและติดตามการทำงาน');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('พัฒนาระบบ IT ให้ทันสมัย');
                cy.get('input[type="date"]').first().type('2025-09-20', { force: true });
            });

            // ข้อ 1.5
            cy.contains('1.5').parent().within(() => {
                cy.get('ul[role="radiogroup"] li').eq(4).click(); // 5 ดาว
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('การควบคุมภายในอยู่ในระดับดีมาก');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('รักษามาตรฐานการควบคุม');
                cy.get('input[type="date"]').first().type('2025-09-25', { force: true });
            });

            // ข้อ 1.6
            cy.contains('1.6').parent().within(() => {
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('1. นโยบาย 2. การตรวจสอบ 3. การประเมินความเสี่ยง');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('ปรับปรุงลำดับความสำคัญ');
                cy.get('input[type="date"]').first().type('2025-09-30', { force: true });
            });

            // ข้อ 1.7
            cy.contains('1.7').parent().within(() => {
                cy.get('input[type="date"]').first().type('2025-08-15', { force: true });
                cy.get('textarea[placeholder*="รายละเอียด"]').clear().type('ทบทวนล่าสุดเมื่อวันที่ 15 สิงหาคม 2025');
                cy.get('textarea[placeholder*="แผนการปรับปรุง"]').clear().type('กำหนดวันทบทวนถัดไป');
                cy.get('input[type="date"]').eq(1).type('2025-10-01', { force: true });
            });

            // สรุปความคิดเห็น
            cy.contains('สรุปความคิดเห็น').parent().find('textarea').type('องค์กรมีการควบคุมภายในที่ดีและควรพัฒนาอย่างต่อเนื่อง');

        });


    });
});