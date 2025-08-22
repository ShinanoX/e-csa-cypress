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

    describe('3.2 ไม่สามารถใช้งาน จัดการสิทธิ์ Admin ได้', () => {
        it('ADMINICDSENIOR-SN-102: ไม่สามารถสร้าง Admin ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใดๆ เลย', () => {
            cy.get('.card').within(() => {
                cy.get('.pt-4.px-4 > .gap-4 > .rounded-md').contains('สร้างผู้ใช้งาน').click();
            });
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.get('button[type="submit"]').contains('สร้างผู้ใช้งาน').click({ force: true });
                // ตรวจสอบข้อความ error ของแต่ละช่อง
                cy.get('#role_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#initial_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('input#full_name').should('be.disabled');
            });
            cy.get('.flex-col.w-full > .justify-end > .transition-transform').click();
            cy.get('.card').within(() => {
                cy.get('.pt-4.px-4 > .gap-4 > .rounded-md').contains('สร้างผู้ใช้งาน').click();
            });
            cy.get('.ant-form-item-control-input-content > .flex-col > .ant-select > .ant-select-selector > .ant-select-selection-wrap > .ant-select-selection-search > #role').click();
            cy.get('[title="Admin ICD Junior"] > .ant-select-item-option-content').click();
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                cy.wait(2000);
                cy.get('button[type="submit"]').contains('สร้างผู้ใช้งาน').click({ force: true });
                // ตรวจสอบข้อความ error ของแต่ละช่อง
                cy.get('#initial_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#internal_phone_number_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('input#full_name').should('be.disabled');
            });
        });

        it('ADMINICDSENIOR-SN-103: ไม่สามารถแก้ไขข้อมูล Admin ได้เนื่องจากกรอกข้อมูลไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'edit').click();
            });
            cy.wait(2000)
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                // เคลียร์ Role
                cy.get('.ant-form-item-control-input-content')
                    .contains('Role')
                    .parents('.ant-form-item')
                    .find('.ant-select-selector')
                    .trigger('mouseover');
                cy.get('.ant-form-item-control-input-content')
                    .contains('Role')
                    .parents('.ant-form-item')
                    .find('.ant-select-clear')
                    .click();

                // เคลียร์ Initial
                cy.get('.ant-form-item-control-input-content')
                    .contains('Initial')
                    .parents('.ant-form-item')
                    .find('.ant-select-selector')
                    .trigger('mouseover');
                cy.get('.ant-form-item-control-input-content')
                    .contains('Initial')
                    .parents('.ant-form-item')
                    .find('.ant-select-clear')
                    .click();

                // ตรวจสอบข้อความ error ของแต่ละช่อง
                cy.get('#role_help').should('contain', 'กรุณากรอกข้อมูล');
                cy.get('#initial_help').should('contain', 'กรุณากรอกข้อมูล');
            });
        });

        it.only('ADMINICDSENIOR-SN-104: ไม่สามารถแก้ไขข้อมูล Admin ได้ เนื่องจาก Admin ทำการแก้ไขข้อมูลตัวเอง', () => {
            cy.get('#full_name').type('ฤทธิ์ บุตรแสง');
            cy.contains('Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').filter(':contains("ฤทธิ์ บุตรแสง")').within(() => {
                cy.get('button').contains('span', 'edit').click();
            });
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                // คลิกเปิด dropdown Role
                cy.get('.ant-form-item-control-input-content')
                    .contains('Role')
                    .parents('.ant-form-item')
                    .find('.ant-select-selector')
                    .click();
            });
            cy.get('.ant-select-dropdown .ant-select-item')
                .contains('Audit')
                .click();
            cy.get('.flex-col.w-full > .justify-end > .bg-\\[\\#4CB847\\]').click();

            cy.get('.gap-12').within(() => {
                cy.get('.flex-1 > .justify-center').contains('แก้ไขข้อมูลไม่สำเร็จ เนื่องจากระบบไม่อนุญาตให้แก้ไขข้อมูลส่วนตัวของตนเอง').click({ force: true });
                cy.contains('ปิด').click();
            });

        });

        it('ADMINICDSENIOR-SN-105: ไม่สามารถแก้ไขข้อมูล Admin ได้ เนื่องจาก Admin ทำการแก้ไขข้อมูลตัวเอง', () => {
            cy.get('#full_name').type('ฤทธิ์ บุตรแสง');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').eq(1).within(() => {
                cy.get('button').contains('span', 'edit').click();
            });
            cy.get('.ant-modal-content').should('be.visible').within(() => {
                // คลิกเปิด dropdown Role
                cy.get('.ant-form-item-control-input-content')
                    .contains('Role')
                    .parents('.ant-form-item')
                    .find('.ant-select-selector')
                    .click();
            });
            cy.get('.ant-select-dropdown .ant-select-item')
                .contains('Audit')
                .click();
            cy.get('.flex-col.w-full > .justify-end > .bg-\\[\\#4CB847\\]').click();

            cy.get('.gap-12').within(() => {
                cy.get('.flex-1 > .justify-center').contains('แก้ไขข้อมูลไม่สำเร็จ เนื่องจากระบบไม่อนุญาตให้แก้ไขข้อมูลส่วนตัวของตนเอง').click({ force: true });
                cy.contains('ปิด').click();
            });

        })

        it('ADMINICDSENIOR-SN-106: ไม่สามารถลบ Admin ได้เนื่องจากไม่กรอกเหตุผลที่ต้องการจะลบ', () => {
            cy.get('#full_name').type('สมพงษ์ สาสนทาญาติ');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').filter(':contains("สมพงษ์ สาสนทาญาติ")').find('.ant-dropdown-trigger').click();
            cy.contains('ลบผู้ใช้งาน').click();

            cy.get('.ant-modal-content').within(() => {
                cy.get('.gap-2 > .justify-end > .bg-\\[\\#4CB847\\]').click();
                cy.get('.ant-form > .gap-2 > :nth-child(1) > :nth-child(2)').should('contain', 'กรุณากรอกข้อมูล');
            });
        })

        it('ADMINICDSENIOR-SN-107: ไม่สามารถแก้ไขสถานะได้ เนื่องจาก Admin ลบผู้ใช้งานตัวเอง', () => {
            cy.get('#full_name').type('ฤทธิ์ บุตรแสง');
            cy.contains('Search').click();
            cy.wait(1000);
            cy.get('.ant-table-tbody tr').filter(':contains("ฤทธิ์ บุตรแสง")').find('.ant-dropdown-trigger').click();
            cy.contains('ลบผู้ใช้งาน').click();
            cy.get('.ant-modal-content').within(() => {
                cy.get('#remark').type('ทดสอบการลบ Role')
                cy.get('.gap-2 > .justify-end > .bg-\\[\\#4CB847\\]').click();
            });
            cy.get('.gap-12').within(() => {
                cy.contains('ลบผู้ใช้งานไม่สำเร็จ เนื่องจากระบบไม่อนุญาตให้แก้ไขข้อมูลส่วนตัวของตนเอง').should('be.visible');
                // cy.contains('ปิด').click();
            });
        })

    });
});