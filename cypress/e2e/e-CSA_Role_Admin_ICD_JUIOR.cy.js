describe('Role Admin ICD Junior', () => {
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
    describe('Dashboard - View', () => {
        it('TC-A-001 - Dashboard แสดงผลได้ถูกต้อง', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('nav > :nth-child(2)').click();
        });

        it('TC-A-002 - สามารถดาวน์โหลด User Manaul ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('.border > .flex-col > .flex').should('be.visible').click();
        });
    });

    describe('Dashboard - FAQ', () => {
        it('TC-A-003 - สามารถดูข้อมูล FAQ ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('footer.flex > :nth-child(1)').should('be.visible').click();
            cy.url().should('include', '/faq');
            cy.contains('คำถามเรื่อง').should('be.visible');
            cy.get(':nth-child(1) > .bg-white > .font-bold').click();
            cy.get('.mx-4').should('be.visible');
            cy.log("แสดงคำตอบ");
            cy.get('.w-full > :nth-child(1) > .bg-white > .justify-between').click();
            cy.get('.mx-4').should('not.exist');
        });
    });
    describe('Dashboard - About Internal Control', () => {
        it('TC-A-004 - สามารถดูข้อมูล About Internal Control ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('footer.flex > :nth-child(2)').should('be.visible').click();
            cy.url().should('include', '/about-internal-control');
            cy.contains('About Internal Control').should('be.visible');
            cy.get('.w-full.flex.flex-col.gap-4').should('be.visible');
            cy.get('.w-full.flex.flex-col.gap-4').within(() => {
                cy.get('img').should('be.visible');
                cy.get('.font-bold.text-\\[16px\\]').should('be.visible').invoke('text').should('not.be.empty');
                cy.get(' .w-\\[500px\\] > :nth-child(2)').should('be.visible').invoke('text').should('not.be.empty');
            });
        });
        it('TC-A-005 - สามารถดาวน์โหลด About Internal Control ได้', () => {
            cy.get('footer.flex > :nth-child(2)').click().should('be.visible');
            cy.contains('About Internal Control').should('be.visible');
            cy.wait(2000)
            cy.get('.flex.flex-col.gap-1.mt-2 .flex.gap-2').first().within(() => {
                cy.get('button').eq(1).click({ force: true }); // ปุ่มดาวน์โหลดอันแรก
            });
        })

    });

    describe('Dashboard - User Manual', () => {
        it('TC-A-006 - สามารถดูข้อมูล Portal ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('[aria-label="Portal"]').click();
            cy.url().should('include', '/portal');

        });
        it('TC-A-007 - สามารถเข้าสู่เว็บไซต์ผ่าน Portal ได้', () => {
            cy.get('[aria-label="Portal"]').click();
            cy.get('.text-neutral-800').invoke('text').should('not.be.empty');
            cy.get('.w-full.flex.flex-col.gap-4').within(() => {
                cy.get('img').should('be.visible');
                cy.get('.font-bold.text-\\[16px\\]').should('be.visible').invoke('text').should('not.be.empty');
                cy.get('.font-bold.text-\\[16px\\]').next().should('be.visible').invoke('text').should('not.be.empty');
                cy.get('.flex.justify-start.items-center.gap-2.text-\\[\\#4CB847\\].cursor-pointer.mt-2 :nth-child(1)').should('be.visible')
            });
        });
    });

    describe('Assessment Form', () => {
        it('TC-A-008 - สามารถดูแบบประเมินได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.wait(3000);
            cy.get('.bg-white\\/90').should('be.visible');

            // table
            cy.get('.card')
                .should('be.visible')
                .find('.ant-table-wrapper') // หา ant-table-wrapper ภายใน card
                .should('be.visible')
                .should('have.class', 'ant-table-wrapper')
                .find('.ant-table-tbody')
                .should('be.visible')
                .find('tr')
                .should('have.length.greaterThan', 0);

            cy.get('[data-row-key="aa8500a7-6fab-4682-ac98-f7ef92c102c0"]')
                .find('.gap-2 [style*="width: 32px"][style*="height: 32px"]')
                .first()
                .should('be.visible')
                .click(); // คลิกที่แถวแรกของตาราง

            // Assessment Form
            cy.get('.bg-white\\/90').should('be.visible');
            cy.log('แสดง Assessment Form');

            cy.get('.transition-all.duration-300.ease-in-out.w-\\[650px\\].px-4.overflow-hidden').should('be.visible'); // ตรวจสอบว่าแสดงข้อมูลแบบประเมิน
            cy.log('ตรวจสอบว่า Assessment Date แสดงข้อมูลถูกต้อง');
            cy.get('.opacity-100 > .bg-white').should('be.visible').click(); // hide data
            cy.get('.transition-all.duration-300.ease-in-out.w-\\[650px\\].px-4.overflow-hidden').should('not.exist');
            cy.log('ตรวจสอบว่า Assessment ข้อมูลถูกซ่อนอย่างถูกต้องไป');
            cy.get('.opacity-100 > .bg-white').should('be.visible').click(); // แสดงข้อมูลแบบประเมินอีกครั้ง
            cy.get('.transition-all.duration-300.ease-in-out.w-\\[650px\\].px-4.overflow-hidden').should('be.visible'); // ตรวจสอบว่าแสดงข้อมูลแบบประเมินอีกครั้ง
        })

        it('TC-A-009 - สามารถใช้ Search หาแบบประเมินได้', () => {
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

        describe.only('Assessment Form - View', () => {
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
                    cy.get('button[type="submit"]').should('be.disabled');
                    cy.get('button[type="submit"]').should('have.attr', 'disabled');
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
                    cy.get('button[type="submit"]').contains('ยืนยัน').click();
                });

                // ขั้นที่ 11: ตรวจสอบผลลัพธ์
                cy.get('.ant-modal-content').should('not.exist');
                cy.log('✅ สร้าง Assessment ใหม่สำเร็จ');
                cy.url().should('include', '/assessment/create');
            });

            it.only('TC-A-011 - สามารถยกเลิกการสร้างแบบประเมินได้', () => {
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

    });

});
