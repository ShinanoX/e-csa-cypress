describe('Assessment', () => {
    beforeEach('', () => {
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
        cy.get('.hidden > :nth-child(3)').click(); // คลิกเมนู Assessment
        cy.get('.gap-1 > .flex > .text-left > .text-\\[\\#64748B\\]').should('have.text', 'Admin ICD Junior').should('be.visible');
    })

    describe('Assessment Form', () => {
        it('TC-A-002 - สามารถใช้ Search หาแบบประเมินได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.wait(3000);
            cy.get('.bg-white\\/90').should('be.visible');

            // ค้นหาข้อมูลบริษัท
            cy.log('เทสกรอกข้อมูลค้นหา บริษัท');
            cy.get('#company').type('BCP');
            cy.contains('button', 'Search').click();

            // ตรวจสอบข้อมูลแถวแรก
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('td').eq(1).should('contain', 'BCP'); // คอลัมน์บริษัท
            });
            cy.wait(3000)
            cy.get('#company').clear();

            // กรอกปีในช่องค้นหา
            cy.get('#year').type('2025');
            cy.contains('button', 'Search').click();
            cy.get('#year').clear();

            // ตรวจสอบข้อมูลแถวแรกว่ามีปี 2025
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('td').eq(2).should('contain', '2025'); // คอลัมน์ปี (index 2)
            });

            // กรอกรหัสแบบประเมินในช่องค้นหา
            cy.get('#assessment_code').type('BCP_2019_001');
            cy.contains('button', 'Search').click();

            // ตรวจสอบว่าตารางมีข้อมูลแสดง
            cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

            // ตรวจสอบข้อมูลแถวแรกว่ามีรหัสแบบประเมินที่ค้นหา
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('td').eq(3).should('contain', 'BCP_2019_001'); // คอลัมน์รหัสแบบประเมิน (index 3)
            });
            cy.log('คลิกปุ่ม Reset');
            cy.get('.gap-4 > .gap-2 > [type="button"]').should('be.visible').click(); // คลิกปุ่ม Reset
        });
    });
});