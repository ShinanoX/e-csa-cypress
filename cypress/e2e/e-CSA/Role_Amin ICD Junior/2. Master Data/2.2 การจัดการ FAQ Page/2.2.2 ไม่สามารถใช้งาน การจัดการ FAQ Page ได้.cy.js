describe('FAQ Page', () => {
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
    });

    describe('2.2.2 ไม่สามารถใช้งาน การจัดการ FAQ Page ได้', () => {
        it('ADMINICDJUNIOR-SN-30 ไม่สามารถสร้าง FAQ ได้ เนื่องจากกรอกรายละเอียดไม่ครบ', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกสร้าง FAQ
            cy.get('button').contains('สร้าง FAQ').click();
            cy.wait(1000);

            // ตรวจสอบและทำงานใน modal สร้าง FAQ โดยไม่กรอกข้อมูล
            cy.contains('.ant-modal-content', 'สร้าง FAQ').within(() => {
                // ตรวจสอบ modal แสดงขึ้น
                cy.get('.custom-modal-label').should('contain', 'สร้าง FAQ');

                cy.get('#sequence').clear().type('100').clear();
                // กรอกคำถามเรื่อง
                cy.get('#question').type('คำถาม').clear();
                // กรอกคำตอบ
                cy.get('#answer').type('บทความ').clear();

                // ตรวจสอบว่าแสดง error message
                cy.get('#sequence_help .ant-form-item-explain-error').should('contain', 'กรุณาใส่ตัวเลข');
                cy.get('#question_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#answer_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

                cy.get('button[type="submit"]')
                    .should('be.disabled')
                    .should('have.class', 'bg-[#F3F4F6]')
                    .should('have.class', 'text-[#D1D5DB]')
                    .should('have.css', 'cursor', 'not-allowed');

                // คลิกยกเลิก
                // cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบ validation ไม่สามารถสร้าง FAQ ได้สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-31 ไม่สามารถแก้ไข FAQ ได้ เนื่องจากกรอกรายละเอียดไม่ครบ', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกแก้ไข FAQ แรกที่เจอ
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').find('span').contains('edit').click();
            });

            // ตรวจสอบและทำงานใน modal แก้ไข FAQ โดยเคลียร์ข้อมูลทั้งหมด
            cy.contains('.ant-modal-content', 'แก้ไข FAQ').within(() => {
                // ตรวจสอบ modal แสดงขึ้น
                cy.get('.custom-modal-label').should('contain', 'แก้ไข FAQ');

                // เคลียร์ข้อมูลทั้งหมด
                cy.get('#sequence').clear();
                cy.get('#question').clear();
                cy.get('#answer').clear();

                // ตรวจสอบว่าปุ่มยืนยันถูก disable
                cy.get('button[type="submit"]').should('be.disabled');

                // ตรวจสอบว่าแสดง error message
                cy.get('#sequence_help .ant-form-item-explain-error').should('contain', 'กรุณาใส่ตัวเลข');
                cy.get('#question_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#answer_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

                // คลิกยกเลิก
                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบ validation ไม่สามารถแก้ไข FAQ ได้สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-32 ไม่สามารถสร้าง FAQ ได้ เนื่องจากแนบไฟล์ขนาดใหญ่กว่า 20 MB', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกสร้าง FAQ
            cy.get('button').contains('สร้าง FAQ').click();
            cy.wait(1000);

            cy.contains('.ant-modal-content', 'สร้าง FAQ').within(() => {
                // กรอกข้อมูลให้ครบ
                cy.get('#sequence').type('100');
                cy.get('#question').type('Test Large File');
                cy.get('#answer').type('Testing large file upload');
                cy.wait(3000);

                // อัพโหลดไฟล์ขนาดใหญ่ (สำหรับการทดสอบ - ใช้ไฟล์ที่มีอยู่แทน)
                cy.get('input[type="file"]').selectFile('cypress/fixtures/30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });

                // ตรวจสอบว่าไฟล์แสดงเป็นสีแดง (ไฟล์ขนาดใหญ่เกินกำหนด)
                cy.get('.text-red-500').should('exist');

                // ตรวจสอบว่ามีปุ่มลบไฟล์ (delete button) แสดงเป็นสีแดง
                cy.get('button.text-red-500').should('be.visible');

                // ตรวจสอบว่าปุ่มยืนยันยัง disabled อยู่เนื่องจากไฟล์ขนาดใหญ่เกินกำหนด
                cy.get('button[type="submit"]')
                    .should('be.disabled')
                    .should('have.class', 'bg-[#F3F4F6]')
                    .should('have.class', 'text-[#D1D5DB]')
                    .should('have.css', 'cursor', 'not-allowed');

                // คลิกปุ่มลบไฟล์ที่มีปัญหา
                cy.get('button.text-red-500').click();
                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบไม่สามารถอัพโหลดไฟล์ขนาดใหญ่สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-33 ไม่สามารถแก้ไข FAQ ได้ เนื่องจากแนบไฟล์ขนาดใหญ่กว่า 20 MB', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกแก้ไข FAQ แรกที่เจอ
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').find('span').contains('edit').click();
            });

            cy.contains('.ant-modal-content', 'แก้ไข FAQ').within(() => {
                // อัพโหลดไฟล์ขนาดใหญ่
                cy.get('input[type="file"]').selectFile('cypress/fixtures/30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });

                // ตรวจสอบว่าปุ่มยืนยันยัง disabled อยู่
                cy.get('button[type="submit"]').should('be.disabled');

                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบไม่สามารถอัพโหลดไฟล์ขนาดใหญ่ในการแก้ไขสำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-34 ไม่สามารถสร้าง FAQ ได้ เนื่องจากกรอกลำดับด้วยตัวอักษร', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกสร้าง FAQ
            cy.get('button').contains('สร้าง FAQ').click();
            cy.wait(1000);

            cy.contains('.ant-modal-content', 'สร้าง FAQ').within(() => {
                // กรอกลำดับด้วยตัวอักษร
                cy.get('#sequence').type('ABC{enter}');
                cy.wait(3000);

                // ตรวจสอบว่าแสดง error message
                cy.get('#sequence_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');

                // ตรวจสอบว่าปุ่มยืนยันถูก disable
                cy.get('button[type="submit"]').should('be.disabled');

                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบ validation ลำดับด้วยตัวอักษรสำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-35 ไม่สามารถแก้ไข FAQ ได้ เนื่องจากกรอกลำดับด้วยตัวอักษร', () => {
            // เข้าหน้า FAQ
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            // คลิกแก้ไข FAQ แรกที่เจอ
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').find('span').contains('edit').click();
            });

            cy.contains('.ant-modal-content', 'แก้ไข FAQ').within(() => {
                // เคลียร์และกรอกลำดับด้วยตัวอักษร
                cy.get('#sequence').clear().type('XYZ{enter}');

                // ตรวจสอบว่าแสดง error message
                cy.get('#sequence_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');

                // ตรวจสอบว่าปุ่มยืนยันถูก disable
                cy.get('button[type="submit"]').should('be.disabled');

                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('ตรวจสอบ validation ลำดับด้วยตัวอักษรในการแก้ไขสำเร็จ');
        });
    });

});