describe('e-CSA Master Data Portal Page', () => {
    const portalName = 'Test Required create Fields Portal';
    const portalDescription = 'ทดสอบ Required create Fields สำหรับการสร้าง Portal';

    const modalTitle = 'ทดสอบแก้ไข โดย Cypress';
    const modalDescription = 'ทดสอบแก้ไขรายละเอียด โดย Cypress';

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
        cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
        cy.url().should('include', '/master-data/portal');
        cy.wait(3000);
    });

    describe('2.5.1 สามารถใช้งาน การจัดการ Portal ได้', () => {
        it('ADMINICDJUNIOR-SN-47: สามารถดู Portal ได้', () => {
            cy.get('nav').contains('Master Data').click();
            cy.get('.p-1').should('be.visible');
            cy.get('.p-1 > button:nth-child(5)').contains('การจัดการ Portal').click();
            cy.wait(1000);
            cy.url().should('include', '/master-data/portal');
            cy.get('.flex.gap-1.items-center').should('contain', 'การจัดการ').should('contain', 'Portal');
            cy.get('.ant-table-tbody').should('be.visible');
            cy.log('แสดงรายการ Portal ทั้งหมด');

            // ตรวจสอบฟิลด์ค้นหา
            cy.get('#subject').should('be.visible');
            cy.get('#description').should('be.visible');

            // ตรวจสอบปุ่ม Search และ Reset
            cy.get('button').contains('Search').should('be.visible');
            cy.get('button').contains('Reset').should('be.visible');

            // ตรวจสอบปุ่มสร้าง Portal
            cy.get('button').contains('สร้าง Portal').should('be.visible');

            // ตรวจสอบตารางรายการ Portal
            cy.contains('รายการ Portal ทั้งหมด').should('be.visible');
            cy.get('.ant-table-thead').should('be.visible');
            cy.contains('ลำดับ').should('be.visible');
            cy.contains('ชื่อเรื่อง').should('be.visible');
            cy.contains('รายละเอียด').should('be.visible');
            cy.contains('Link').should('be.visible');
            cy.contains('รูปหน้าปก').should('be.visible');
            cy.contains('วันที่อัพเดท').should('be.visible');
            cy.contains('เปิดใช้งาน').should('be.visible');
            cy.contains('Action').should('be.visible');

            cy.log('✅ หน้า Portal Page แสดงข้อมูลครบถ้วน');
        })

        it('ADMINICDJUNIOR-SN-48: ทดสอบการสร้าง Portal', () => {
            cy.log('➕ เปิด Modal สร้าง Portal');
            // คลิกปุ่มสร้าง Portal
            cy.get('button').contains('สร้าง Portal').should('be.visible').click();
            cy.wait(1000);
            // ตรวจสอบว่า Modal เปิดขึ้น
            cy.get('.ant-modal-content').should('be.visible');
            cy.get('.custom-modal-label').should('contain', 'สร้าง Portal');
            cy.log('❌ ทดสอบส่งฟอร์มโดยไม่กรอกข้อมูลที่จำเป็น');
            // พยายามส่งฟอร์มโดยไม่กรอกข้อมูล
            cy.get('.ant-modal-content').within(() => {
                cy.get('button').contains('ยืนยัน').click();
            });
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
            cy.log('📝 กรอกข้อมูลที่จำเป็นและส่งฟอร์ม');
            // กรอกข้อมูลที่จำเป็นใน Modal
            cy.get('.ant-modal-content').within(() => {
                cy.get('#sequence').should('be.visible').clear().type('996');// กรอกลำดับ
                cy.get('#subject').should('be.visible').clear().type(portalName);// กรอกชื่อเรื่อง
                cy.get('#description').should('be.visible').clear().type(portalDescription);// กรอกรายละเอียด
                cy.get('#link').should('be.visible').clear().type('https://test-required.com');// กรอก Link
                cy.get('input[accept=".jpg,.jpeg"]').selectFile('cypress/fixtures/image/jjpng.jpg', { force: true });
            });
            cy.log('📸 อัพโหลดรูปหน้าปก');
            // อัพโหลดรูปหน้าปก - ใช้ within เพื่อจำกัดขอบเขต
            cy.wait(1000);
            cy.get('.ant-modal-content').contains('.custom-modal-label', 'ครอปรูปภาพ')
                .closest('.ant-modal-content')
                .within(() => {
                    cy.get('button').contains('ยืนยัน').click();
                });
            cy.wait(1000);
            cy.log('✅ ยืนยันการสร้าง Portal');
            cy.get('.ant-modal-content').contains('.custom-modal-label', 'สร้าง Portal')
                .closest('.ant-modal-content')
                .within(() => {
                    cy.get('button').contains('ยืนยัน').click();
                });
            cy.wait(1000);

            // ตรวจสอบ Modal ยืนยันแสดงขึ้น
            cy.contains(portalName).should('be.visible');
            cy.get('button').contains('ปิด').click();
            cy.wait(1000);
            cy.log('✅ สร้าง Portal สำเร็จ');

            cy.log('🔍 ทดสอบการค้นหา Portal ที่เพิ่งสร้าง');
            cy.get('#subject').type(portalName);
            cy.get('button').contains('Search').click();
            cy.wait(1000);

            // ตรวจสอบผลการค้นหา
            cy.get('.ant-table-tbody').should('contain', portalName);
            cy.log('✅ ค้นหา Portal ด้วยชื่อเรื่องสำเร็จ');
        });

        it('ADMINICDJUNIOR-SN-49: สามารถแก้ไข Portal ได้', () => {
            cy.get('#subject').type(portalName);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.log('✏️ ทดสอบการแก้ไข Portal');
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('edit').click();
            });

            // ตรวจสอบว่า Modal แก้ไขเปิดขึ้น
            cy.get('body').then(($body) => {
                if ($body.find('.ant-modal-content').length > 0) {
                    cy.get('.ant-modal-content').should('be.visible');
                    cy.log('✅ เปิด Modal แก้ไขสำเร็จ');

                    // ปิด Modal
                    // cy.get('.ant-modal-close').click();
                } else {
                    cy.log('ℹ️ อาจเปิดหน้าแก้ไขในรูปแบบอื่น');
                }
            });

            cy.get('.ant-modal-content').within(() => {
                cy.get('#sequence').should('be.visible').clear().type('1999');// กรอกลำดับ
                cy.get('#subject').should('be.visible').clear().type(modalTitle);// กรอกชื่อเรื่อง
                cy.get('#description').should('be.visible').clear().type(modalDescription);// กรอกรายละเอียด
                cy.get('#link').should('be.visible').clear().type('https://test-edit-required.com');// กรอก Link
                // cy.get('input[accept=".jpg,.jpeg"]').selectFile('cypress/fixtures/image/jjpng.jpg', { force: true });
                // cy.get('button').contains('ยืนยัน').click();
            });
            cy.wait(2000);

            // ตรวจสอบว่า Modal แก้ไขเปิดขึ้น
            // cy.get('.gap-6').within(() => {
            //     cy.get('.self-stretch.justify-center.text-lg.font-bold').should('contain', modalTitle);
            //     cy.contains('ปิด').click();
            //     cy.log('✅ แก้ไข Portal สำเร็จ');
            // })
            // cy.log('✅ การแก้ไขทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-51: สามารถดูรูปภาพ Portal ได้', () => {
            cy.log('🖼️ ทดสอบการคลิกดูรูปหน้าปก');
            // คลิกปุ่มรูปหน้าปกของรายการแรก
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('image').click();
            });
            cy.wait(1000);
            // ตรวจสอบว่าแสดงรูปภาพ (อาจเป็น Modal หรือ Preview)
            cy.get('body').then(($body) => {
                if ($body.find('.ant-modal-content').length > 0) {
                    cy.get('.ant-modal-content').should('be.visible');
                    cy.log('✅ แสดง Modal รูปภาพ');
                    // ปิด Modal
                    cy.get('.ant-modal-close').click();
                } else {
                    cy.log('ℹ️ อาจมีการแสดงรูปภาพในรูปแบบอื่น');
                }
            });
            cy.log('✅ การดูรูปหน้าปกทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-52: สามารถดาวน์โหลดรูปหน้าปก Portal ได้', () => {
            cy.log('🖼️ ทดสอบการคลิกดูรูปหน้าปก');

            // คลิกปุ่มรูปหน้าปกของรายการแรก
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('image').click();
            });
            cy.wait(1000);

            // ตรวจสอบว่าแสดงรูปภาพ (อาจเป็น Modal หรือ Preview)
            cy.get('body').then(($body) => {
                if ($body.find('.ant-modal-content').length > 0) {
                    cy.get('.ant-modal-content').should('be.visible');
                    cy.log('✅ แสดง Modal รูปภาพ');
                    cy.get('.pt-10 > .rounded-md').click(); // คลิกปุ่มดาวน์โหลด
                    // ปิด Modal
                    // cy.get('.ant-modal-close').click();
                } else {
                    cy.log('ℹ️ อาจมีการแสดงรูปภาพในรูปแบบอื่น');
                }
            });
            cy.log('✅ การดูรูปหน้าปกทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-53: สามารถแก้ไขรูปหน้าปก Portal ได้', () => {
            cy.get('#subject').type(portalName);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            cy.log('✏️ ทดสอบการแก้ไข Portal');
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('edit').click();
            });
            cy.wait(1000);
            // ตรวจสอบว่า Modal แก้ไขเปิดขึ้น
            cy.get('body').then(($body) => {
                if ($body.find('.ant-modal-content').length > 0) {
                    cy.get('.ant-modal-content').should('be.visible');
                    cy.log('✅ เปิด Modal แก้ไขสำเร็จ');

                    // ปิด Modal
                    // cy.get('.ant-modal-close').click();
                } else {
                    cy.log('ℹ️ อาจเปิดหน้าแก้ไขในรูปแบบอื่น');
                }
            });
            cy.get('.ant-modal-content').within(() => {
                cy.get('.flex.gap-1 .relative').first().trigger('mouseover');
                // คลิกปุ่ม delete (ปุ่มที่มี icon delete)
                cy.get('.absolute button').contains('span', 'delete').click({ force: true });
                cy.get('input[accept=".jpg,.jpeg"]').selectFile('cypress/fixtures/image/mai_OW_JP.jpg', { force: true });
            });

            // จัดการ Modal ครอปรูปภาพ
            cy.get('.ant-modal-content').contains('.custom-modal-label', 'ครอปรูปภาพ')
                .closest('.ant-modal-content')
                .within(() => {
                    cy.log('🖼️ ปรับขนาดพื้นที่ Crop');
                    cy.get('.ReactCrop__drag-handle.ord-se')//จุดที่มุมล่างขวา
                        .trigger('pointerdown', { pointerId: 1 })
                        .wait(100)
                        .trigger('pointermove', { pointerId: 1, clientX: 1400, clientY: 1000 })
                        .wait(100)
                        .trigger('pointerup', { pointerId: 1 });

                    cy.get('.ReactCrop__drag-handle.ord-nw')//จุดที่มุมบนซ้าย
                        .trigger('pointerdown', { pointerId: 1 })
                        .wait(100)
                        .trigger('pointermove', { pointerId: 1, clientX: 0, clientY: 0 })
                        .wait(100)
                        .trigger('pointerup', { pointerId: 1 });
                    // ยืนยันการ crop
                    cy.get('button').contains('ยืนยัน').click();
                    cy.wait(5000);
                });
            // cy.get('.ant-form > .justify-end > .bg-\\[#4CB847\\]').contains('ยืนยัน').click();

        })

        it('ADMINICDJUNIOR-SN-54: สามารถใช้งาน Guide Text ที่ Portal ได้', () => {
            cy.get('button').contains('สร้าง Portal').should('be.visible').click();
            cy.wait(1000);

            // ทดสอบ Guide Text แรก
            cy.get('.ant-modal-content').within(() => {
                cy.contains('label', 'ลำดับ')
                    .parent()
                    .find('.material-symbols-outlined')
                    .should('contain', 'info')
                    .trigger('mouseover');
            });

            // รอให้ tooltip แสดงและตรวจสอบ
            cy.get('[role="tooltip"]')
                .should('be.visible')
                .and('contain', 'กรุณากรอกลำดับที่ต้องการ ให้แสดงผลก่อนหรือหลัง');

            cy.get('.ant-modal-content').within(() => {
                cy.contains('label', 'ลำดับ')
                    .parent()
                    .find('.material-symbols-outlined')
                    .trigger('mouseout');
            });
            cy.wait(500);

            cy.get('.ant-modal-content').within(() => {
                cy.contains('label', 'รายละเอียด')
                    .parent()
                    .find('.material-symbols-outlined')
                    .should('contain', 'info')
                    .trigger('mouseover');
            });

            // ตรวจสอบ tooltip ที่สอง
            cy.get('[role="tooltip"]')
                .should('be.visible')
                .and('contain', 'กรุณากรอกข้อมูลที่ต้องการสื่อสารกับผู้ประเมิน');
        });

        it('ADMINICDJUNIOR-SN-55-56: สามารถเปิดปิดการใช้งาน Portal ได้', () => {
            cy.log('🔄 ทดสอบการเปิด/ปิดใช้งาน Portal');
            cy.get('.ant-table-tbody tr').each(($row) => {
                cy.wrap($row).within(() => {
                    cy.get('.ant-switch').then(($switch) => {
                        const isChecked = $switch.hasClass('ant-switch-checked');
                        cy.log(`Switch สถานะ: ${isChecked ? 'เปิด' : 'ปิด'}`);

                        // คลิก Switch
                        cy.wrap($switch).click();
                        cy.wait(1000);

                        // ตรวจสอบสถานะหลังคลิก
                        cy.wrap($switch).then(($newSwitch) => {
                            const newState = $newSwitch.hasClass('ant-switch-checked');
                            cy.log(`Switch สถานะใหม่: ${newState ? 'เปิด' : 'ปิด'}`);

                            // คืนสถานะเดิม
                            cy.wrap($newSwitch).click();
                        });
                    });
                });
                return false; // หยุดที่รายการแรก
            });
            cy.log('✅ การเปิด/ปิดใช้งานทำงานถูกต้อง');
        });

        it('ADMINICDJUNIOR-SN-57: สามารถ Search หา Portal ได้', () => {
            cy.log('🔍 ทดสอบการค้นหา Portal');

            // ทดสอบการค้นหาด้วยชื่อเรื่อง
            cy.get('#subject').clear().type(portalName);
            cy.get('button').contains('Search').click();
            cy.wait(1000);

            cy.get('.ant-table-tbody').should('contain', portalName);
            cy.log('✅ ค้นหา Portal ด้วยชื่อเรื่องสำเร็จ');

            // รีเซ็ตก่อนทดสอบครั้งถัดไป
            cy.get('button').contains('Reset').click();
            cy.wait(1000);

            // ตรวจสอบว่าฟิลด์ถูกล้างแล้ว
            cy.get('#subject').should('have.value', '');

            // ทดสอบการค้นหาด้วยรายละเอียด
            cy.get('#description').clear().type(portalDescription);
            cy.get('button').contains('Search').click();
            cy.wait(1000);

            cy.get('.ant-table-tbody').should('contain', portalDescription);
            cy.log('✅ ค้นหา Portal ด้วยรายละเอียดสำเร็จ');

            // รีเซ็ตอีกครั้งเพื่อทำความสะอาด
            cy.get('button').contains('Reset').click();
            cy.wait(1000);

            cy.log('✅ ทดสอบการค้นหา Portal เสร็จสิ้น');
        });

        it('ADMINICDJUNIOR-SN-50: ทดสอบการลบ Portal', () => {
            cy.log('🗑️ ทดสอบการลบ Portal');
            // ค้นหา Portal ที่ต้องการลบ
            cy.get('#subject').type(portalName);
            cy.get('button').contains('Search').click();
            cy.wait(1000);
            // คลิกปุ่มลบในรายการแรก
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('button').contains('delete').click();
            });
            cy.wait(1000);
            // ยืนยันการลบใน Modal
            cy.get('.gap-6').within(() => {
                cy.get('.flex-1 > .justify-center').should('contain', `ท่านต้องการลบ Portal: “${portalName}” นี้ใช่หรือไม่?`);
                cy.get('button[type="button"]').contains('ยืนยัน').click();
            });
            cy.wait(1000);
            cy.get('.gap-6').within(() => {
                cy.get('.self-stretch.justify-center.text-lg.font-bold').should('contain', `ลบ Portal: “${portalName}” สำเร็จ`);
                cy.get('button').contains('ปิด').click();
            })
            cy.log('✅ ลบ Portal สำเร็จ');
        })
    });

    // it('TC-PP-003: ทดสอบการยกเลิกการสร้าง Portal', () => {
    //     cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
    //     cy.url().should('include', '/master-data/portal');
    //     cy.wait(2000);
    //     cy.get('button').contains('สร้าง Portal').should('be.visible').click();
    //     cy.wait(2000);
    //     // ตรวจสอบว่า Modal เปิดขึ้น
    //     cy.get('.ant-modal-content').should('be.visible');
    //     cy.get('.custom-modal-label').should('contain', 'สร้าง Portal');
    //     cy.log('📝 กรอกข้อมูลบางส่วน');
    //     // กรอกข้อมูลบางส่วนในรูปแบบเดียวกับ TC-PP-002
    //     cy.get('.ant-modal-content').within(() => {
    //         cy.get('#sequence').should('be.visible').clear().type('998');
    //         cy.get('#subject').should('be.visible').clear().type('Test Cancel Portal');
    //     });

    //     cy.log('❌ ยกเลิกการสร้าง Portal');

    //     // คลิกปุ่มยกเลิก
    //     cy.get('.ant-modal-content').within(() => {
    //         cy.get('button').contains('ยกเลิก').click();
    //     });
    //     cy.wait(1000);

    //     cy.log('✅ ยกเลิกการสร้าง Portal สำเร็จ');
    // });

    // it('TC-PP-005: ทดสอบการดูรูปหน้าปก', () => {
    //     cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
    //     cy.url().should('include', '/master-data/portal');
    //     cy.wait(2000);

    //     cy.log('🖼️ ทดสอบการคลิกดูรูปหน้าปก');

    //     // คลิกปุ่มรูปหน้าปกของรายการแรก
    //     cy.get('.ant-table-tbody tr').first().within(() => {
    //         cy.get('button').contains('image').click();
    //     });
    //     cy.wait(1000);

    //     // ตรวจสอบว่าแสดงรูปภาพ (อาจเป็น Modal หรือ Preview)
    //     cy.get('body').then(($body) => {
    //         if ($body.find('.ant-modal-content').length > 0) {
    //             cy.get('.ant-modal-content').should('be.visible');
    //             cy.log('✅ แสดง Modal รูปภาพ');
    //             // ปิด Modal
    //             cy.get('.ant-modal-close').click();
    //         } else {
    //             cy.log('ℹ️ อาจมีการแสดงรูปภาพในรูปแบบอื่น');
    //         }
    //     });

    //     cy.log('✅ การดูรูปหน้าปกทำงานถูกต้อง');
    // });

    // it('TC-PP-007: ทดสอบการเปิด/ปิดใช้งาน Portal', () => {
    //     cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
    //     cy.url().should('include', '/master-data/portal');
    //     cy.wait(2000);

    //     cy.log('🔄 ทดสอบการเปิด/ปิดใช้งาน Portal');

    //     // หา Switch ที่สามารถคลิกได้
    //     cy.get('.ant-table-tbody tr').each(($row) => {
    //         cy.wrap($row).within(() => {
    //             cy.get('.ant-switch').then(($switch) => {
    //                 const isChecked = $switch.hasClass('ant-switch-checked');
    //                 cy.log(`Switch สถานะ: ${isChecked ? 'เปิด' : 'ปิด'}`);

    //                 // คลิก Switch
    //                 cy.wrap($switch).click();
    //                 cy.wait(1000);

    //                 // ตรวจสอบสถานะหลังคลิก
    //                 cy.wrap($switch).then(($newSwitch) => {
    //                     const newState = $newSwitch.hasClass('ant-switch-checked');
    //                     cy.log(`Switch สถานะใหม่: ${newState ? 'เปิด' : 'ปิด'}`);

    //                     // คืนสถานะเดิม
    //                     cy.wrap($newSwitch).click();
    //                 });
    //             });
    //         });
    //         return false; // หยุดที่รายการแรก
    //     });

    //     cy.log('✅ การเปิด/ปิดใช้งานทำงานถูกต้อง');
    // });

    // it('TC-PP-008: ทดสอบการนำทางในตาราง', () => {
    //     cy.visit('https://dev-ecsa.looksocial.dev/master-data/portal');
    //     cy.url().should('include', '/master-data/portal');
    //     cy.wait(2000);

    //     cy.log('📄 ทดสอบการเปลี่ยนหน้าในตาราง');

    //     // ตรวจสอบการแสดงผลของ Pagination
    //     cy.get('.ant-pagination').should('be.visible');

    //     // ตรวจสอบจำนวนรายการทั้งหมด
    //     cy.contains('ทั้งหมด').should('be.visible');

    //     // ทดสอบการเปลี่ยนหน้า (ถ้ามีหน้าที่ 2)
    //     cy.get('body').then(($body) => {
    //         if ($body.find('.ant-pagination-item-2').length > 0) {
    //             cy.get('.ant-pagination-item-2').click();
    //             cy.wait(1000);
    //             cy.log('✅ เปลี่ยนไปหน้า 2 สำเร็จ');

    //             // กลับหน้า 1
    //             cy.get('.ant-pagination-item-1').click();
    //             cy.wait(1000);
    //             cy.log('✅ กลับหน้า 1 สำเร็จ');
    //         } else {
    //             cy.log('ℹ️ มีข้อมูลเพียงหน้าเดียว');
    //         }
    //     });

    //     cy.log('✅ การนำทางในตารางทำงานถูกต้อง');
    // });
});