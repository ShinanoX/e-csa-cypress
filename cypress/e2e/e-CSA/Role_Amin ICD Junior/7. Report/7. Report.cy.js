describe('Report', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/report');
        cy.url().should('include', '/report');
        cy.wait(2000);
    });

    describe('7. Report', () => {
        it('ADMINICDJUNIOR-SN-222: ตรวจสอบรายการรายงานทั้งหมด', () => {
            const reportTitles = [
                '1. คำตอบแบบประเมินความเพียงพอของระบบการควบคุมภายใน',
                '2. สรุปความเห็นเกี่ยวกับระบบการควบคุมภายในแต่ละองค์ประกอบ',
                '3. สรุปจำนวนคำตอบใช่-ไม่ใช่ ในแบบประเมินความเพียงพอของระบบการควบคุมภายใน',
                '4. สรุปความเห็นเกี่ยวกับระบบการควบคุมภายใน (เปรียบเทียบปี X กับปี Y) เพื่อใช้ทำรายงาน 56-1',
                '5. รายงานการควบคุมที่ควรปรับปรุง (ตอบ ไม่ใช่) แผนการปรับปรุง และรายงานการติดตาม',
                '6. รายชื่อหน่วยงานที่ประเมินชื่อผู้ประเมินและผู้จัดทำแบบประเมินความเพียงพอของระบบการควบคุมภายใน',
                '7. รายงานสถานะการตอบแบบประเมิน',
                '8. รายงานแสดงการกำหนดค่า Config ในการตอบแบบประเมิน'
            ];

            reportTitles.forEach(title => {
                cy.contains(title).should('be.visible');
            });
        });

        it('ADMINICDJUNIOR-SN-223/224/225: สามารถดาวน์โหลด Report ได้ด้วยไฟล์ .pdf/excel/word', () => {
            cy.get('.p-4.flex-col > .flex-col > :nth-child(1)')
                .contains('1. คำตอบแบบประเมินความเพียงพอของระบบการควบคุมภายใน')
                .should('be.visible')
                .click();
            cy.get('[title="Download as PDF"]').click();
            cy.get('[title="Download as Word"]').click();
            cy.get('[title="Download as Excel"]').click();

        });
        it.only('ADMINICDJUNIOR-SN-226/227: Search หา Report ได้/สามารถ Clear ข้อมูลที่ Search ได้', () => {
            cy.get('.p-4.flex-col > .flex-col > :nth-child(1)')
                .contains('1. คำตอบแบบประเมินความเพียงพอของระบบการควบคุมภายใน')
                .should('be.visible')
                .click();
            cy.wait(3000)
            cy.get('#question').type('q1');
            cy.get('.bg-white\\/90').within(() => {
                cy.contains('search').click();
                cy.wait(3000);
                cy.contains('Reset').click();
            });
        });
    });

});
