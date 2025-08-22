describe('View FAQ', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/');
        cy.url().should('include', '/dashboard');
        cy.wait(2000);
    });

    describe('4.2 View FAQ', () => {
        it('ADMINICDJUNIOR-SN-117: สามารถดูข้อมูล FAQ ที่หน้า Home ได้', () => {
            cy.get('nav').contains('Home').click();
            cy.get('.flex-col.gap-4 > :nth-child(2) > .gap-4 > :nth-child(1)').click();
            cy.url().should('include', '/config/faq');
        });

        it('ADMINICDJUNIOR-SN-118: คลิกทุกรายการ FAQ ที่พบในหน้า', () => {
            cy.get('nav').contains('Home').click();
            cy.get('.flex-col.gap-4 > :nth-child(2) > .gap-4 > :nth-child(1)').click();
            cy.get('.bg-white.border.rounded-\\[8px\\]', { timeout: 10000 }).should('exist').each(($el, index, $list) => {
                cy.wrap($el).click();
                cy.log(`คลิก FAQ #${index + 1}`);
                cy.wait(300); // รอให้ animation หรือเนื้อหาแสดงผล
                if (index === 0) {
                    cy.wrap($el)
                        .parent() // ขึ้นไปหา container ที่มีปุ่ม visibility
                        .find('button.material-symbols-outlined')
                        .first()
                        .click({ force: true });
                    cy.log('คลิกปุ่มดูรูปภาพใน FAQ รายการแรก');
                }
            });
        });

        it('ADMINICDJUNIOR-SN-119: ตรวจสอบว่า FAQ รายการไหนมีไฟล์แนบ', () => {
            cy.get('nav').contains('Home').click();
            cy.get('.flex-col.gap-4 > :nth-child(2) > .gap-4 > :nth-child(1)').click();

            cy.get('.bg-white.border.rounded-\\[8px\\]', { timeout: 10000 }).should('exist').each(($el, index) => {
                cy.wrap($el).click();
                cy.wait(300);

                // สมมติว่าไฟล์แนบมี icon หรือปุ่มชื่อ "แนบไฟล์" หรือ "attachment"
                cy.wrap($el).parent().find('button, .material-symbols-outlined, .anticon')
                    .then($btns => {
                        const hasAttachment = $btns.toArray().some(btn =>
                            btn.textContent.includes('แนบไฟล์') ||
                            btn.textContent.toLowerCase().includes('attach') ||
                            btn.getAttribute('aria-label')?.toLowerCase().includes('attachment')
                        );
                        if (hasAttachment) {
                            cy.log(`FAQ #${index + 1} : มีไฟล์แนบ`);
                        } else {
                            cy.log(`FAQ #${index + 1} : ไม่มีไฟล์แนบ`);
                        }
                    });
            });
        });

        it.only('ADMINICDJUNIOR-SN-120: คลิกดูรูปภาพและดาวน์โหลดไฟล์แนบใน FAQ รายการแรกที่มีไฟล์แนบ แล้วจบการทำงาน', () => {
            cy.get('nav').contains('Home').click();
            cy.get('.flex-col.gap-4 > :nth-child(2) > .gap-4 > :nth-child(1)').click();

            cy.get('.bg-white.border.rounded-\\[8px\\]', { timeout: 10000 }).should('exist').then(($faqs) => {
                Cypress._.forEach($faqs, (faqEl, index) => {
                    cy.wrap(faqEl).click();
                    cy.wait(300);

                    cy.wrap(faqEl)
                        .parent()
                        .find('.mx-4.py-4')
                        .then($container => {
                            if ($container.find('.font-bold.text-base').filter((i, el) => el.textContent.includes('ไฟล์แนบประกอบคำตอบ')).length > 0) {
                                cy.log(`FAQ #${index + 1} : เจอไฟล์แนบ`);
                                cy.wrap($container).find('button.material-symbols-outlined').contains('visibility').first().click({ force: true });
                                cy.log('คลิกปุ่มดูรูปภาพ');
                                cy.wrap($container).find('button.material-symbols-outlined').contains('download').first().click({ force: true });
                                cy.log('คลิกปุ่มดาวน์โหลด');
                                return false;
                            }
                        });
                });
            });
        });

    });
});