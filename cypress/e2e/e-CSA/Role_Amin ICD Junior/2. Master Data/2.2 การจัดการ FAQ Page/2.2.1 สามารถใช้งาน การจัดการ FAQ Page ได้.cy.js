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

    describe('2.2.1 สามารถใช้งาน การจัดการ FAQ Page ได้', () => {
        const testData = {
            sequence: '999',
            question: 'คำถามทดสอบ Cypress',
            answer: 'คำตอบทดสอบสำหรับ Cypress automation'
        };
        it('ADMINICDJUNIOR-SN-22 สามารถดู FAQ ได้', () => {
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1').should('be.visible');
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);
            cy.url().should('include', '/master-data/faq');
            cy.get('.flex.gap-1.items-center').should('contain', 'การจัดการ').should('contain', 'FAQ Page');
            cy.get('.ant-table-tbody').should('be.visible');
            cy.log('แสดงรายการ FAQ ทั้งหมด');
        });

        it('ADMINICDJUNIOR-SN-23 สามารถสร้าง FAQ ได้', () => {
            const testData = {
                sequence: '999',
                question: 'คำถามทดสอบ Cypress',
                answer: 'คำตอบทดสอบสำหรับ Cypress automation'
            };
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            // คลิกสร้าง FAQ
            cy.get('button').contains('สร้าง FAQ').click();
            cy.wait(1000);

            // ตรวจสอบและทำงานใน modal สร้าง FAQ โดยเจาะจง
            cy.contains('.ant-modal-content', 'สร้าง FAQ').within(() => {
                // ตรวจสอบ modal แสดงขึ้น
                cy.get('.custom-modal-label').should('contain', 'สร้าง FAQ');

                // กรอกข้อมูล FAQ
                // กรอกลำดับ
                cy.get('#sequence').clear().type(testData.sequence);
                // กรอกคำถามเรื่อง
                cy.get('#question').type(testData.question);
                // กรอกคำตอบ
                cy.get('#answer').type(testData.answer);
                // รอให้ปุ่มยืนยันเปิดใช้งาน (เมื่อกรอกข้อมูลครบ)

                // สำหรับทดสอบการอัพโหลดไฟล์ (ถ้าต้องการ)
                cy.get('input[type="file"]').selectFile('cypress/fixtures/image/jjpng.jpg', { force: true });
                cy.get('button[type="submit"]').should('not.be.disabled');
                // คลิกยืนยัน
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });

            // modal
            cy.wait(2000);
            cy.get('.gap-12').within(() => {
                cy.contains('คำถามทดสอบ Cypress').should('contain', testData.question);
                cy.contains('ปิด').should('be.visible').click();
            });
            //ค้นหา FAQ ที่สร้างขึ้น
            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody').contains(testData.question).should('be.visible');

        });

        it('ADMINICDJUNIOR-SN-24 สามารถแก้ไข FAQ ได้', () => {

            const testEditData = {
                // sequence: '999',
                question: 'แก้ไขคำถามทดสอบ Cypress',
                answer: 'แก้ไขคำตอบทดสอบสำหรับ Cypress automation'
            };
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            // คลิก FAQ ที่ต้องการแก้ไข (คลิกที่คำถามหรือไอคอนแก้ไข)
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').find('span').contains('edit').click();
            });

            cy.contains('.ant-modal-content', 'แก้ไข FAQ').within(() => {
                // ตรวจสอบ modal แสดงขึ้น
                cy.get('.custom-modal-label').should('contain', 'แก้ไข FAQ');

                // กรอกข้อมูล FAQ
                cy.get('#question').clear().type(testEditData.question);
                // กรอกคำตอบ
                cy.get('#answer').clear().type(testEditData.answer);
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });


            cy.log('แก้ไข FAQ สำเร็จ');
        });

        it.skip('ADMINICDJUNIOR-SN-25 สามารถลบ FAQ ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/faq');
            cy.wait(2000);

            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(2000);
            // คลิกไอคอนลบ
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').find('span').contains('delete').click();
            });
            cy.wait(1000);

            // ยืนยันการลบ
            cy.get('button').contains('ยืนยัน').click();
            cy.log('ลบ FAQ สำเร็จ');
            // cy.get('button').contains('ยกเลิก').click();
            // cy.log('ยกเลิกการลบ FAQ สำเร็จ');
            cy.wait(2000);
            cy.get('.gap-12').within(() => {
                cy.contains('คำถามทดสอบ Cypress').should('contain', testData.question);
                cy.contains('ปิด').should('be.visible').click();
            });

        });

        it('ADMINICDJUNIOR-SN-26 สามารถเปิดการใช้งาน FAQ ได้', () => {
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            // ค้นหา FAQ ที่ต้องการ
            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(2000);

            // หา FAQ เฉพาะที่มีคำถาม "คำถามทดสอบ Cypress" และเปิดการใช้งาน
            cy.get('.ant-table-tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    // ตรวจสอบว่าแถวนี้มีคำถาม "คำถามทดสอบ Cypress"
                    cy.get('td').eq(1).invoke('text').then((questionText) => {
                        if (questionText.includes(testData.question)) {
                            // ตรวจสอบสถานะ switch และคลิกถ้ายังปิดอยู่
                            cy.get('.ant-switch').then(($switch) => {
                                if (!$switch.hasClass('ant-switch-checked')) {
                                    cy.wrap($switch).click();
                                    cy.wait(1000);
                                    cy.wrap($switch).should('have.class', 'ant-switch-checked');
                                    cy.log('เปิดใช้งาน FAQ "คำถามทดสอบ Cypress" สำเร็จ');
                                } else {
                                    cy.log('FAQ "คำถามทดสอบ Cypress" เปิดใช้งานอยู่แล้ว');
                                }
                            });
                        }
                    });
                });
            });
        });

        it('ADMINICDJUNIOR-SN-27 สามารถปิดการใช้งาน FAQ ได้', () => {
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            // ค้นหา FAQ ที่ต้องการ
            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(2000);

            // หา FAQ เฉพาะที่มีคำถาม "คำถามทดสอบ Cypress" และปิดการใช้งาน
            cy.get('.ant-table-tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    // ตรวจสอบว่าแถวนี้มีคำถาม "คำถามทดสอบ Cypress"
                    cy.get('td').eq(1).invoke('text').then((questionText) => {
                        if (questionText.includes(testData.question)) {
                            // ตรวจสอบสถานะ switch และคลิกถ้ายังเปิดอยู่
                            cy.get('.ant-switch').then(($switch) => {
                                if ($switch.hasClass('ant-switch-checked')) {
                                    cy.wrap($switch).click();
                                    cy.wait(1000);
                                    cy.wrap($switch).should('not.have.class', 'ant-switch-checked');
                                    cy.log('ปิดใช้งาน FAQ "คำถามทดสอบ Cypress" สำเร็จ');
                                } else {
                                    cy.log('FAQ "คำถามทดสอบ Cypress" ปิดใช้งานอยู่แล้ว');
                                }
                            });
                        }
                    });
                });
            });
        });

        it('ADMINICDJUNIOR-SN-28 Search หา FAQ ได้', () => {
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            // ทดสอบค้นหาด้วยลำดับ
            cy.get('#sequence').type(testData.sequence);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody').should('be.visible');
            cy.log('ค้นหาด้วยลำดับสำเร็จ');

            // Clear และทดสอบค้นหาด้วยคำถาม
            cy.get('button').contains('Reset').click();
            cy.get('#question').type(testData.question);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody').should('be.visible');
            cy.get('.ant-table-tbody').should('contain', testData.question);
            cy.log('ค้นหาด้วยคำถามสำเร็จ');

            // Clear และทดสอบค้นหาด้วยคำตอบ
            cy.get('button').contains('Reset').click();
            cy.get('#answer').type(testData.answer);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody').should('be.visible');
            cy.get('.ant-table-tbody').should('contain', testData.answer);
            cy.log('ค้นหาด้วยคำตอบสำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-29 สามารถ Clear ข้อมูลที่ Search ได้', () => {
            // เข้าหน้า FAQ
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1 > button:nth-child(2)').contains('การจัดการ FAQ Page').click();
            cy.wait(2000);

            // กรอกข้อมูลในฟิลด์ search ด้วย testData
            cy.get('#sequence').type(testData.sequence);
            cy.get('#question').type(testData.question);
            cy.get('#answer').type(testData.answer);

            // คลิก Search
            cy.get('button').contains('Search').click();
            cy.wait(1000);

            // ตรวจสอบว่ามีข้อมูลแสดง
            cy.get('.ant-table-tbody').should('be.visible');

            // คลิก Reset
            cy.get('button').contains('Reset').click();

            // ตรวจสอบว่าฟิลด์ถูกเคลียร์
            cy.get('#sequence').should('have.value', '');
            cy.get('#question').should('have.value', '');
            cy.get('#answer').should('have.value', '');

            // ตรวจสอบว่าข้อมูลในตารางกลับมาแสดงทั้งหมด
            cy.get('.ant-table-tbody').should('be.visible');

            cy.log('เคลียร์ข้อมูลการค้นหาสำเร็จ');
        });
    });

});