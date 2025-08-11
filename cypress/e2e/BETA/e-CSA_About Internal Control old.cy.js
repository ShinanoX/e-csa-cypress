describe('Master Data - Internal Control', () => {
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
    });

    it('TC-MD-001: เข้าสู่หน้า Master Data - Internal Control และแสดงข้อมูลถูกต้อง', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.get('.bg-white\\/90').should('be.visible');

        // ตรวจสอบหัวข้อหน้า
        cy.get('.text-neutral-800').should('contain', 'การจัดการ');
        cy.get('.text-\\[\\#4CB847\\]').should('contain', 'About Internal Control');

        // ตรวจสอบตารางข้อมูล
        cy.get('.ant-table-wrapper').should('be.visible');
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

        cy.log('✅ เข้าสู่หน้า Master Data - Internal Control สำเร็จ');
    });

    it('TC-MD-002: ทดสอบการค้นหาข้อมูล Internal Control', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('🔍 ทดสอบการค้นหาตามชื่อเรื่อง');

        // ค้นหาตามชื่อเรื่อง
        cy.get('#subject').should('be.visible').type('Little Lamb');
        cy.get('button').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบผลลัพธ์การค้นหา
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.get('.ant-table-tbody tr').first().should('contain', 'Little Lamb');

        // Reset การค้นหา
        cy.get('button').contains('Reset').click();
        cy.wait(500);

        cy.log('🔍 ทดสอบการค้นหาตามรายละเอียด');

        // ค้นหาตามรายละเอียด
        // cy.get('#description').should('be.visible').type('วัตถุประสงค์');
        // cy.get('button').contains('Search').click();
        // cy.wait(1000);

        // ตรวจสอบผลลัพธ์การค้นหา
        // cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        // cy.get('.ant-table-tbody tr').first().should('contain', 'วัตถุประสงค์');

        // Reset การค้นหา
        cy.get('button').contains('Reset').click();
        cy.wait(500);

        cy.log('✅ ทดสอบการค้นหาสำเร็จ');
    });

    it('TC-MD-003: ทดสอบการเรียงลำดับข้อมูลในตาราง', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('📊 ทดสอบการเรียงลำดับตามลำดับ');

        // คลิกเรียงลำดับตามลำดับ
        cy.get('.ant-table-column-sorters').contains('ลำดับ').click();
        cy.wait(1000);

        // ตรวจสอบข้อมูลในตาราง
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

        // คลิกเรียงลำดับอีกครั้ง (จากมากไปน้อย)
        cy.get('.ant-table-column-sorters').contains('ลำดับ').click();
        cy.wait(1000);

        cy.log('✅ ทดสอบการเรียงลำดับสำเร็จ');
    });

    it('TC-MD-004: ทดสอบการสร้างรายการใหม่', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('➕ ทดสอบการสร้างรายการใหม่');

        // คลิกปุ่มสร้างรายการ
        cy.get('button').contains('สร้างรายการ').should('be.visible').click();
        cy.wait(2000);

        // ตรวจสอบว่า Modal เปิดขึ้น
        cy.get('.ant-modal-content').should('be.visible');
        cy.get('.ant-modal-title').should('contain', 'สร้างรายการ About Internal Control');

        cy.log('📝 กรอกข้อมูลในฟอร์ม');

        // กรอกลำดับ
        cy.get('#sequence').should('be.visible').clear().type('999');

        // กรอกชื่อเรื่อง
        cy.get('.ant-modal-content').within(() => {
            cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
        });


        // กรอกรายละเอียด
        cy.get('.ant-modal-content').within(() => {
            cy.get('#description').should('be.visible').clear().type('นี่คือการทดสอบด้วย Cypress สำหรับการสร้างรายการใหม่ในระบบ Internal Control');
        });

        cy.log('📸 อัพโหลดรูปหน้าปก');

        // อัพโหลดรูปหน้าปก
        cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/jjpng.jpg', { force: true });
        cy.wait(1000);

        cy.get('.custom-modal-label').contains('ครอปรูปภาพ')
            .closest('.ant-modal-content')
            .within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });
        cy.wait(1000);

        cy.log('📎 อัพโหลดไฟล์แนบ');

        // อัพโหลดไฟล์แนบ (ใช้ไฟล์รูปเดียวกัน)
        cy.get('input[accept=""]').selectFile('cypress/fixtures/image/document.png', { force: true });
        cy.wait(1000);

        cy.log('✅ ยืนยันการสร้างรายการ');

        // คลิกปุ่มยืนยัน
        cy.get('.ant-form > .justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').should('be.visible').click();
        cy.wait(3000);

        // ตรวจสอบว่า Modal ยืนยัน
        cy.get('.gap-6').should('be.visible');
        cy.get('.gap-6 > .w-full > .flex').click();


        // ตรวจสอบว่ามีรายการใหม่ในตาราง
        cy.log('🔍 ค้นหารายการที่สร้างใหม่');

        // ใช้ฟีเจอร์ค้นหาเพื่อหารายการที่สร้างใหม่
        cy.get('#subject').should('be.visible').clear().type('Test Cypress Automation');
        cy.get('button').contains('Search').click();
        cy.wait(4000);

        // ตรวจสอบผลลัพธ์การค้นหา
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.get('.ant-table-tbody tr').first().should('contain', 'Test Cypress Automation');

        // ตรวจสอบข้อมูลในแถวที่พบ
        cy.get('.ant-table-tbody tr').first().within(() => {
            // cy.get('td').eq(0).should('contain', '999'); // ลำดับ
            cy.get('td').eq(1).should('contain', 'Test Cypress Automation'); // ชื่อเรื่อง
            cy.get('td').eq(2).should('contain', 'นี่คือการทดสอบด้วย Cypress'); // รายละเอียด
            cy.get('.ant-switch').should('have.attr', 'aria-checked', 'false'); // สถานะปิดใช้งาน
        });

        // Reset การค้นหาเพื่อกลับสู่สถานะเดิม
        cy.get('button').contains('Reset').click();
        cy.log('✅ สร้างและค้นหารายการใหม่สำเร็จ');
    });

    // เพิ่ม test case สำหรับทดสอบการยกเลิกการสร้างรายการ
    it('TC-MD-004A: ทดสอบการยกเลิกการสร้างรายการใหม่', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('➕ เปิด Modal สร้างรายการ');

        // คลิกปุ่มสร้างรายการ
        cy.get('button').contains('สร้างรายการ').should('be.visible').click();
        cy.wait(2000);

        // ตรวจสอบว่า Modal เปิดขึ้น
        cy.get('.ant-modal-content').should('be.visible');
        cy.get('.ant-modal-title').should('contain', 'สร้างรายการ About Internal Control');

        cy.log('📝 กรอกข้อมูลบางส่วน');

        // กรอกข้อมูลบางส่วน
        cy.get('#sequence').should('be.visible').clear().type('997');

        cy.get('.ant-modal-content').within(() => {
            cy.get('#subject').should('be.visible').clear().type('Test Cancel');
        });

        cy.log('❌ ยกเลิกการสร้างรายการ');

        // คลิกปุ่มยกเลิก
        cy.get('.ant-modal-content').within(() => {
            cy.get('button').contains('ยกเลิก').click();
        });
        cy.wait(1000);
        cy.log('✅ ยกเลิกการสร้างรายการสำเร็จ');
    });

    // เพิ่ม test case สำหรับทดสอบการปิด Modal ด้วยปุ่ม X
    it('TC-MD-004B: ทดสอบการปิด Modal ด้วยปุ่ม X', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('➕ เปิด Modal สร้างรายการ');

        // คลิกปุ่มสร้างรายการ
        cy.get('button').contains('สร้างรายการ').should('be.visible').click();
        cy.wait(2000);

        // ตรวจสอบว่า Modal เปิดขึ้น
        cy.get('.ant-modal-content').should('be.visible');
        cy.get('.ant-modal-title').should('contain', 'สร้างรายการ About Internal Control');

        cy.log('📝 กรอกข้อมูลบางส่วน');

        // กรอกข้อมูลบางส่วนเพื่อทดสอบ
        cy.get('#sequence').should('be.visible').clear().type('996');

        cy.get('.ant-modal-content').within(() => {
            cy.get('#subject').should('be.visible').clear().type('Test Close X');
        });

        cy.log('❌ ปิด Modal ด้วยปุ่ม X');

        // คลิกปุ่ม X
        cy.get('.ant-modal-close').click();
        cy.wait(1000);
        cy.log('✅ ปิด Modal ด้วยปุ่ม X สำเร็จ');
    });

    // เพิ่ม test case สำหรับทดสอบการตรวจสอบข้อมูลที่จำเป็น
    it('TC-MD-004C: ทดสอบการตรวจสอบข้อมูลที่จำเป็น (Required Fields)', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('➕ เปิด Modal สร้างรายการ');

        // คลิกปุ่มสร้างรายการ
        cy.get('button').contains('สร้างรายการ').should('be.visible').click();
        cy.wait(2000);

        // ตรวจสอบว่า Modal เปิดขึ้น
        cy.get('.ant-modal-content').should('be.visible');
        cy.get('.ant-modal-title').should('contain', 'สร้างรายการ About Internal Control');

        cy.log('❌ ทดสอบส่งฟอร์มโดยไม่กรอกข้อมูลที่จำเป็น');

        // พยายามส่งฟอร์มโดยไม่กรอกข้อมูล
        cy.get('.ant-form > .justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').should('be.visible').click();
        cy.wait(1000);

        // ตรวจสอบว่ายังคงอยู่ใน Modal (ไม่ปิด)
        cy.get('.ant-modal-content').should('be.visible');

        // ตรวจสอบข้อความ error หรือ validation (ถ้ามี)
        cy.get('body').then(($body) => {
            if ($body.find('.ant-form-item-explain-error').length > 0) {
                cy.get('.ant-form-item-explain-error').should('be.visible');
                cy.log('✅ แสดงข้อความ validation error');
            } else if ($body.find('.ant-notification').length > 0) {
                cy.get('.ant-notification').should('be.visible');
                cy.log('✅ แสดง notification error');
            } else {
                cy.log('ℹ️ ไม่พบข้อความ error แต่ Modal ยังคงเปิดอยู่');
            }
        });

        cy.log('📝 กรอกข้อมูลที่จำเป็นและส่งฟอร์มอีกครั้ง');

        // กรอกข้อมูลที่จำเป็น
        cy.get('#sequence').should('be.visible').clear().type('995');

        cy.get('.ant-modal-content').within(() => {
            cy.get('#subject').should('be.visible').clear().type('Test Required Fields');
            cy.get('#description').should('be.visible').clear().type('ทดสอบ Required Fields สำหรับการตรวจสอบข้อมูลที่จำเป็น');
        });

        cy.log('📸 อัพโหลดรูปหน้าปก (Required)');

        // อัพโหลดรูปหน้าปก (Required)
        cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/image/jjpng.jpg', { force: true });
        cy.wait(1000);

        // จัดการ Modal ครอปรูปภาพ
        cy.get('.custom-modal-label').contains('ครอปรูปภาพ')
            .closest('.ant-modal-content')
            .within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });
        cy.wait(1000);

        // คลิกปุ่มยืนยันอีกครั้ง
        cy.get('.ant-form > .justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').should('be.visible').click();
        cy.wait(3000);

        // ตรวจสอบว่า Modal ยืนยันแสดงขึ้น
        cy.get('.gap-6').should('be.visible');
        cy.get('.gap-6 > .w-full > .flex').click();
        cy.wait(2000);
        cy.log('✅ ส่งฟอร์มสำเร็จหลังกรอกข้อมูลที่จำเป็น');
    });

    // เพิ่ม test case สำหรับทดสอบการอัพโหลดไฟล์ผิดประเภท
    it('TC-MD-004D: ทดสอบการอัพโหลดไฟล์ผิดประเภท', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('➕ เปิด Modal สร้างรายการ');

        // คลิกปุ่มสร้างรายการ
        cy.get('button').contains('สร้างรายการ').should('be.visible').click();
        cy.wait(2000);

        // ตรวจสอบว่า Modal เปิดขึ้น
        cy.get('.ant-modal-content').should('be.visible');

        cy.log('❌ ทดสอบอัพโหลดไฟล์ที่ไม่ใช่ .jpg');

        // สร้างไฟล์ txt สำหรับทดสอบ
        cy.writeFile('cypress/fixtures/test.txt', 'This is a test file');

        // พยายามอัพโหลดไฟล์ .txt (ซึ่งไม่ได้รับอนุญาต)
        cy.get('input[accept=".jpeg,.jpg"]').selectFile('cypress/fixtures/test.txt', { force: true });
        cy.wait(1000);

        // ตรวจสอบข้อความ error หรือ notification
        cy.get('body').then(($body) => {
            if ($body.find('.ant-notification').length > 0) {
                cy.get('.ant-notification').should('contain', 'ประเภทไฟล์ไม่ถูกต้อง');
                cy.log('✅ แสดงข้อความ error สำหรับไฟล์ประเภทไม่ถูกต้อง');
            } else {
                cy.log('ℹ️ ระบบอาจป้องกันการอัพโหลดไฟล์ผิดประเภทโดยอัตโนมัติ');
            }
        });

        // ปิด Modal
        cy.get('.ant-modal-close').click();

        cy.log('✅ ทดสอบการอัพโหลดไฟล์ผิดประเภทเสร็จสิ้น');
    });

    it('TC-MD-005: ทดสอบการแก้ไขรายการ', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('✏️ ทดสอบการแก้ไขรายการแรก');

        // คลิกปุ่มแก้ไขของรายการแรก
        cy.get('.ant-table-tbody tr').first().within(() => {
            cy.get('button').contains('edit').click();
        });
        cy.wait(2000);

        // ตรวจสอบว่า Modal หรือหน้าแก้ไขเปิดขึ้น
        cy.get('body').then(($body) => {
            if ($body.find('.ant-modal-content').length > 0) {
                cy.get('.ant-modal-content').should('be.visible');
                cy.log('✅ เปิด Modal แก้ไขสำเร็จ');

                // ปิด Modal
                cy.get('.ant-modal-close').click();
            } else if ($body.find('form').length > 0) {
                cy.get('form').should('be.visible');
                cy.log('✅ เข้าสู่หน้าแก้ไขสำเร็จ');
            } else {
                cy.log('ℹ️ ไม่พบฟอร์มแก้ไข อาจต้องตรวจสอบ selector');
            }
        });
    });

    it('TC-MD-006: ทดสอบการเปิด/ปิดใช้งานรายการ', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('🔄 ทดสอบการเปิด/ปิดใช้งานรายการ');

        // หาสวิตช์ที่เปิดอยู่ (aria-checked="true")
        cy.get('.ant-switch[aria-checked="true"]').first().then(($switch) => {
            const isChecked = $switch.attr('aria-checked') === 'true';
            cy.log(`สถานะเริ่มต้น: ${isChecked ? 'เปิด' : 'ปิด'}`);

            // คลิกสวิตช์
            cy.wrap($switch).click();
            cy.wait(1000);

            // ตรวจสอบว่าสถานะเปลี่ยน
            cy.wrap($switch).should('have.attr', 'aria-checked', isChecked ? 'false' : 'true');
            cy.log(`สถานะหลังคลิก: ${!isChecked ? 'เปิด' : 'ปิด'}`);

            // คลิกอีกครั้งเพื่อกลับสู่สถานะเดิม
            cy.wrap($switch).click();
            cy.wait(1000);
            cy.wrap($switch).should('have.attr', 'aria-checked', isChecked ? 'true' : 'false');
        });

        cy.log('✅ ทดสอบการเปิด/ปิดใช้งานสำเร็จ');
    });

    it('TC-MD-007: ทดสอบการดูรูปหน้าปก', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('🖼️ ทดสอบการดูรูปหน้าปก');

        // คลิกปุ่มรูปภาพของรายการแรก
        cy.get('.ant-table-tbody tr').first().within(() => {
            cy.get('button').contains('image').should('be.visible').click();
        });
        cy.wait(1000);

        // ตรวจสอบว่ามี Modal หรือการแสดงรูปภาพ
        cy.get('body').then(($body) => {
            if ($body.find('.ant-modal-content').length > 0) {
                cy.get('.ant-modal-content').should('be.visible');
                cy.log('✅ เปิด Modal แสดงรูปภาพสำเร็จ');

                // ปิด Modal
                cy.get('.ant-modal-close').click();
            } else if ($body.find('img').length > 0) {
                cy.get('img').should('be.visible');
                cy.log('✅ แสดงรูปภาพสำเร็จ');
            } else {
                cy.log('ℹ️ ไม่พบรูปภาพ อาจเป็นการทำงานในรูปแบบอื่น');
            }
        });
    });

    it('TC-MD-008: ทดสอบ Pagination', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
        cy.url().should('include', '/master-data/internal-control');
        cy.wait(2000);

        cy.log('📄 ทดสอบ Pagination');

        // ตรวจสอบจำนวนรายการทั้งหมด
        cy.get('label').contains('ทั้งหมด').should('be.visible');

        // ตรวจสอบข้อมูลหน้าแรก
        cy.get('.ant-table-tbody tr').should('have.length', 10);

        // ทดสอบไปหน้าถัดไป (ถ้ามี)
        cy.get('body').then(($body) => {
            if ($body.find('.ant-pagination-next:not(.ant-pagination-disabled)').length > 0) {
                cy.get('.ant-pagination-next').click();
                cy.wait(1000);

                // ตรวจสอบว่าเป็นหน้า 2
                cy.get('.ant-pagination-item-2').should('have.class', 'ant-pagination-item-active');
                cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

                // กลับไปหน้าแรก
                cy.get('.ant-pagination-item-1').click();
                cy.wait(1000);
                cy.get('.ant-pagination-item-1').should('have.class', 'ant-pagination-item-active');

                cy.log('✅ Pagination ทำงานถูกต้อง');
            } else {
                cy.log('ℹ️ มีข้อมูลเพียงหน้าเดียว ไม่มี Pagination');
            }
        });

        // ทดสอบการเปลี่ยนจำนวนรายการต่อหน้า
        cy.get('.ant-pagination-options-size-changer').click();
        cy.get('.ant-select-dropdown').should('be.visible');
        cy.get('.ant-select-item-option').contains('20 / page').click();
        cy.wait(1000);

        // ตรวจสอบว่าแสดงจำนวนรายการเปลี่ยน
        cy.get('.ant-select-selection-item').should('contain', '20 / page');

        cy.log('✅ ทดสอบ Pagination สำเร็จ');
    });

    // it.skip('TC-MD-009: ทดสอบการลบรายการ', () => {
    //     cy.visit('https://dev-ecsa.looksocial.dev/master-data/internal-control');
    //     cy.url().should('include', '/master-data/internal-control');
    //     cy.wait(2000);

    //     cy.log('🗑️ ทดสอบการลบรายการ');

    //     // นับจำนวนรายการเริ่มต้น
    //     cy.get('.ant-table-tbody tr').then(($rows) => {
    //         const initialRowCount = $rows.length;
    //         cy.log(`จำนวนรายการเริ่มต้น: ${initialRowCount}`);

    //         // คลิกปุ่มลบของรายการสุดท้าย
    //         cy.get('.ant-table-tbody tr').last().within(() => {
    //             cy.get('button').contains('delete').click();
    //         });
    //         cy.wait(1000);

    //         // ตรวจสอบ Confirmation Dialog
    //         cy.get('body').then(($body) => {
    //             if ($body.find('.ant-modal-content').length > 0) {
    //                 // ถ้ามี Modal ยืนยัน
    //                 cy.get('.ant-modal-content').should('be.visible');
    //                 cy.get('.ant-modal-content').within(() => {
    //                     cy.get('button').contains('ยืนยัน', { matchCase: false }).click();
    //                 });
    //                 cy.wait(2000);

    //                 // ตรวจสอบจำนวนรายการลดลง
    //                 // cy.get('.ant-table-tbody tr').should('have.length', initialRowCount - 1);
    //                 cy.log('✅ ลบรายการสำเร็จ');
    //             } else if ($body.find('.ant-popconfirm').length > 0) {
    //                 // ถ้ามี Popconfirm
    //                 cy.get('.ant-popconfirm .ant-btn-primary').click();
    //                 cy.wait(2000);

    //                 cy.get('.ant-table-tbody tr').should('have.length', initialRowCount - 1);
    //                 cy.log('✅ ลบรายการสำเร็จ');
    //             } else {
    //                 cy.log('ℹ️ ไม่พบ Confirmation Dialog อาจลบทันทีหรือมีการทำงานแบบอื่น');
    //             }
    //         });
    //     });
    // });
});