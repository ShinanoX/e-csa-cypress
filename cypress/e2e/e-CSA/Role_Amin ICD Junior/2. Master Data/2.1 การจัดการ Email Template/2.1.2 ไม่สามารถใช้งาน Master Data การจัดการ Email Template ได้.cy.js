const { faker } = require("@faker-js/faker");

describe('Master Data', () => {
    beforeEach(() => {
        cy.loginApiRoleAdmin();
        cy.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('Minified React error #418') ||
                err.message.includes('visit https://react.dev/errors') ||
                err.message.includes('React') ||
                err.message.includes('chunk loading failed') ||
                err.message.includes('HTML')) {
                return false;
            }
            return true;
        });
    });

    describe('2.1.2 ไม่สามารถใช้งาน Master Data การจัดการ Email Template ได้', () => {
        it('ADMINICDJUNIOR-SN-18 - ไม่สามารถแก้ไข Template ได้ เนื่องจากกรอกรายละเอียดข้อมูลแบบประเมินไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
            cy.wait(2000);

            // ทดสอบ Template EML-04-001 (มี Remind 1)
            cy.get('#code').type('EML-04-001');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            // คลิกปุ่ม "แก้ไขข้อมูล"
            cy.contains('แก้ไขข้อมูล').click();

            // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
            cy.get('.ant-modal').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

            // ทดสอบกรณีไม่กรอกข้อมูลใด ๆ เลย
            cy.get('.ant-modal').within(() => {
                // เคลียร์ข้อมูลทั้งหมด
                cy.get('#name').clear();
                cy.get('#stage_no').clear();
                cy.get('#stage_desc').clear();
                cy.get('#remind1').clear();

                // ตรวจสอบ validation messages โดยใช้ class ที่ถูกต้อง
                cy.get('.ant-form-item-explain-error').should('have.length', 4); // มี 4 error messages

                // ตรวจสอบ error message แต่ละฟิลด์
                cy.get('#name_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#stage_no_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#stage_desc_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#remind1_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

                // ตรวจสอบว่าฟิลด์มี error state
                cy.get('#name').should('have.class', 'ant-input-status-error');
                cy.get('#stage_no').should('have.attr', 'aria-invalid', 'true');
                cy.get('#stage_desc').should('have.class', 'ant-input-status-error');
                cy.get('#remind1').should('have.class', 'ant-input-status-error');

                // ตรวจสอบว่าปุ่มบันทึกถูก disable
                cy.get('button[type="submit"]').should('be.disabled');
                cy.get('button[type="submit"]').should('have.class', 'bg-[#F3F4F6]');
                cy.get('button[type="submit"]').should('have.css', 'cursor', 'not-allowed');
            });

            // ปิด modal และทดสอบ Template EML-02-006 (มี Remind 1 และ 2)
            cy.get('.ant-modal-close').click();
            cy.contains('การจัดการ e-mail Template').click();
            cy.wait(1000);

            cy.get('#code').clear().type('EML-02-006');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            cy.contains('แก้ไขข้อมูล').click();

            cy.get('.ant-modal').within(() => {
                // เคลียร์ข้อมูลทั้งหมด
                cy.get('#name').clear();
                cy.get('#stage_no').clear();
                cy.get('#stage_desc').clear();
                cy.get('#remind1').clear();
                cy.get('#remind2').clear();

                // ตรวจสอบ validation messages สำหรับ EML-02-006 (จะมี 5 error messages)
                cy.get('.ant-form-item-explain-error').should('have.length', 5);

                // ตรวจสอบ error message แต่ละฟิลด์
                cy.get('#name_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#stage_no_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#stage_desc_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#remind1_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#remind2_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

                // ตรวจสอบว่าปุ่มบันทึกถูก disable
                cy.get('button[type="submit"]').should('be.disabled');
            });
        });

        it('ADMINICDJUNIOR-SN-19 - ไม่สามารถแก้ไข Template ได้ เนื่องจาก Remind ที่ไม่ใช่ตัวเลข', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
            cy.wait(2000);

            // ทดสอบ Template EML-04-001
            cy.get('#code').type('EML-04-001');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            cy.contains('แก้ไขข้อมูล').click();

            cy.get('.ant-modal').within(() => {
                // กรอกข้อมูลปกติ
                cy.get('#name').clear().type('Test Email Subject');
                cy.get('#stage_no').clear().type('1');
                cy.get('#stage_desc').clear().type('Test Stage Description');

                // กรอก Remind ด้วยตัวอักษร
                cy.get('#remind1').clear().type('abc123');

                // ตรวจสอบ validation error สำหรับ Remind 1
                cy.get('#remind1_help .ant-form-item-explain-error')
                    .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');

                // ตรวจสอบ error state ของ input field
                cy.get('#remind1').should('have.class', 'ant-input-status-error');
                cy.get('#remind1').should('have.attr', 'aria-invalid', 'true');
                cy.get('#remind1').should('have.value', 'abc123');

                // ตรวจสอบว่าปุ่มบันทึกถูก disable
                cy.get('button[type="submit"]').should('be.disabled');

                // พยายามคลิกบันทึก (ถึงแม้จะ disabled)
                cy.contains('บันทึก').click({ force: true });
            });

            // ปิด modal และทดสอบ Template EML-02-006
            cy.get('.ant-modal-close').click();
            cy.contains('การจัดการ e-mail Template').click();
            cy.wait(1000);

            cy.get('#code').clear().type('EML-02-006');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            cy.contains('แก้ไขข้อมูล').click();

            cy.get('.ant-modal').within(() => {
                cy.get('#name').clear().type('Test Email Subject 2');
                cy.get('#stage_no').clear().type('2');
                cy.get('#stage_desc').clear().type('Test Stage Description 2');

                // กรอก Remind 1 และ 2 ด้วยตัวอักษร
                cy.get('#remind1').clear().type('xyz789');
                cy.get('#remind2').clear().type('def456');

                // ตรวจสอบ validation errors สำหรับทั้ง Remind 1 และ 2
                cy.get('#remind1_help .ant-form-item-explain-error')
                    .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');
                cy.get('#remind2_help .ant-form-item-explain-error')
                    .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');

                // ตรวจสอบ error states
                cy.get('#remind1').should('have.class', 'ant-input-status-error');
                cy.get('#remind1').should('have.attr', 'aria-invalid', 'true');
                cy.get('#remind1').should('have.value', 'xyz789');

                cy.get('#remind2').should('have.class', 'ant-input-status-error');
                cy.get('#remind2').should('have.attr', 'aria-invalid', 'true');
                cy.get('#remind2').should('have.value', 'def456');

                // ตรวจสอบว่าปุ่มบันทึกถูก disable
                cy.get('button[type="submit"]').should('be.disabled');

                // พยายามคลิกบันทึก (ถึงแม้จะ disabled)
                cy.contains('บันทึก').click({ force: true });
            });
        });

        it('ADMINICDJUNIOR-SN-20 - ไม่สามารถแก้ไข Template ได้ เนื่องจากไม่ได้กรอก Subject', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
            cy.wait(2000);

            // เลือก Template ใดก็ได้
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
            cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');
            cy.wait(3000)

            // เคลียร์ Subject
            cy.get('[data-slate-editor="true"][contenteditable="true"] > [data-slate-node="element"]').first().click().clear();

            // ตรวจสอบว่า Subject ว่างเปล่า - อาจมี <br> tag เหลืออยู่
            cy.get('[data-slate-editor="true"][contenteditable="true"]').first().within(() => {
                cy.get('[data-slate-node="element"]').should(($el) => {
                    const text = $el.text().trim();
                    expect(text).to.be.empty;
                });
            });

            // หรือตรวจสอบโดยตรงว่ามีเฉพาะ <br> tag
            cy.get('[data-slate-editor="true"][contenteditable="true"]').first()
                .find('[data-slate-node="element"]')
                .should('contain.html', '<br>');
        });

        it('ADMINICDJUNIOR-SN-21 - ไม่สามารถแก้ไข Template ได้ เนื่องจากไม่ได้กรอก Body', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
            cy.wait(2000);

            // เลือก Template ใดก็ได้
            cy.get('.ant-table-tbody tr').first().find('button').first().click();
            cy.wait(1000);

            // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
            cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');
            cy.wait(3000)

            // เคลียร์ Body
            cy.get('[data-slate-editor="true"][contenteditable="true"] > [data-slate-node="element"]').last().click().clear();

            // ตรวจสอบว่า Body ว่างเปล่า - อาจมี <p><br></p> tag เหลืออยู่
            cy.get('[data-slate-editor="true"][contenteditable="true"]').last().within(() => {
                cy.get('p[data-slate-node="element"]').should(($el) => {
                    const text = $el.text().trim();
                    expect(text).to.be.empty;
                });
            });

            // หรือตรวจสอบโดยตรงว่ามีเฉพาะ <p><br></p> tag
            cy.get('[data-slate-editor="true"][contenteditable="true"]').last()
                .find('p[data-slate-node="element"]')
                .should('contain.html', '<br>');
            cy.contains('บันทึก').click();
            // ตรวจสอบ validation message
            cy.get('.ant-modal-body .p-6').within(() => {
                cy.contains('บันทึกฉบับร่างของแบบประเมินประจำปีไม่สำเร็จ').should('be.visible');
                cy.contains('ปิด').click();
            });

        });
    });

})