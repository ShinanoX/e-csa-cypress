describe('5.7.1 Admin ICD Junior Review Success', () => {
    const passEvaluationForm = {
        assessment_code: 'BCP_ทดสอบการสร้างแบบประเมิน_2',
        description: 'การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA',
    };
    const searchData = {
        assessment_code: 'BCP_Test_Edit_For_Copy',
        edit_assessment_code: 'BCP_Test_Edit_For_Draft',
    };

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
        cy.visit('https://dev-ecsa.looksocial.dev/assessment');
        cy.url().should('include', '/assessment');
        cy.wait(2000);
    });

    describe('5.7.1 Admin ICD Junior Review Success', () => {
        it('ADMINICDJUNIOR-SN-194 : สามารถส่งคำตอบของ Assessor เพื่อให้ Admin ICD Senior เข้ามา Review', () => {
            cy.get('#assessment_code').type(passEvaluationForm.assessment_code);
            cy.contains('button', 'Search').click();
            cy.wait(2000);
            cy.get('.ant-table-tbody tr').first().within(() => {
                cy.get('.ant-table-cell').eq(1).click();
            });
            cy.wait(3000);
            cy.get('.p-2 > .rounded-md').click();
        })

    });

});
