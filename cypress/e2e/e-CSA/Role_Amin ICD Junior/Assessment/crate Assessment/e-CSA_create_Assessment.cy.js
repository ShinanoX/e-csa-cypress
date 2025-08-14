describe('5.2 Create Assessment', () => {
    const passEvaluationForm = {
        assessment_code: 'BCP_2025_TEST',
        description: 'การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA',
    };
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
    });

    describe('5.2.1 Create Assessment by Create New Assessment', () => {
        it.only('ADMINICDSENIOR-SN-134: สามารถสร้างแบบประเมินใหม่ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);
            cy.log('📝 สามารถสร้างแบบประเมินใหม่ได้');
            // คลิกปุ่ม Create New Assessment
            cy.contains('Create New Assessment').click();
            // ตรวจสอบ Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

            //  ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                // ขั้แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
                cy.get('#assessment_code').clear().type('BCP_Test_Edit_For_Draft');
                cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA-Automate_cypress(G)');
                cy.get('#description').clear().type('การทดสอบการสร้างแบบประเมินสำหรับทดสอบ Draft');
                // cy.wait(2000)
                cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');
                cy.get('#start_date').click();
                cy.get('#end_date').click();
                cy.get('.ant-form-item-control-input-content > .flex-col > .ant-picker > .ant-picker-input > #end_date').click();
                // cy.wait(2000)
                cy.get('#open_next_round_date').click();
                cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
                cy.get('button[type="submit"]').should('not.be.disabled');
                cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
                cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });

            // cy.wait(3000);
            // // ลาก widget ลงมาอยู่ใน section
            // const dataTransfer = new DataTransfer();
            // cy.get('.border-b > :nth-child(1) > .gap-2').trigger('dragstart', { dataTransfer });
            // cy.get('.min-h-full > .ant-form > .bg-white')
            //     .trigger('drop', { dataTransfer, force: true })
            //     .trigger('dragend', { dataTransfer, force: true });
            // cy.wait(1000);

            //  // กำหนดจำนวน Section ที่ต้องการสร้าง
            // const widgetsInSection = [
            //     'Yes/No',
            //     'Choice',
            //     'Checkbox',
            //     'Text',
            //     'Rating',
            //     'Ranking',
            //     'Date'
            // ];

            // widgetsInSection.forEach((Text) => {
            //     cy.get(Text).first().trigger('dragstart', { dataTransfer });
            //     cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
            //         .first()
            //         .trigger('drop', { dataTransfer, force: true });
            //     cy.wait(500);

            //     cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
            //         .first()
            //         .trigger('dragend', { dataTransfer, force: true });
            //     cy.wait(1000);
            // });

            // // ลบ widget ที่เพิ่มเข้ามา
            // cy.get(':nth-child(1) > :nth-child(1) > .mt-4 > .p-2 > :nth-child(1) > :nth-child(1) > .items-center.flex-col > .my-auto > .flex > :nth-child(2)').click();

            // cy.get('.w-full > .bg-white').click({ force: true });// คลิกเพื่อปุ่มยกเลิก popup



            // cy.log('✅ TC-A-007 - สามารถ Assign/ลบ Assessor ได้');
            // cy.contains('Assign').first().click({ force: true });
            // cy.wait(3000);

            // // Dropdown แรก - Department/Unit
            // cy.get('.col-span-2 .ant-select-selector').eq(0).click();
            // cy.get('.ant-select-dropdown:visible .ant-select-item-option').first().click();
            // cy.wait(500);

            // // Dropdown ที่สอง - Sub Department
            // cy.get('.col-span-2 .ant-select-selector').eq(1).click();
            // cy.wait(1000);
            // cy.get('.rc-virtual-list-holder-inner:visible .ant-select-item-option-content').first().click();
            // cy.wait(500);

            // // Dropdown ที่สาม - Final Level
            // cy.get('.col-span-2 .ant-select-selector').eq(2).click();
            // cy.wait(1000);
            // cy.get('.rc-virtual-list-holder-inner:visible')
            //     .last() // ใช้ last() เพื่อเลือก dropdown ล่าสุด
            //     .find('.ant-select-item-option-content, .ant-select-item-option-active')
            //     .first()
            //     .click();

            // // เลือก Assessor และยืนยัน
            // cy.get('.ant-table-selection').first().click();
            // cy.get('#assessor_type > :nth-child(1) > .ant-radio-label').click();

            // cy.get('[type="submit"]').contains('ยืนยัน').click();
            // cy.log('✅ Assign Assessor สำเร็จ');

            // cy.log('📝 ลบองค์ประกอบ');
            // cy.get('.gap-2 > .gap-4 > :nth-child(1) > .flex > .material-symbols-outlined').click();
            // cy.get('.border-gray-200 > .w-full').click();
            // cy.log('✅ ลบองค์ประกอบสำเร็จ');

            //ปิดหน้า Assessment create form
            // cy.get('.text-neutral-800').click();
            // cy.get('.gap-6 > .w-full > .bg-\\[\\#4CB847\\]').click();
            // cy.log('✅ ปิดหน้า create และ กลับไปที่หน้า Assessment');

        });

        // it('TC-A-011 - สามารถยกเลิกการสร้างแบบประเมินได้', () => {
        //     cy.visit('https://dev-ecsa.looksocial.dev/assessment');
        //     cy.url().should('include', '/assessment');
        //     cy.get('.bg-white\\/90').should('be.visible');
        //     cy.wait(2000);

        //     cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

        //     // ขั้นที่ 2: ตรวจสอบ Modal เปิดขึ้น
        //     cy.get('.ant-modal-content').should('be.visible');
        //     cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

        //     // ขั้นที่ 3: ทำงานภายใน modal เท่านั้น
        //     cy.get('.ant-modal-content').within(() => {
        //         // ตรวจสอบ Form Elements
        //         cy.get('label').contains('บริษัท').should('be.visible');
        //         cy.get('label').contains('ปี').should('be.visible');
        //         cy.get('label').contains('รหัสแบบประเมิน').should('be.visible');
        //         cy.get('label').contains('ชื่อแบบประเมิน').should('be.visible');
        //         cy.get('label').contains('Start').should('be.visible');
        //         cy.get('label').contains('End').should('be.visible');
        //         cy.get('label').contains('วันที่เปิดรับประเมินรอบถัดไป').should('be.visible');
        //         cy.get('label').contains('ครั้งที่').should('be.visible');
        //         cy.get('label').contains('ผู้สร้างแบบประเมิน').should('be.visible');
        //         cy.get('label').contains('คำอธิบาย').should('be.visible');

        //         // ขั้นที่ 4: ตรวจสอบปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ
        //         cy.get('button[type="submit"]').should('be.disabled');
        //         cy.get('button[type="submit"]').should('have.attr', 'disabled');
        //         cy.log('✅ ปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ');

        //         // ขั้นที่ 5: แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
        //         cy.get('#assessment_code').clear().type('BCP_2025_TEST_CANCEL');
        //         cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA ยกเลิกการสร้าง');
        //         cy.get('#description').clear().type('การทดสอบการยกเลิกการสร้างแบบประเมินในระบบ E-CSA');
        //     })
        // })
    })

    describe('5.2.2 Create Assessment by Draft', () => {
        it('ADMINICDSENIOR-SN-135 : สามารถสร้างแบบประเมินโดยใช้ Draft ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/assessment');
            cy.url().should('include', '/assessment');
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);
            //ค้นหาแบบประเมินที่จะแก้ไข
            cy.get('#assessment_code').type('BCP_Test_Edit_For_Draft');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();
            cy.wait(2000);

            // cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(1)').click();

            const sectionCount = 1; // กำหนดจำนวน Section ที่ต้องการสร้าง
            const widgetsInSection = [
                'Yes/No',
                'Choice',
                'Checkbox',
                'Text',
                'Rating',
                'Ranking',
                'Date'
            ];

            cy.log('I การควบคุมภายในองค์กร (Control Environment)');
            cy.contains('I การควบคุมภายในองค์กร (Control Environment)').should('be.visible');
            cy.wait(2000);
            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(2)').click();
            cy.contains('II การประเมินความเสี่ยง (Risk Assessment)').should('be.visible');
            cy.wait(2000);

            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(3)').click();
            cy.contains('III การควบคุมการปฎิบัติงาน (Control Activities)').should('be.visible');
            cy.wait(2000);

            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }

            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(4)').click();
            cy.contains('IV ระบบสารสนเทศและการสื่อสารข้อมูล (Information & Communication)').should('be.visible');
            cy.wait(2000);

            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }
            cy.get('.flex.gap-4.w-full.overflow-x-auto.py-4.scrollbar-thin.scrollbar-thumb-gray-400.scrollbar-track-gray-200 > :nth-child(5)').click();
            cy.contains('V ระบบติดตาม (Monitoring & Activities)').should('be.visible');
            cy.wait(2000);

            for (let i = 0; i < sectionCount; i++) {
                const dataTransfer = new DataTransfer();
                cy.contains('Section').trigger('dragstart', { dataTransfer });
                cy.wait(1000);
                cy.get('.ant-form > .p-4')
                    .trigger('drop', { dataTransfer, force: true })
                    .trigger('dragend', { dataTransfer, force: true });
                cy.wait(1000);

                widgetsInSection.forEach((text) => {
                    cy.contains(text).first().trigger('dragstart', { dataTransfer });
                    cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
                        .last()
                        .find('.gap-4')
                        .first()
                        .trigger('drop', { dataTransfer, force: true })
                        .trigger('dragend', { dataTransfer, force: true });
                    cy.wait(1000);
                });
            }

        });
    })

});