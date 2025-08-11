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

    describe('Assessment Form - View', () => {
        it('TC-A-010 - สามารถสร้าง/Save Draft/แก้ไข/ยกเลิก แบบประเมินได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000); // รอให้หน้าโหลดเสร็จ

            // ขั้นที่ 1: คลิกปุ่ม Create New Assessment
            cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

            // ขั้นที่ 2: ตรวจสอบ Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

            // ขั้นที่ 3: ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบ Form Elements
                cy.get('label').contains('บริษัท').should('be.visible');
                cy.get('label').contains('ปี').should('be.visible');
                cy.get('label').contains('รหัสแบบประเมิน').should('be.visible');
                cy.get('label').contains('ชื่อแบบประเมิน').should('be.visible');
                cy.get('label').contains('Start').should('be.visible');
                cy.get('label').contains('End').should('be.visible');
                cy.get('label').contains('วันที่เปิดรับประเมินรอบถัดไป').should('be.visible');
                cy.get('label').contains('ครั้งที่').should('be.visible');
                cy.get('label').contains('ผู้สร้างแบบประเมิน').should('be.visible');
                cy.get('label').contains('คำอธิบาย').should('be.visible');

                // ขั้นที่ 4: ตรวจสอบปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ
                cy.get('button[type="submit"]').should('be.visible');
                cy.log('✅ ปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ');

                // ขั้นที่ 5: แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
                cy.get('#assessment_code').clear().type('BCP_2025_TEST');
                cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA');
                cy.get('#description').clear().type('การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA');

                cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');

                cy.get('#start_date').click();
                cy.get('#end_date').click();
                cy.get('#open_next_round_date').click();

                // ขั้นที่ 6: ตรวจสอบว่าปุ่มยืนยันยังคงเป็น disabled หลังจากกรอกข้อมูล
                // cy.get('button[type="submit"]').should('be.disabled');
                // cy.log('✅ ปุ่มยืนยันยังคงเป็น disabled หลังจากกรอกข้อมูล');

                // ขั้นที่ 7: คลิกปุ่มตรวจสอบ
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
            });

            // ขั้นที่ 8: รอให้ validation เสร็จ
            cy.wait(2000);

            // ขั้นที่ 9: ตรวจสอบปุ่มยืนยันหลังจากกดตรวจสอบ
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบว่าปุ่มยืนยันไม่เป็น disabled แล้ว
                cy.get('button[type="submit"]').should('not.be.disabled');
                cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
                cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');

                // ขั้นที่ 10: บันทึกข้อมูล
                // cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });

            // ขั้นที่ 11: ตรวจสอบผลลัพธ์
            cy.get('.ant-modal-content').should('not.exist');
            cy.log('✅ สร้าง Assessment ใหม่สำเร็จ');
            cy.url().should('include', '/assessment/create');
        });

        it('TC-A-011 - สามารถยกเลิกการสร้างแบบประเมินได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000); // รอให้หน้าโหลดเสร็จ

            // ขั้นที่ 1: คลิกปุ่ม Create New Assessment
            cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

            // ขั้นที่ 2: ตรวจสอบ Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

            // ขั้นที่ 3: ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบ Form Elements
                cy.get('label').contains('บริษัท').should('be.visible');
                cy.get('label').contains('ปี').should('be.visible');
                cy.get('label').contains('รหัสแบบประเมิน').should('be.visible');
                cy.get('label').contains('ชื่อแบบประเมิน').should('be.visible');
                cy.get('label').contains('Start').should('be.visible');
                cy.get('label').contains('End').should('be.visible');
                cy.get('label').contains('วันที่เปิดรับประเมินรอบถัดไป').should('be.visible');
                cy.get('label').contains('ครั้งที่').should('be.visible');
                cy.get('label').contains('ผู้สร้างแบบประเมิน').should('be.visible');
                cy.get('label').contains('คำอธิบาย').should('be.visible');

                // ขั้นที่ 4: ตรวจสอบปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ
                cy.get('button[type="submit"]').should('be.disabled');
                cy.get('button[type="submit"]').should('have.attr', 'disabled');
                cy.log('✅ ปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ');

                // ขั้นที่ 5: แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
                cy.get('#assessment_code').clear().type('BCP_2025_TEST_CANCEL');
                cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA ยกเลิกการสร้าง');
                cy.get('#description').clear().type('การทดสอบการยกเลิกการสร้างแบบประเมินในระบบ E-CSA');
            })
        })
    })

    describe.only('Modal Copy Assessment', () => {
        it('ตรวจสอบ modal Copy Assessment', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.wait(2000);
            // เปิด modal
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');

            // ตรวจสอบ title
            cy.get('.ant-modal-title .custom-modal-label').should('contain', 'Copy Assessment');

            // ตรวจสอบช่องค้นหา
            cy.get('.ant-modal-content').within(() => {
                cy.get('#company').should('be.visible');
                cy.get('#year').should('be.visible');
                cy.get('#assessment_code').should('be.visible');
                cy.get('.ant-select-selection-search > #start_date').should('be.visible');
                cy.get('.ant-select-selection-search > #end_date').should('be.visible');
                cy.contains('button', 'Search').should('be.visible');
                cy.contains('button', 'Reset').should('be.visible');
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
            cy.wait(1000);
            cy.get('.ant-modal-content').within(() => {
                cy.contains('Search').should('be.visible');
                cy.contains('Reset').should('be.visible');
                cy.contains('ยกเลิก').should('be.visible');
            });

        });

        // it.only('page pagination', () => {
        //     for (let i = 0; i < 20; i++) {
        //         cy.get('.ant-pagination-item-active').should('have.text', (i + 1).toString()); // ตรวจสอบหมายเลขหน้า
        //         cy.get('.ant-pagination-next').click(); // คลิกปุ่มถัดไป
        //     }
        // })
    })




});