describe('Bypass Login Tests', () => {
    beforeEach(() => {
        cy.loginApiAssessor();
    });

    it('TC-B-001 - Bypass login and access dashboard', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
        cy.get('.ant-card-head-title').should('contain', 'Dashboard');
    });
});

describe('Dashboard - FAQ', () => {
    it('TC-A-003 - สามารถดูข้อมูล FAQ ได้', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
        cy.wait(1000);
        cy.get('footer.flex > :nth-child(1)').should('be.visible').click();
        cy.url().should('include', '/faq');
        cy.contains('คำถามเรื่อง').should('be.visible');
        cy.get(':nth-child(1) > .bg-white > .font-bold').click();
        cy.get('.mx-4').should('be.visible');
        cy.log("แสดงคำตอบ");
        cy.get('.w-full > :nth-child(1) > .bg-white > .justify-between').click();
        cy.get('.mx-4').should('not.exist');
    });
});

describe('Dashboard - About Internal Control', () => {
    it('TC-A-004 - สามารถดูข้อมูล About Internal Control ได้', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
        cy.wait(1000);
        cy.get('footer.flex > :nth-child(2)').should('be.visible').click();
        cy.url().should('include', '/about-internal-control');
        cy.contains('About Internal Control').should('be.visible');
        cy.get('.w-full.flex.flex-col.gap-4').should('be.visible');
        cy.get('.w-full.flex.flex-col.gap-4').within(() => {
            cy.get('img').should('be.visible');
            cy.get('.font-bold.text-\\[16px\\]').should('be.visible').invoke('text').should('not.be.empty');
            cy.get(' .w-\\[500px\\] > :nth-child(2)').should('be.visible').invoke('text').should('not.be.empty');
        });
    });
    it('TC-A-005 - สามารถดาวน์โหลด About Internal Control ได้', () => {
        cy.get('footer.flex > :nth-child(2)').click().should('be.visible');
        cy.contains('About Internal Control').should('be.visible');
        cy.wait(2000)
        cy.get('.flex.flex-col.gap-1.mt-2 .flex.gap-2').first().within(() => {
            cy.get('button').eq(1).click({ force: true }); // ปุ่มดาวน์โหลดอันแรก
        });
    })

});

describe('Dashboard - User Manual', () => {
    it('TC-A-006 - สามารถดูข้อมูล Portal ได้', () => {
        cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
        cy.url().should('include', '/dashboard');
        cy.wait(1000);
        cy.get('[aria-label="Portal"]').click();
        cy.url().should('include', '/portal');

    });
    it('TC-A-007 - สามารถเข้าสู่เว็บไซต์ผ่าน Portal ได้', () => {
        cy.get('[aria-label="Portal"]').click();
        cy.get('.text-neutral-800').invoke('text').should('not.be.empty');
        cy.get('.w-full.flex.flex-col.gap-4').within(() => {
            cy.get('img').should('be.visible');
            cy.get('.font-bold.text-\\[16px\\]').should('be.visible').invoke('text').should('not.be.empty');
            cy.get('.font-bold.text-\\[16px\\]').next().should('be.visible').invoke('text').should('not.be.empty');
            cy.get('.flex.justify-start.items-center.gap-2.text-\\[\\#4CB847\\].cursor-pointer.mt-2 :nth-child(1)').should('be.visible')
        });
    });
});



