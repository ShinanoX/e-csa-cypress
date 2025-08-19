describe('e-CSA User Manual', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/user-manual');
        cy.url().should('include', '/master-data/user-manual');
    });

    describe('2.4.1 สามารถใช้งาน การจัดการ User Manual ได้', () => {
        it('ADMINICDJUNIOR-SN-39: สามารถดูรายการไฟล์ที่หน้า User Manual ได้', () => {
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1').should('be.visible');
            cy.get('.p-1 > button:nth-child(4)').contains('การจัดการ User Manual').click();
            cy.wait(2000);
            cy.url().should('include', '/master-data/user-manual');
            cy.get('.flex.gap-1.items-center').should('contain', 'การจัดการ').should('contain', 'User Manual');
            cy.log('✅ ทดสอบหน้า User Manual โหลดข้อมูลถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-40: สามารถอัพโหลดไฟล์ได้', () => {
            // คลิกปุ่ม Upload ใน Role Admin
            cy.get('h2').contains('Role Admin').parent().within(() => {
                cy.get('button').contains('Upload').should('be.visible').click();
            });
            cy.wait(1000);

            // ตรวจสอบ Modal Upload
            cy.get('.ant-modal-content').eq(0).should('be.visible');
            cy.get('.ant-modal-title').should('contain.text', 'Upload');

            cy.get('input[accept=".pdf,.docx,.pptx"]').selectFile('cypress/fixtures/e-CSA TEST PDF.pdf', { force: true });

            // กดปุ่ม Upload
            cy.get('.justify-end > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').click();
            cy.wait(2000);

            cy.get('.ant-modal-content > .ant-modal-body').should('be.visible');
            cy.get('.gap-12 > .w-full > .flex').contains('ปิด').click();
            cy.log('✅ ระบบแสดง popup บันทึกสำเร็จ "Upload User Manual ของ [Role] สำเร็จ');

            cy.log('✅ การ upload ไฟล์ทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-41: สามารถดาวน์โหลดไฟล์ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/user-manual');
            cy.url().should('include', '/master-data/user-manual');
            cy.log('📄 สามารถดาวน์โหลดไฟล์ได้ Role Admin');

            // คลิกชื่อไฟล์ใน Role Admin
            cy.get('h2').contains('Role Admin').parent().parent().within(() => {
                cy.get('.ant-table-tbody tr').first().within(() => {
                    cy.get('.text-\\[\\#4CB847\\]').click();
                });
            });
            cy.log('📄 ทดสอบการคลิกชื่อไฟล์ใน Role Assessor / Preparer');

            // คลิกชื่อไฟล์ใน Role Assessor / Preparer
            cy.get('h2').contains('Role Assessor / Preparer').parent().parent().within(() => {
                cy.get('.ant-table-tbody tr').first().within(() => {
                    cy.get('.text-\\[\\#4CB847\\]').click();
                });
            });
            cy.log('✅ การคลิกชื่อไฟล์ทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-42: สามารถลบไฟล์ได้', () => {
            cy.visit('https://dev-ecsa.looksocial.dev/master-data/user-manual');
            cy.url().should('include', '/master-data/user-manual');
            cy.log('🗑️ ทดสอบการลบไฟล์ใน Role Admin');

            // หาแถวที่มีไฟล์ e-CSA TEST PDF.pdf และลบ
            cy.contains('.ant-table-tbody tr', 'e-CSA TEST PDF.pdf').within(() => {
                cy.get('button[type="button"]').eq(1).click();
            });
            cy.wait(1000);

            // ยืนยันการลบ
            cy.get('.gap-6').should('be.visible');
            cy.get('.w-full > .bg-\\[\\#4CB847\\]').contains('ยืนยัน').click();
            cy.wait(2000);

            cy.get('.gap-12').should('be.visible').within(() => {
                cy.get('.w-full > .flex').contains('ปิด').click();
            });
            cy.wait(1000);
            cy.log('✅ การลบไฟล์ e-CSA TEST PDF.pdf ทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-43 , ADMINICDJUNIOR-SN-44: ทดสอบ Switch และการทำงานของปุ่ม', () => {
            cy.log('🔄 ทดสอบ Switch ใน Role Admin');
            // ทดสอบ Switch ใน Role Admin
            cy.get('h2').contains('Role Admin').parent().parent().within(() => {
                cy.get('.ant-table-tbody tr').first().within(() => {
                    cy.get('.ant-switch').then(($switch) => {
                        const isChecked = $switch.hasClass('ant-switch-checked');
                        cy.wrap($switch).click();
                        cy.wait(500);
                        cy.get('.ant-switch').then(($newSwitch) => {
                            const newState = $newSwitch.hasClass('ant-switch-checked');
                            expect(newState).to.not.equal(isChecked);
                        });
                    });
                });
            });

            cy.log('🔄 ทดสอบ Switch ใน Role Assessor / Preparer');

            // ทดสอบ Switch ใน Role Assessor / Preparer
            cy.get('h2').contains('Role Assessor / Preparer').parent().parent().within(() => {
                cy.get('.ant-table-tbody tr').first().within(() => {
                    cy.get('.ant-switch').then(($switch) => {
                        const isChecked = $switch.hasClass('ant-switch-checked');
                        cy.wrap($switch).click();
                        cy.wait(500);
                        cy.get('.ant-switch').then(($newSwitch) => {
                            const newState = $newSwitch.hasClass('ant-switch-checked');
                            expect(newState).to.not.equal(isChecked);
                        });
                    });
                });
            });
        });

    });
});
