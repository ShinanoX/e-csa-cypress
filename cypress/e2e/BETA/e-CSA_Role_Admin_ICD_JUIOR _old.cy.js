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
        it('TC-A-003 - Dashboard แสดงผลได้ถูกต้อง', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('nav > :nth-child(2)').click();
        });

        it('TC-A-004 - สามารถดาวน์โหลด User Manaul ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('.border > .flex-col > .flex').should('be.visible').click();
        });
    });

    describe('Notiffication', () => {
        it('TC-A-005 - Notification แสดงผลได้ถูกต้อง', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            cy.get('.ant-badge > .rounded-md').should('be.visible').click();
            cy.get('.text-neutral-800').should('contain', 'Notification');
            cy.get('.rounded-xl').should('be.visible');
            cy.log('✅ แสดงผล list ได้ถูกต้อง');
            cy.log('สามารถเข้าถึงแบบประเมินผ่าน Notification ได้ (ไม่สามารถทดสอบได้)');
            cy.get('.space-y-0 > :nth-child(1)').should('be.visible')

        });
        it('TC-A-006 - สามารถเข้าถึงแบบประเมินผ่าน Notification ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
            cy.url().should('include', '/dashboard');
            cy.wait(1000);
            ;
        });
    });

    describe('Assessment Form', () => {
        it('TC-A-001 - สามารถดูแบบประเมินได้', () => {
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

    describe.only('Create Assessment', () => {
        it('TC-A-003 - สามารถสร้าง/Save Draft/แก้ไข/ยกเลิก แบบประเมินได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);

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

            cy.get('.text-neutral-800').click();
            cy.get('.gap-6 > .w-full > .bg-\\[\\#4CB847\\]').click();
            cy.log('✅ ปิดหน้า create และ กลับไปที่หน้า Assessment');
        });

        it('TC-A-004 - สามารถเพิ่ม/แก้ไข/ลบ องค์ประกอบได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);

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

            cy.get('.h-screen > .gap-2 > :nth-child(2) > .rounded-md').should('be.visible').click();
            cy.get('button > .ant-input').should('be.visible').type('ทดสอบสการเพิ่มองค์ประกอบ').type('{enter}');
            cy.log('✅ เพิ่มองค์ประกอบใหม่สำเร็จ');

            cy.log('📝 ลบองค์ประกอบ');
            cy.get('.gap-2 > .gap-4 > :nth-child(1) > .flex > .material-symbols-outlined').click();
            cy.get('.border-gray-200 > .w-full').click();
            cy.log('✅ ลบองค์ประกอบสำเร็จ');


            //ลบองค์ประกอบทั้งหมดให้เหลืออันสุดท้าย
            // cy.get('.gap-2 > .gap-4').children().its('length').then((totalCount) => {
            //     cy.log(`พบองค์ประกอบทั้งหมด ${totalCount} อัน จะลบ ${totalCount - 1} อัน`);

            //     // ลบทีละอันจนเหลืออันสุดท้าย
            //     for (let i = 0; i < totalCount - 1; i++) {
            //         cy.get('.gap-2 > .gap-4 > :nth-child(1) > .flex > .material-symbols-outlined')
            //             .should('be.visible')
            //             .click(); //คลิกที่ไอคอน 3 จุด ของ tab

            //         cy.get('.border-gray-200 > .w-full')
            //             .should('be.visible')
            //             .click(); //คลิกถังขยะ

            //         cy.log(`✅ ลบองค์ประกอบที่ ${i + 1} สำเร็จ`);
            //         cy.wait(1000); // รอให้ UI อัพเดต
            //     }

            //     // ตรวจสอบว่าเหลือองค์ประกอบเพียง 1 อัน
            //     cy.get('.gap-2 > .gap-4').children().should('have.length', 1);
            //     cy.log('✅ ลบองค์ประกอบเสร็จสิ้น เหลือองค์ประกอบสุดท้าย 1 อัน');
            // });

        });

        it('สามารถยกเลิกการสร้างแบบประเมินได้', () => {
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

                // ขั้นที่ 4: กดยกเลิกการสร้างแบบประเมิน ใน modal
                cy.get('.ant-form > .justify-end > .bg-white').click();
                cy.get('.ant-modal-content').should('not.exist'); // ตรวจสอบว่า modal ถูกปิด
                cy.log('✅ ตรวจสอบว่า modal ถูกปิดหลังจากกดปุ่มยกเลิกสำเร็จ');

            })
        })

        it.only('สามารถเพิ่ม/แก้ไข/ลบ องค์ประกอบย่อยได้ , สามารถ Assign/ลบ Assessor ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);

            // ขั้นที่ 1: คลิกปุ่ม Create New Assessment
            cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();
            cy.wait(2000);

            // ขั้นที่ 2: ตรวจสอบ Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').clear().type('BCP_2025_TEST');
            })
            cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
            cy.get('.justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').click();
            cy.wait(10000);

            // ลาก widget ลงมาอยู่ใน section

            const dataTransfer = new DataTransfer();
            cy.get('.border-b > :nth-child(1) > .gap-2').trigger('dragstart', { dataTransfer });
            cy.get('.min-h-full > .ant-form > .bg-white')
                .trigger('drop', { dataTransfer, force: true })
                .trigger('dragend', { dataTransfer, force: true });
            cy.wait(3000);

            const widgetsInSection = [
                '.border-b > :nth-child(2) > .gap-2', // Yes/No
                '.border-b > :nth-child(3) > .gap-2', // Choice
                '.border-b > :nth-child(4) > .gap-2', // Checkbox
                ':nth-child(5) > .gap-2',             // Text
                ':nth-child(6) > .gap-2',             // Rating
                ':nth-child(7) > .gap-2',             // Ranking
                ':nth-child(8) > .gap-2'              // Date
            ];

            widgetsInSection.forEach((selector) => {
                cy.get(selector).first().trigger('dragstart', { dataTransfer });
                cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
                    .first()
                    .trigger('drop', { dataTransfer, force: true });
                cy.wait(500);

                cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
                    .first()
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);
            });

            // ลบ widget ที่เพิ่มเข้ามา
            cy.get(':nth-child(1) > :nth-child(1) > .mt-4 > .p-2 > :nth-child(1) > :nth-child(1) > .items-center.flex-col > .my-auto > .flex > :nth-child(2)').click();

            cy.get('.w-full > .bg-white').click({ force: true });// คลิกเพื่อปุ่มยกเลิก popup

            // เพิ่ม Assign Assessor เปิด modal
            cy.contains('Assign').first().click({ force: true });
            cy.wait(10000);

            cy.get('.col-span-2').within(() => {
                cy.get('.ant-select-selector').eq(0).click();
            });

            cy.get('.ant-select-dropdown')
                .should('be.visible')
                .within(() => {
                    cy.get('.ant-select-item-option').first().click();
                });

            cy.get('.col-span-2').within(() => {
                cy.get('.ant-select-selector').eq(1).click();
            });
            cy.wait(2000);

            cy.get('[style="height: 32px; position: relative; overflow: hidden;"] > .rc-virtual-list-holder-inner > .ant-select-item > .ant-select-item-option-content').click();

            cy.get('.col-span-2').within(() => {
                cy.get('.ant-select-selector').eq(2).click();
            });
            cy.wait(2000);
            cy.get('[style="height: 128px; position: relative; overflow: hidden;"] > .rc-virtual-list-holder-inner > .ant-select-item-option-active').click();

            cy.get('.ant-table-selection').click();

            cy.get('#assessor_type > :nth-child(1) > .ant-radio-label').click();
            cy.get('[type="submit"]').contains('ยืนยัน').click();

            //ปิดหน้า Assessment create form
            // cy.get('.text-neutral-800').click();
            // cy.get('.gap-6 > .w-full > .bg-\\[\\#4CB847\\]').click();
            // cy.log('✅ ปิดหน้า create และ กลับไปที่หน้า Assessment');
        })
    })

});
