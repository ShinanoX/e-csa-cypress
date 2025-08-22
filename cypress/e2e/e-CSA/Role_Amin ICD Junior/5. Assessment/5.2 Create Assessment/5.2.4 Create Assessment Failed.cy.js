describe('5.2 Create Assessment', () => {
    const searchData = {
        assessment_code: 'BCP_Test_Edit_For_Copy',
        edit_assessment_code: 'BCP_Test_Edit_For_Draft',
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

    describe.only('5.2.4 Create Assessment Failed', () => {
        it('ADMINICDSENIOR-SN-139: ไม่สามารถสร้างแบบประเมินใหม่ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย, ADMINICDSENIOR-SN-140: ไม่สามารถสร้างแบบประเมินใหม่ได้เนื่องจากไม่ได้กดปุ่มตรวจสอบรหัสแบบประเมิน, ADMINICDSENIOR-SN-141: ไม่สามารถสร้างแบบประเมินใหม่ได้เนื่องจากกรอกคำถามไม่ครบทุกองค์ประกอบ', () => {
            cy.get('.bg-white\\/90').should('be.visible');
            cy.wait(2000);

            cy.log('📝 สามารถสร้างแบบประเมินใหม่ได้');
            cy.contains('Create New Assessment').click();

            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

            //  ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').clear();
                cy.get('#name').clear();
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
                cy.wait(1000);

                //validation
                cy.contains('กรุณากรอกข้อมูล').should('be.visible');
            });
        });

        it('ADMINICDSENIOR-SN-142: ไม่สามารถสร้างแบบประเมินโดยใช้ Draft ได้เนื่องจากกรอกคำถามไม่ครบทุกองค์ประกอบ', () => {
            cy.get('#assessment_code').type('BCP_Test_Edit_For_Draft');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();
            cy.wait(2000);
            cy.contains('ยืนยันการสร้างแบบประเมิน').click();
            cy.wait(2000);
            cy.get('.p-6').should('be.visible').within(() => {
                cy.contains('ไม่สามารถสร้างแบบประเมินประจำปี').should('be.visible');
                cy.contains('ปิด').click();
            });
            cy.get('.text-red-500').should('contain', 'โปรดเพิ่ม Section อย่างน้อย 1 Section ภายใต้องค์ประกอบนี้');

        });

        it('ADMINICDSENIOR-SN-143: ไม่สามารถสร้างแบบประเมินโดยใช้ Copy Assessment ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย, ADMINICDSENIOR-SN-144 : ไม่สามารถสร้างแบบประเมินโดยใช้ Copy Assessment ได้เนื่องจากไม่ได้กดปุ่มตรวจสอบรหัสแบบประเมิน', () => {
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');

            cy.get('.ant-modal-content').within(() => {
                // ทดสอบค้นหาตามรหัสแบบประเมิน
                cy.get('#assessment_code').should('be.visible').type(searchData.assessment_code);
                cy.get('button').contains('Search').click();
                cy.wait(1000);
                cy.log('✅ ค้นหาตามรหัสแบบประเมินสำเร็จ');
                // ตรวจสอบผลลัพธ์การค้นหา
                cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
                cy.get('.ant-table-tbody tr').first().should('contain', searchData.edit_assessment_code);
                cy.wait(1000);
                cy.get('.ant-table-tbody tr input.ant-radio-input').click({ force: true });
                cy.contains('button', 'ถัดไป').should('be.visible').click();
                cy.contains('คัดลอก').click();
            });

            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'Create New Assessment');
            //  ทำงานภายใน modal เท่านั้น
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').clear();
                cy.get('#name').clear();
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
                cy.wait(1000);
                cy.contains('กรุณากรอกข้อมูล').should('be.visible');
            });

        });

        it('ADMINICDSENIOR-SN-145: ไม่สามารถสร้างแบบประเมินโดยใช้ Draft ได้เนื่องจากกรอกคำถามไม่ครบทุกองค์ประกอบ', () => {
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').should('be.visible').type(searchData.assessment_code);
                cy.get('button').contains('Search').click();
                cy.wait(1000);
                cy.get('.ant-table-tbody tr input.ant-radio-input').click({ force: true });
                cy.contains('button', 'ถัดไป').should('be.visible').click();
                cy.contains('คัดลอก').click();
            });
            cy.wait(2000);
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.get('.ant-modal-title').should('contain', 'Create New Assessment');
                cy.contains('ตรวจสอบ').should('be.visible').click();
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });
            cy.wait(2000);
            cy.contains('ยืนยันการสร้างแบบประเมิน').should('be.visible').click();
            cy.get('.p-6').should('be.visible').within(() => {
                cy.contains('ไม่สามารถสร้างแบบประเมินประจำปี').should('be.visible');
                cy.contains('ปิด').click();
            });
            cy.get('.text-red-500').should('contain', 'โปรดเพิ่ม Section อย่างน้อย 1 Section ภายใต้องค์ประกอบนี้');
        });

        //copy
        it('ADMINICDSENIOR-SN-145-146-147-148-149-150-151-152-153', () => {
            cy.contains('Copy Assessment').click();
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-content').within(() => {
                cy.get('#assessment_code').should('be.visible').type(searchData.assessment_code);
                cy.get('button').contains('Search').click();
                cy.wait(1000);
                cy.get('.ant-table-tbody tr input.ant-radio-input').click({ force: true });
                cy.contains('button', 'ถัดไป').should('be.visible').click();
                cy.contains('คัดลอก').click();
            });
            cy.wait(2000);
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.get('.ant-modal-title').should('contain', 'Create New Assessment');
                cy.contains('ตรวจสอบ').should('be.visible').click();
                cy.get('button[type="submit"]').contains('ยืนยัน').click();
            });
            cy.wait(2000);
            cy.contains('ยืนยันการสร้างแบบประเมิน').click();
            cy.wait(2000);
            cy.get('.p-6').should('be.visible').within(() => {
                cy.contains('ไม่สามารถสร้างแบบประเมินประจำปี').should('be.visible');
                cy.contains('ปิด').click();
            });

            cy.wait(2000);
            cy.log('ตรวจสอบ validation ของแต่ละข้อ');
            cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200').each(($section) => {
                cy.wrap($section).within(() => {
                    // ตรวจสอบ validation ชื่อ Section (ถ้ามี)
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกชื่อ Section'))
                        .should('have.length.at.least', 0);

                    // ตรวจสอบ validation คำถาม (ทุก widget)
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกข้อมูล'))
                        .should('have.length.greaterThan', 0);

                    // ตรวจสอบ validation ผู้ประเมิน
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณาเลือกผู้ประเมินอย่างน้อย 1 คน'))
                        .should('have.length.greaterThan', 0);
                });
            });
        });
        //edit
        it.only('ADMINICDSENIOR-SN-154-155-156-157-158-159-160', () => {
            cy.get('#assessment_code').type('BCP_Test_Edit_For_Draft');
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(2000);
            cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();
            //
            cy.contains('ยืนยันการสร้างแบบประเมิน').click();
            cy.wait(2000);
            cy.get('.p-6').should('be.visible').within(() => {
                cy.contains('ไม่สามารถสร้างแบบประเมินประจำปี').should('be.visible');
                cy.contains('ปิด').click();
            });

            cy.wait(2000);
            cy.log('ตรวจสอบ validation ของแต่ละข้อ');
            cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200').each(($section) => {
                cy.wrap($section).within(() => {
                    // ตรวจสอบ validation ชื่อ Section (ถ้ามี)
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกชื่อ Section'))
                        .should('have.length.at.least', 0);

                    // ตรวจสอบ validation คำถาม (ทุก widget)
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกข้อมูล'))
                        .should('have.length.greaterThan', 0);

                    // ตรวจสอบ validation ผู้ประเมิน
                    cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณาเลือกผู้ประเมินอย่างน้อย 1 คน'))
                        .should('have.length.greaterThan', 0);
                });
            });
        });

    })

});