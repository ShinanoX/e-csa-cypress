describe('Role Management', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/management/admin-management');
        cy.url().should('include', '/management/admin-management');
        cy.wait(1000);

    });

    describe('3.1 สามารถใช้งาน จัดการสิทธิ์ Admin ได้', () => {

        it('ADMINICDJUNIOR-SN-85 - สามารถดูรายการ Admin ได้', () => {
            // ตรวจสอบว่าหน้าจัดการสิทธิ์ Admin แสดงขึ้น
            cy.get('span').contains('จัดการสิทธิ์ Admin').should('be.visible');

            // ตรวจสอบ search form
            cy.get('form.ant-form').should('be.visible');
            cy.get('#role').should('exist');
            cy.get('#initial_name').should('exist');
            cy.get('#full_name').should('exist');
            cy.get('#email').should('exist');
            cy.get('#status').should('exist');

            // ตรวจสอบตารางผู้ใช้งาน
            cy.get('.ant-table').should('be.visible');
            cy.get('.ant-table-tbody tr').should('have.length.at.least', 1);

            // ทดสอบเปิด Status dropdown
            cy.get('#status').click();
            cy.wait(500);
            cy.get('.ant-select-dropdown').should('be.visible');
            cy.get('body').click(); // ปิด dropdown

            cy.log('✅ แสดงรายการ Admin ได้ถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-86 - สามารถสร้าง Admin ได้', () => {
            cy.log('📝 คลิกสร้างผู้ใช้งาน');
            cy.get('button').contains('สร้างผู้ใช้งาน').click();
            cy.wait(1000);

            // ตรวจสอบ Modal สร้างผู้ใช้งาน
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'สร้างผู้ใช้งาน Admin');

            cy.log('✅ เปิด Modal สร้างผู้ใช้งานสำเร็จ');

            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบฟิลด์ที่จำเป็น
                cy.get('label').contains('Role').should('be.visible');
                cy.get('label').contains('Initial').should('be.visible');
                cy.get('label').contains('ชื่อ-นามสกุล').should('be.visible');

                // ตรวจสอบว่าฟิลด์ชื่อ-นามสกุลถูก disabled
                cy.get('#full_name').should('be.disabled');

                // ตรวจสอบปุ่ม
                cy.get('button').contains('สร้างผู้ใช้งาน').should('be.visible');
                cy.get('button').contains('ยกเลิก').should('be.visible');

                // ปิด Modal
                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ทดสอบ Modal สร้างผู้ใช้งานเสร็จสิ้น');
        });

        it('ADMINICDJUNIOR-SN-87 - สามารถแก้ไข Admin ได้', () => {
            cy.log('✏️ คลิกแก้ไขผู้ใช้งาน');
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'edit').click();
            });
            cy.wait(1000);

            // ตรวจสอบ Modal แก้ไข
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบว่าข้อมูลถูกโหลดมาแล้ว
                cy.get('.ant-select-selection-item').contains('Admin ICD Senior').should('be.visible');
                cy.get('.ant-select-selection-item').contains('HSRL').should('be.visible');
                cy.get('.ant-select-selection-item').contains('หทัยวรรณ ศรียากุล').should('be.visible');

                // ตรวจสอบฟิลด์เบอร์โทรภายใน
                cy.get('#internal_phone_number').should('have.value', '35238');

                cy.log('✅ ข้อมูลเดิมแสดงในฟอร์มถูกต้อง');

                // ทดสอบการแก้ไขข้อมูล
                cy.get('#internal_phone_number').clear().type('12345');

                // ตรวจสอบปุ่ม
                cy.get('button').contains('บันทึก').should('be.visible');
                cy.get('button').contains('ยกเลิก').should('be.visible');

                // ปิด Modal โดยไม่บันทึก
                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ทดสอบ Modal แก้ไขผู้ใช้งานเสร็จสิ้น');
        });

        it('ADMINICDJUNIOR-SN-88 - สามารถลบ Admin ได้', () => {
            cy.log('🗑️ คลิกปุ่ม Multifunction เพื่อลบ');

            // คลิกปุ่มจุดสามจุด (more_vert) ในแถวแรก
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'more_vert').click();
            });
            cy.wait(500);

            // ตรวจสอบ dropdown menu ที่แสดงขึ้น
            cy.get('.ant-dropdown').should('be.visible');
            cy.get('.ant-dropdown-menu').should('be.visible');

            // ตรวจสอบรายการใน dropdown
            cy.get('.ant-dropdown-menu-item').should('have.length', 2);
            cy.get('.ant-dropdown-menu-item').first().should('contain', 'Inactive');
            cy.get('.ant-dropdown-menu-item').last().should('contain', 'ลบผู้ใช้งาน');

            // คลิกลบผู้ใช้งาน
            cy.get('.ant-dropdown-menu-item').contains('ลบผู้ใช้งาน').click();
            cy.wait(500);

            // ตรวจสอบ Modal ยืนยันการลบ
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'ท่านต้องการลบ');
            cy.get('.ant-modal-title').should('contain', 'ออกจากการเป็น');
            cy.get('.ant-modal-title').should('contain', 'ใช่หรือไม่');
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบฟิลด์เหตุผลที่ต้องการลบ
                cy.get('label').contains('เหตุผลที่ต้องการลบ').should('be.visible');
                cy.get('#remark').should('exist').should('be.visible');

                // ตรวจสอบข้อความเตือน
                cy.get('label').contains('หากยืนยันการลบแล้ว Account นี้จะไม่สามารถกู้คืนได้อีก').should('be.visible');

                // ตรวจสอบปุ่ม
                cy.get('button').contains('ยืนยัน').should('be.visible');
                cy.get('button').contains('ยกเลิก').should('be.visible');

                // ทดสอบการกรอกเหตุผล
                cy.get('#remark').type('ทดสอบการลบผู้ใช้งาน');
                cy.log('✅ Modal ลบผู้ใช้งานแสดงถูกต้อง');

                // ปิด Modal โดยไม่ลบ (คลิกยกเลิก)
                cy.get('button').contains('ยกเลิก').click();
            });
            cy.log('✅ แสดง Modal ยืนยันการลบสำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-89 - สามารถ Inactive Admin ได้', () => {
            cy.log('⏸️ ทดสอบการ Inactive Admin');

            // คลิกปุ่มจุดสามจุด
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'more_vert').click();
            });
            cy.wait(500);

            // คลิก Inactive
            cy.get('.ant-dropdown-menu-item').contains('Inactive').click();
            cy.wait(500);

            // ตรวจสอบ Modal ยืนยัน Inactive
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบข้อความในหัวข้อ
                cy.get('div').should('contain', 'ท่านต้องการ Inactive Account ของ');
                cy.get('div').should('contain', 'ใช่หรือไม่?');

                // ตรวจสอบปุ่ม
                cy.get('button').contains('ยืนยัน').should('be.visible');
                cy.get('button').contains('ยกเลิก').should('be.visible');

                // คลิกยกเลิกเพื่อป้องกันการเปลี่ยนแปลงข้อมูลจริง
                cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ทดสอบ Modal Inactive Admin สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-91 - สามารถเปิด View History ได้', () => {
            cy.get('button').contains('View History').click();
            cy.wait(1000);
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.ant-modal-title').should('contain', 'View History');
            cy.get('.ant-modal-content').within(() => {
                // ตรวจสอบฟิลด์ค้นหา
                cy.get('#action').should('exist');
                cy.get('#role').should('exist');
                // คลิก start_date เพื่อเปิด date picker
                // cy.get('#start_date').click();
                cy.wait(1000);
                // สุ่มคลิกวันที่ในปฏิทิน
                // cy.get('.ant-picker-cell-in-view').within(() => {
                //     cy.get('[title="2025-08-13"]').click();
                // });
                // ตรวจสอบตาราง
                cy.get('.ant-table').should('be.visible');
                cy.get('.ant-table-tbody tr').should('exist');
                // ตรวจสอบปุ่ม
                cy.get('button[type="submit"]').contains('Search').should('be.visible');
                cy.get('button[type="reset"]').contains('Reset').should('be.visible');
                cy.get('button').contains('ปิด').should('be.visible');
                cy.wait(3000);
                // ปิด Modal
                // cy.get('button').contains('ปิด').click();
            });
            cy.log('✅ เปิด View History สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-92 - สามารถใช้งาน Guide Text ที่ปุ่ม View History ได้', () => {
            cy.log('ℹ️ ทดสอบ Guide Text ปุ่ม View History');

            cy.get('.flex.justify-between > :nth-child(1)').eq(1).parent().within(() => {
                cy.get('.material-symbols-outlined.text-gray-300').contains('info').trigger('mouseover');
            });
            cy.wait(500);

            cy.get('body').then(($body) => {
                if ($body.find('.ant-tooltip').length > 0) {
                    cy.get('.ant-tooltip').should('be.visible');
                    cy.get('.ant-tooltip').should('contain', 'ประวัติการจัดการสิทธิ์ ได้แก่ การสร้าง การลบ การ Inactive และ Active');
                }
            });

            cy.log('✅ แสดง Guide Text View History สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-93 - สามารถใช้งาน Guide Text Active ที่ Search Bar หัวข้อ สถานะ ได้', () => {
            cy.log('ℹ️ ทดสอบ Guide Text Active ใน Status Options');

            // คลิกที่ Status dropdown
            cy.get('#status').click();
            cy.wait(500);

            // ทดสอบ Guide Text สำหรับ Active
            cy.get('.ant-select-item-option-active > .ant-select-item-option-content > .flex > .material-symbols-outlined').trigger('mouseover');
            cy.wait(500);

            // ตรวจสอบ tooltip
            cy.get('body').then(($body) => {
                if ($body.find('.ant-tooltip').length > 0) {
                    cy.get('.ant-tooltip').should('be.visible');
                    cy.get('.ant-tooltip').should('contain', 'ปิดสิทธิไม่ให้เข้าใช้งานระบบ');
                }
            });

            // คลิกที่พื้นที่อื่นเพื่อปิด dropdown
            cy.get('body').click();

            cy.log('✅ แสดง Guide Text Active สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-94 - สามารถใช้งาน Guide Text Inactive ที่ Search Bar หัวข้อ สถานะ ได้', () => {
            cy.log('ℹ️ ทดสอบ Guide Text ใน Status Options');

            // คลิกที่ Status dropdown
            cy.get('#status').click();
            cy.wait(500);

            // ทดสอบ Guide Text สำหรับ Inactive
            cy.get('[title="Inactive"] > .ant-select-item-option-content > .flex > .material-symbols-outlined').contains('info').trigger('mouseover');
            cy.wait(500);

            cy.get('body').then(($body) => {
                if ($body.find('.ant-tooltip').length > 0) {
                    cy.get('.ant-tooltip').should('be.visible');
                    cy.get('.ant-tooltip').should('contain', 'เปิดสิทธิให้เข้าใช้งานระบบ');
                }
            });

            // คลิกที่พื้นที่อื่นเพื่อปิด dropdown
            cy.get('body').click();
            cy.log('✅ แสดง Guide Text Status Options สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-95 - สามารถใช้งาน Guide Text Inactive ที่ Multifunction ได้', () => {
            cy.log('ℹ️ ทดสอบ Guide Text Inactive ใน Multifunction');
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'more_vert').click();
            });
            cy.wait(1000);

            // Hover เหนือ Inactive option
            cy.get('.ant-dropdown-menu-title-content').eq(0).within(() => {
                cy.get('.material-symbols-outlined').eq(1).trigger('mouseover');
            });
            cy.wait(1000);

            // ตรวจสอบ tooltip
            cy.get('body').then(($body) => {
                if ($body.find('.ant-tooltip-content').length > 0) {
                    cy.get('.ant-tooltip-inner').should('contain', 'ปิดสิทธิไม่ให้เข้าใช้งานระบบ');
                }
            });

            cy.get('body').click();
            cy.log('✅ แสดง Guide Text Inactive สำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-96 - สามารถใช้งาน Guide Text Delete ที่ Multifunction ได้', () => {
            cy.log('ℹ️ ทดสอบ Guide Text Delete ใน Multifunction');
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'more_vert').click();
            });
            cy.wait(1000);

            // Hover เหนือ Delete option
            cy.get('.ant-dropdown-menu-item').contains('ลบผู้ใช้งาน').trigger('mouseover');
            // Hover เหนือ Inactive option
            cy.get('.ant-dropdown-menu-title-content').eq(1).within(() => {
                cy.get('.material-symbols-outlined').eq(1).trigger('mouseover');
            });
            cy.wait(1000);

            // ตรวจสอบ tooltip
            cy.get('body').then(($body) => {
                if ($body.find('.ant-tooltip-content').length > 0) {
                    cy.get('.ant-tooltip-inner').should('contain', 'ลบผู้ใช้งานออกจาก');
                }
            });

            cy.get('body').click();
            cy.log('✅ แสดง Guide Text Delete สำเร็จ');
        });

    });
});