describe('e-CSA User Manual', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/user-manual');
        cy.url().should('include', '/master-data/user-manual');
    });

    describe('User Manual Page', () => {
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
            cy.get('.gap-6 > .w-full > .flex').contains('ปิด').click();
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

        it('TC-UM-005: ทดสอบการลบไฟล์', () => {
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

            cy.get('.gap-6').should('be.visible');
            cy.get('.gap-6 > .w-full > .flex').contains('ปิด').click();
            cy.wait(1000);

            cy.log('✅ การลบไฟล์ e-CSA TEST PDF.pdf ทำงานถูกต้อง');
        });

        it('TC-UM-002: ทดสอบ Switch และการทำงานของปุ่ม', () => {
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

    describe.only('2.4.2 ไม่สามารถใช้งาน การจัดการ User Manual ได้', () => {
        it('ADMINICDJUNIOR-SN-45: ไม่สามารถอัพโหลดไฟล์ User Manual ได้ เนื่องจากไฟล์มีขนาดเกิน 20 mb', () => {
            // คลิกปุ่ม Upload ใน Role Admin
            cy.get('h2').contains('Role Admin').parent().within(() => {
                cy.get('button').contains('Upload').should('be.visible').click();
            });
            cy.wait(1000);

            // ตรวจสอบ Modal Upload
            cy.get('.ant-modal-content').eq(0).should('be.visible');
            cy.get('.ant-modal-title').should('contain.text', 'Upload User Manual');

            cy.get('.ant-modal-content').within(() => {
                // อัพโหลดไฟล์ขนาดใหญ่
                cy.get('input[accept=".pdf,.docx,.pptx"]').selectFile('cypress\\fixtures\\30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });
                // ตรวจสอบว่าไฟล์แสดงเป็นสีแดง (ไฟล์ขนาดใหญ่เกินกำหนด)
                cy.get('.text-red-500').should('exist');
                cy.log('ไฟล์ขนาดใหญ่เกินกำหนดแสดงเป็นสีแดง');

                // ตรวจสอบว่ามีปุ่มลบไฟล์ (delete button) แสดงเป็นสีแดง
                cy.get('button.text-red-500').should('be.visible');

                // ตรวจสอบข้อความแจ้งเตือนขนาดไฟล์
                cy.contains('รองรับเฉพาะไฟล์ .pdf , .docx, .pptx และขนาดไม่เกิน 20 MB ต่อไฟล์').should('be.visible');
                cy.contains('อัพโหลดไฟล์').should('be.disabled');
                cy.contains('ยืนยัน').should('be.disabled').should('have.css', 'cursor', 'not-allowed');
                // cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ตรวจสอบไม่สามารถอัพโหลดไฟล์ขนาดใหญ่สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-46: ไม่สามารถอัพโหลดไฟล์ User Manual ได้ เนื่องจากอัพโหลดไฟล์อื่นที่ไม่ใช่ .pdf , .docx หรือ .pptx', () => {
            // คลิกปุ่ม Upload ใน Role Admin
            cy.get('h2').contains('Role Admin').parent().within(() => {
                cy.get('button').contains('Upload').should('be.visible').click();
            });
            cy.wait(1000);

            // ตรวจสอบ Modal Upload
            cy.get('.ant-modal-content').eq(0).should('be.visible');
            cy.get('.ant-modal-title').should('contain.text', 'Upload User Manual');

            cy.get('.ant-modal-content').within(() => {
                // อัพโหลดไฟล์ขนาดใหญ่
                cy.get('input[accept=".pdf,.docx,.pptx"]').selectFile('cypress\\fixtures\\image\\jjpng.jpg', { force: true });
                // ตรวจสอบว่าไฟล์แสดงเป็นสีแดง (ไฟล์ขนาดใหญ่เกินกำหนด)
                cy.get('.text-red-500').should('exist');

                // ตรวจสอบว่ามีปุ่มลบไฟล์ (delete button) แสดงเป็นสีแดง
                cy.get('button.text-red-500').should('be.visible');
                cy.log('ไฟล์ขนาดใหญ่เกินกำหนดแสดงเป็นสีแดง');

                // ตรวจสอบข้อความแจ้งเตือนขนาดไฟล์
                cy.contains('รองรับเฉพาะไฟล์ .pdf , .docx, .pptx และขนาดไม่เกิน 20 MB ต่อไฟล์').should('be.visible');
                cy.contains('อัพโหลดไฟล์').should('be.disabled');
                cy.contains('ยืนยัน').should('be.disabled').should('have.css', 'cursor', 'not-allowed');
                // cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ตรวจสอบไม่สามารถอัพโหลดไฟล์ขนาดใหญ่สำเร็จ');
        });
    })

    it('TC-UM-001: ทดสอบหน้า User Manual และข้อมูลในตาราง', () => {
        cy.log('✅ ทดสอบหน้า User Manual โหลดข้อมูลถูกต้อง');

        // ตรวจสอบหัวข้อหน้า
        cy.contains('การจัดการ').should('be.visible');
        cy.contains('User Manual').should('be.visible');

        cy.log('📊 ทดสอบตาราง Role Admin');

        // ตรวจสอบตาราง Role Admin
        cy.contains('Role Admin').should('be.visible');
        cy.get('h2').contains('Role Admin').parent().parent().within(() => {
            // ตรวจสอบ header
            cy.contains('ลำดับ').should('be.visible');
            cy.contains('คู่มือ').should('be.visible');
            cy.contains('วันเวลาที่ Upload').should('be.visible');
            cy.contains('เปิดใช้งาน').should('be.visible');

            // ตรวจสอบข้อมูลแถวแรก
            // cy.get('.ant-table-tbody tr').first().within(() => {
            //     cy.get('td').eq(0).should('contain.text', '1');
            //     cy.get('td').eq(1).should('contain.text', '[eCSA] User Manual Test Ecsa.pdf');
            //     cy.get('.ant-switch').should('be.visible');
            //     cy.get('button').contains('delete').should('be.visible');
            // });
        });

        cy.log('📊 ทดสอบตาราง Role Assessor / Preparer');

        // ตรวจสอบตาราง Role Assessor / Preparer
        cy.contains('Role Assessor / Preparer').should('be.visible');
        cy.get('h2').contains('Role Assessor / Preparer').parent().parent().within(() => {
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('td').eq(0).should('contain.text', '1');
                cy.get('td').eq(1).should('contain.text', 'BCP_SSL_VPN_Manual.pdf');
                cy.get('.ant-switch').should('be.visible');
                cy.get('.ant-switch').should('have.class', 'ant-switch-checked');
            });
        });

        cy.log('✅ หน้า User Manual และข้อมูลในตารางแสดงถูกต้อง');
    });

    it('TC-UM-002: ทดสอบ Switch และการทำงานของปุ่ม', () => {
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

        cy.log('📤 ทดสอบปุ่ม Upload');

        // ทดสอบปุ่ม Upload ใน Role Admin
        cy.get('h2').contains('Role Admin').parent().within(() => {
            cy.get('button').contains('Upload').should('be.visible').click();
        });
        cy.wait(1000);

        // ตรวจสอบ Modal หรือการเปลี่ยนแปลง
        cy.get('body').then(($body) => {
            if ($body.find('.ant-modal-content').length > 0) {
                cy.get('.ant-modal-close').click();
            }
        });

        cy.log('✅ Switch และปุ่มทำงานถูกต้อง');
    });

    it('TC-UM-003: ทดสอบการคลิกชื่อไฟล์', () => {
        cy.log('📄 ทดสอบการคลิกชื่อไฟล์ใน Role Admin');

        // คลิกชื่อไฟล์ใน Role Admin
        cy.get('h2').contains('Role Admin').parent().parent().within(() => {
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.text-\\[\\#4CB847\\]').click();
            });
        });
        cy.wait(1000);

        // ปิด Modal ถ้ามี
        cy.get('body').then(($body) => {
            if ($body.find('.ant-modal-content').length > 0) {
                cy.get('.ant-modal-close').click();
            }
        });

        cy.log('📄 ทดสอบการคลิกชื่อไฟล์ใน Role Assessor / Preparer');

        // คลิกชื่อไฟล์ใน Role Assessor / Preparer
        cy.get('h2').contains('Role Assessor / Preparer').parent().parent().within(() => {
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.text-\\[\\#4CB847\\]').click();
            });
        });
        cy.wait(1000);

        // ปิด Modal ถ้ามี
        cy.get('body').then(($body) => {
            if ($body.find('.ant-modal-content').length > 0) {
                cy.get('.ant-modal-close').click();
            }
        });

        cy.log('✅ การคลิกชื่อไฟล์ทำงานถูกต้อง');
    });

    it('TC-UM-004: ทดสอบการ upload ไฟล์', () => {
        cy.log('📤 ทดสอบการ upload ไฟล์ใน Role Admin');

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
        cy.get('.gap-6 > .w-full > .flex').contains('ปิด').click();

        cy.log('✅ การ upload ไฟล์ทำงานถูกต้อง');
    });

    it('TC-UM-005: ทดสอบการลบไฟล์', () => {
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

        cy.get('.gap-6').should('be.visible');
        cy.get('.gap-6 > .w-full > .flex').contains('ปิด').click();
        cy.wait(1000);

        cy.log('✅ การลบไฟล์ e-CSA TEST PDF.pdf ทำงานถูกต้อง');
    });
});
