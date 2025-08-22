describe('Assessment', () => {
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
        cy.wait(3000);
    })

    describe('5.1 Assessment Form', () => {
        it('ADMINICDJUNIOR-SN-130: สามารถดูรายการแบบประเมินได้', () => {
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.material-symbols-outlined').eq(0).click();
            });
            // ตรวจสอบข้อมูลใน expanded row ที่แสดงออกมา
            cy.get('.ant-table-tbody tr.ant-table-expanded-row').first().within(() => {
                cy.get('table').within(() => {
                    cy.get('tbody tr.border-t').first().within(() => {
                        cy.get('td').eq(0).should('not.be.empty'); // ลำดับ
                        cy.get('td').eq(1).should('not.be.empty'); // หน่วยงาน
                        cy.get('td').eq(2).should('not.be.empty'); // ชื่อผู้ประเมิน
                        cy.get('td').eq(3).should('not.be.empty'); // Role
                        cy.get('td').eq(4).should('not.be.empty'); // จำนวนข้อที่ต้องประเมิน
                        cy.get('td').eq(5).should('not.be.empty'); // เวลาที่ Assign
                        cy.get('td').eq(6).should('not.be.empty'); // สถานะ
                        cy.get('td').eq(7).should('not.be.empty'); // Action
                    });
                });
            });
        });

        it.only('ADMINICDJUNIOR-SN-131: สามารถดูแบบประเมินได้', () => {
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').eq(1).click();
            });
            cy.wait(2000);

            // ตรวจสอบหัวข้อหลัก
            cy.get('.relative > .flex-col.sm\\:gap-4 > :nth-child(1) > :nth-child(1) > .font-bold').contains('Assessment Date', { timeout: 10000 }).should('be.visible');
            cy.get('.flex-col.sm\\:gap-4 > :nth-child(2) > :nth-child(1) > .font-bold').contains('Work List ประจำปี', { timeout: 10000 }).should('be.visible');
            cy.get('.p-4 > .font-bold').contains('รายการผู้ประเมิน', { timeout: 10000 }).should('be.visible');
            cy.get('.flex-col.sm\\:gap-4 > :nth-child(4) > :nth-child(1) > .font-bold').contains('Activity Log', { timeout: 10000 }).should('be.visible');
            cy.get('.flex.gap-4 > .font-bold').contains('ข้อมูล', { timeout: 10000 }).should('be.visible');
        })

        it('ADMINICDJUNIOR-SN-132: สามารถค้นหาแบบประเมินได้', () => {
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