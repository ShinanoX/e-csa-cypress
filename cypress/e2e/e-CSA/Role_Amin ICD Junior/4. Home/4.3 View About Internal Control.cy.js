describe('View FAQ', () => {
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
        cy.visit('https://dev-ecsa.looksocial.dev/config/internal-control');
        cy.url().should('include', '/internal-control');
        cy.wait(2000);
    });

    describe('4.3 View About Internal Control', () => {
        it('ADMINICDJUNIOR-SN-121: สามารถดูข้อมูล About Internal Control ที่หน้า Home ได้', () => {
            cy.contains('About Internal Control').click();
            cy.get('.text-\\[\\#4CB847\\]').should('contain', 'About Internal Control');
        });

        it('ADMINICDJUNIOR-SN-122/123: ดูรูปและดาวน์โหลดไฟล์แนบ About Internal Control (เฉพาะ list แรกที่เจอไฟล์แนบ)', () => {
            cy.contains('About Internal Control').click();
            cy.get('.bg-white.border.rounded-lg', { timeout: 10000 }).should('exist').then($lists => {
                let found = false;
                Cypress._.forEach($lists, (listEl, idx) => {
                    if (found) return false;

                    // ใช้ jQuery หา section "ไฟล์แนบประกอบ"
                    const attachSection = Cypress.$(listEl).find('.font-bold.text-base').filter((i, el) => el.textContent.includes('ไฟล์แนบประกอบ'));
                    if (attachSection.length > 0) {
                        cy.log(`พบไฟล์แนบใน list #${idx + 1}`);

                        // คลิกดูรูปภาพ
                        cy.wrap(listEl).find('button.material-symbols-outlined').contains('visibility').first().click({ force: true });
                        cy.log('คลิกดูรูปภาพไฟล์แนบ');

                        // คลิกดาวน์โหลด
                        cy.wrap(listEl).find('button.material-symbols-outlined').contains('download').first().click({ force: true });
                        cy.log('คลิกดาวน์โหลดไฟล์แนบ');

                        found = true;
                    }
                });
            });
        });
    });
});