describe('2.6 การจัดการ About Internal Control', () => {
    const automatText = {
        sequence: '999',
        subject: 'Test Cypress Automation',
        description: 'นี่คือการทดสอบด้วย Cypress สำหรับการสร้างรายการใหม่ในระบบ Internal Control',
        coverImage: 'cypress/fixtures/image/jjpng.jpg',
        attachment: 'cypress/fixtures/image/document.png'
    }
    const editText = {
        sequence: '888',
        subject: 'Test Cypress Automation Edit',
        description: 'การทดสอบด้วย Cypress สำหรับการแก้ไขรายการในระบบ Internal Control',
    }

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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);
    });

    describe('2.6.1 สามารถใช้งาน การจัดการ About Internal Control ได้', () => {
        it('ADMINICDJUNIOR-SN-65: สามารถดูรายการ About Internal Control ได้', () => {
            // ตรวจสอบหัวข้อหน้า
            cy.get('.text-neutral-800').should('contain', 'การจัดการ');
            cy.get('.text-\\[\\#4CB847\\]').should('contain', 'About Internal Control');

            // ตรวจสอบตารางข้อมูล
            cy.get('.ant-table-wrapper').should('be.visible');
            cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
            cy.log('✅ เข้าสู่หน้า Master Data - Internal Control สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-66: สามารถสร้าง About Internal Control ได้', () => {
            // คลิกปุ่มสร้างรายการ
            cy.get('button').contains('สร้างรายการ').should('be.visible').click();

            // ตรวจสอบว่า Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'สร้างรายการ About Internal Control');
            cy.log('📝 กรอกข้อมูลในฟอร์ม');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#sequence').should('be.visible').clear().type(automatText.sequence);
                cy.get('#subject').should('be.visible').clear().type(automatText.subject);
                cy.get('#description').should('be.visible').clear().type(automatText.description);
                cy.get('input[accept=".jpeg,.jpg"]').selectFile(automatText.coverImage, { force: true });
            });
            cy.wait(1000);
            cy.get('.custom-modal-label').contains('ครอปรูปภาพ')
                .closest('.ant-modal-content')
                .within(() => {
                    cy.get('.ReactCrop__drag-handle.ord-se') //จุดที่มุมล่างขวา
                        .trigger('pointerdown', { pointerId: 1 })
                        .wait(100)
                        .trigger('pointermove', { pointerId: 1, clientX: 1400, clientY: 1000 })
                        .wait(100)
                        .trigger('pointerup', { pointerId: 1 });
                    cy.get('.ReactCrop__drag-handle.ord-nw') //จุดที่มุมบนซ้าย
                        .trigger('pointerdown', { pointerId: 1 })
                        .wait(100)
                        .trigger('pointermove', { pointerId: 1, clientX: 0, clientY: 0 })
                        .wait(100)
                        .trigger('pointerup', { pointerId: 1 });
                    // ยืนยันการ crop
                    cy.get('button').contains('ยืนยัน').click();
                    cy.wait(1000);
                });
            cy.log('📎 อัพโหลดไฟล์แนบ');

            // อัพโหลดไฟล์แนบ (ใช้ไฟล์รูปเดียวกัน)
            cy.get('input[accept=""]').selectFile('cypress/fixtures/image/document.png', { force: true });
            cy.wait(2000);

            cy.log('✅ ยืนยันการสร้างรายการ');
            cy.get('.ant-form > .justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').should('be.visible').click();
            cy.wait(1000);
            // ตรวจสอบว่า Modal ยืนยัน
            cy.get('.gap-6').should('be.visible').within(() => {
                cy.get('.flex-1 > .justify-center').should('contain', automatText.subject);
                cy.get('.w-full > .flex').click();
            });

            // // ใช้ฟีเจอร์ค้นหาเพื่อหารายการที่สร้างใหม่
            // cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            // cy.get('button').contains('Search').click();
            // cy.wait(4000);

            // // ตรวจสอบผลลัพธ์การค้นหา
            // cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
            // cy.get('.ant-table-tbody tr').first().should('contain', 'Test Cypress Automation');

            // // ตรวจสอบข้อมูลในแถวที่พบ
            // cy.get('.ant-table-tbody tr').first().within(() => {
            //     // cy.get('td').eq(0).should('contain', '999'); // ลำดับ
            //     cy.get('td').eq(1).should('contain', 'Test Cypress Automation'); // ชื่อเรื่อง
            //     cy.get('td').eq(2).should('contain', 'นี่คือการทดสอบด้วย Cypress'); // รายละเอียด
            //     cy.get('.ant-switch').should('have.attr', 'aria-checked', 'false'); // สถานะปิดใช้งาน
            // });

            // // Reset การค้นหาเพื่อกลับสู่สถานะเดิม
            // cy.get('button').contains('Reset').click();
            // cy.log('✅ สร้างและค้นหารายการใหม่สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-67: สามารถแก้ไข About Internal Control ได้', () => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            cy.get('button').contains('Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('edit').click();
            });

            cy.get('.ant-modal-content').within(() => {
                cy.get('#sequence').should('be.visible').clear().type(editText.sequence);
                cy.get('#subject').should('be.visible').clear().type(editText.subject);
                cy.get('#description').should('be.visible').clear().type(editText.description);
                cy.get('button[type="submit"]').contains('ยืนยัน').should('be.visible').click();
            });

            cy.get('.gap-6').should('be.visible').within(() => {
                cy.get('.flex-1 > .justify-center').should('contain', editText.subject);
                cy.get('.w-full > .flex').click();
            });
        });

        it('ADMINICDJUNIOR-SN-68: สามารถลบ About Internal Control ได้', () => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            cy.get('button').contains('Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('delete').click();
            });
            cy.get('.gap-6').should('be.visible').within(() => {
                cy.wait(1000);
                // cy.get('.flex-1 > .justify-center').should('contain', automatText.subject);
                cy.get('.flex > button[type="button"]:nth-child(1)').contains('ยืนยัน').should('be.visible')
                // .click();
                cy.get('.flex > button[type="button"]:nth-child(2)').contains('ยกเลิก').should('be.visible')
                    .click();
            });
        });

        it('ADMINICDJUNIOR-SN-69: สามารถดูรูปภาพ About Internal Control จากหน้า About Internal Control ทั้งหมดได้ + ADMINICDJUNIOR-SN-71: สามารถดาวน์โหลดรูปภาพ About Internal Control ได้', () => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('image').click();
            });
            cy.wait(1000);
            cy.get('.ant-modal-content').within(() => {
                cy.get('img').should('be.visible'); // ตรวจสอบว่ารูปภาพแสดงขึ้น
                cy.get('button[type="button"] >.truncate').contains('ดาวน์โหลด').should('be.visible').click(); // ปุ่มดาวน์โหลด
                cy.wait(2000);
                cy.get('.ant-modal-close-x').click();
            });
        });

        it('ADMINICDJUNIOR-SN-73: สามารถเปิด/ปิดใช้งาน About Internal Control ได้ และ ADMINICDJUNIOR-SN-74: สามารถปิดการใช้งาน About Internal Control ได้', () => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('.ant-switch').then(($switch) => {
                        const isChecked = $switch.hasClass('ant-switch-checked');
                        cy.log(`Switch สถานะ: ${isChecked ? 'เปิด' : 'ปิด'}`);
                        // คลิก Switch
                        cy.wrap($switch).click();
                        cy.wait(1000);
                        cy.wrap($switch).then(($newSwitch) => {
                            const newState = $newSwitch.hasClass('ant-switch-checked');
                            cy.log(`Switch สถานะใหม่: ${newState ? 'เปิด' : 'ปิด'}`);
                            cy.wrap($newSwitch).click();
                        });
                    });
                });
                return false;
            });
        });

        it('ADMINICDJUNIOR-SN-75: สามารถ Search หา About Internal Control ได้', () => {
            //ค้นหา About Internal Control
            cy.get('#subject').should('be.visible').clear().type(automatText.subject);
            cy.get('button').contains('Search').click();
            cy.wait(2000);
            // ตรวจสอบผลลัพธ์การค้นหา
            cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
            cy.get('.ant-table-tbody tr').first().should('contain', automatText.subject);
            cy.get('button').contains('Reset').should('be.visible').click();
            cy.wait(2000);
            // ทดสอบการค้นหาด้วยรายละเอียด
            cy.get('#description').should('be.visible').clear().type(automatText.description);
            cy.get('button').contains('Search').click();
            // ตรวจสอบผลลัพธ์การค้นหา
            cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
            cy.get('.ant-table-tbody tr').first().should('contain', automatText.description);
            // cy.get('button').contains('Reset').should('be.visible').click();
        });

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

        it('ADMINICDJUNIOR-SN-81-82-83-84: ไม่สามารถแก้ไข About Internal Control ได้ เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
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
                cy.get('.ant-form-item-explain-error').first().contains('กรุณากรอกลำดับที่ต้องการให้แสดงผลก่อนหรือหลัง');
                cy.get('.ant-form-item-explain-error').eq(1).contains('กรุณากรอกข้อมูล');
                cy.get('.ant-form-item-explain-error').eq(2).contains('กรุณากรอกข้อมูล');
                cy.get('.absolute button').contains('span', 'delete').click({ force: true });
                cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/Mei50MPpng.png', { force: true });
                cy.get('.border-red-500').should('exist');
                cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/ppng.png', { force: true });
                cy.get('.absolute button').contains('span', 'delete').click({ force: true });
                cy.get('input[accept=""]').selectFile('cypress/fixtures/30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });
                cy.get('.border-red-500').should('exist');
                // cy.get('button[type="submit"]').contains('ยืนยัน').should('be.visible').click();

            });
        });
    });


});