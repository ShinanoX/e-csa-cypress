describe('User Manual', () => {
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

    describe('2.4.2 ไม่สามารถใช้งาน การจัดการ User Manual ได้', () => {
        it('ADMINICDJUNIOR-SN-45: ไม่สามารถอัพโหลดไฟล์ User Manual ได้ เนื่องจากไฟล์มีขนาดเกิน 20 mb', () => {
            cy.get('h2').contains('Role Admin').parent().within(() => {
                cy.get('button').contains('Upload').should('be.visible').click();
            });
            cy.wait(1000);
            // ตรวจสอบ Modal Upload
            cy.get('.ant-modal-content').eq(0).should('be.visible');
            cy.get('.ant-modal-title').should('contain.text', 'Upload User Manual');

            cy.get('.ant-modal-content').within(() => {
                cy.get('input[accept=".pdf,.docx,.pptx"]').selectFile('cypress\\fixtures\\30mp-pkpadmin,+408-2146-1-CE.pdf', { force: true });

                cy.get('.text-red-500').should('exist');
                cy.log('ไฟล์ขนาดใหญ่เกินกำหนดแสดงเป็นสีแดง');

                cy.get('button.text-red-500').should('be.visible');
                cy.contains('รองรับเฉพาะไฟล์ .pdf , .docx, .pptx และขนาดไม่เกิน 20 MB ต่อไฟล์').should('be.visible');
                cy.contains('อัพโหลดไฟล์').should('be.disabled');
                cy.contains('ยืนยัน').should('be.disabled').should('have.css', 'cursor', 'not-allowed');
                cy.wait(3000)
                // cy.get('button').contains('ยกเลิก').click();
            });
        });

        it('ADMINICDJUNIOR-SN-46: ไม่สามารถอัพโหลดไฟล์ User Manual ได้ เนื่องจากอัพโหลดไฟล์อื่นที่ไม่ใช่ .pdf , .docx หรือ .pptx', () => {
            cy.get('h2').contains('Role Admin').parent().within(() => {
                cy.get('button').contains('Upload').should('be.visible').click();
            });
            cy.wait(1000);
            // ตรวจสอบ Modal Upload
            cy.get('.ant-modal-content').eq(0).should('be.visible');
            cy.get('.ant-modal-title').should('contain.text', 'Upload User Manual');

            cy.get('.ant-modal-content').within(() => {
                cy.get('input[accept=".pdf,.docx,.pptx"]').selectFile('cypress\\fixtures\\image\\jjpng.jpg', { force: true });
                cy.get('.text-red-500').should('exist');
                cy.get('button.text-red-500').should('be.visible');
                cy.log('ไฟล์ขนาดใหญ่เกินกำหนดแสดงเป็นสีแดง');
                cy.contains('รองรับเฉพาะไฟล์ .pdf , .docx, .pptx และขนาดไม่เกิน 20 MB ต่อไฟล์').should('be.visible');
                cy.contains('อัพโหลดไฟล์').should('be.disabled');
                cy.contains('ยืนยัน').should('be.disabled').should('have.css', 'cursor', 'not-allowed');
                // cy.get('button').contains('ยกเลิก').click();
            });

            cy.log('✅ ตรวจสอบไม่สามารถอัพโหลดไฟล์ขนาดใหญ่สำเร็จ');
        });
    })
});
