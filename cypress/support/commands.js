import 'cypress-file-upload';

Cypress.Commands.add("loginAdmin", () => {
    cy.session('admin', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('Minified React error #418') ||
                err.message.includes('visit https://react.dev/errors') ||
                err.message.includes('React') ||
                err.message.includes('chunk loading failed')) {
                return false;
            }
            return true;
        });

        cy.visit('https://dev-ecsa.looksocial.dev/auth/login');
        cy.wait(5000); // รอให้หน้าโหลดเสร็จ
        cy.get('body')
            .type('{shift}', { release: false }).type('Y')
            .type('{shift}', { release: true });
        cy.get('#assessed').click();
        cy.get('[title="บริษัทย่อย"]').click();

        cy.get('.flex .flex-col .gap-4 > :nth-child(2)').should('be.visible');
        cy.get('input[id="username"]').should('be.visible').clear().type('rit@looksocial.dev');
        cy.get('input[id="password"]').should('be.visible').clear().type('Bcp1234!');
        cy.get('button[type="submit"]').click();
        cy.wait(5000); // รอให้ login เสร็จ
    })

});

Cypress.Commands.add('loginApiAssessor', () => {
    cy.request({
        method: 'POST',
        url: 'https://dev-ecsa-api.looksocial.dev/api/v1/auth/login',
        body: {
            username: 'rit@looksocial.dev',
            password: 'Bcp1234!',
        },
    }).then((response) => {
        const accessToken = response.body.data.access_token;
        const refreshToken = response.body.data.refresh_token;
        const role = 'ADMIN_ICD_JUNIOR';

        cy.setCookie('access_token', accessToken);
        cy.setCookie('refresh_token', refreshToken);
        cy.setCookie('role', role);

        cy.getCookie('access_token').should('have.property', 'value', accessToken);
        cy.getCookie('refresh_token').should('have.property', 'value', refreshToken);
    });

    cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
});
