describe('E-CSA Tests', () => {
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
    // cy.visit('https://dev-ecsa.looksocial.dev/dashboard');
    // cy.url().should('include', '/dashboard');

    cy.get('[id*="headlessui-popover-button"] > .gap-1').click();
    cy.get('.ant-radio-wrapper-checked > .ant-radio-label').click();
    cy.get(':nth-child(3) > .ant-radio-label').click();
    cy.get('.hidden > :nth-child(3)').click(); // คลิกเมนู Assessment
    cy.url().should('include', '/assessment');
    cy.get('.gap-1 > .flex > .text-left > .text-\\[\\#64748B\\]').should('have.text', 'Admin ICD Junior').should('be.visible');
  })

  it.skip('Test change Role and Menu', () => {
    cy.get('[id*="headlessui-popover-button"] > .gap-1').click();

    cy.get('[id*="headlessui-popover-panel"]').within(() => {
      cy.contains('Assessor').should('be.visible');
      cy.contains('Audit').should('be.visible');
      cy.contains('Admin ICD Junior').should('be.visible');
      cy.contains('Admin IT').should('be.visible');
    })

    cy.get('.ant-radio-wrapper-checked > .ant-radio-label').click();
    cy.get('.ant-radio-group > :nth-child(3)').click();
    cy.get('.hidden > :nth-child(3)').click(); // คลิกเมนู Assessment
    cy.url().should('include', '/assessment');
    cy.get('.gap-1 > .flex > .text-left > .text-\\[\\#64748B\\]').should('have.text', 'Admin ICD Junior').should('be.visible');
  })

  it('TC-A-001', () => {
    cy.visit('https://dev-ecsa.looksocial.dev/assessment');
    cy.url().should('include', '/assessment');

    ///assessment form
    cy.get('.bg-white\\/90').should('be.visible');

    cy.get('.card').should('be.visible');

    // Action View
    cy.get('[data-row-key="f66f146b-9dcd-441e-a792-231cf7181683"] > :nth-child(7) > .gap-2 > [style="width: 32px; height: 32px; color: black; border: 1px solid rgb(209, 213, 219); outline-width: 1px; outline-offset: -1px;"]').click();
  })



  it.skip('TC-A-003: Create New Assessment - Complete Flow', () => {
    cy.visit('https://dev-ecsa.looksocial.dev/assessment');
    cy.url().should('include', '/assessment');
    cy.get('.bg-white\\/90').should('be.visible');
    cy.wait(2000); // รอให้หน้าโหลดเสร็จ

    // ขั้นที่ 1: คลิกปุ่ม Create New Assessment
    cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

    // ขั้นที่ 2: ตรวจสอบ Modal เปิดขึ้น
    cy.get('.ant-modal-content').should('be.visible');
    cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

    // ขั้นที่ 3: ทำงานภายใน modal เท่านั้น
    cy.get('.ant-modal-content').within(() => {
      // ตรวจสอบ Form Elements
      cy.get('label').contains('บริษัท').should('be.visible');
      cy.get('label').contains('ปี').should('be.visible');
      cy.get('label').contains('รหัสแบบประเมิน').should('be.visible');
      cy.get('label').contains('ชื่อแบบประเมิน').should('be.visible');
      cy.get('label').contains('Start').should('be.visible');
      cy.get('label').contains('End').should('be.visible');
      cy.get('label').contains('วันที่เปิดรับประเมินรอบถัดไป').should('be.visible');
      cy.get('label').contains('ครั้งที่').should('be.visible');
      cy.get('label').contains('ผู้สร้างแบบประเมิน').should('be.visible');
      cy.get('label').contains('คำอธิบาย').should('be.visible');

      // ขั้นที่ 4: ตรวจสอบปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'disabled');
      cy.log('✅ ปุ่มยืนยันเป็น disabled ก่อนกดตรวจสอบ');

      // ขั้นที่ 5: แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
      cy.get('#assessment_code').clear().type('BCP_2025_TEST');
      cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA');
      cy.get('#description').clear().type('การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA');

      cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');

      cy.get('#start_date').click();
      cy.get('#end_date').click();
      cy.get('#open_next_round_date').click();

      // ขั้นที่ 6: ตรวจสอบว่าปุ่มยืนยันยังคงเป็น disabled หลังจากกรอกข้อมูล
      // cy.get('button[type="submit"]').should('be.disabled');
      // cy.log('✅ ปุ่มยืนยันยังคงเป็น disabled หลังจากกรอกข้อมูล');

      // ขั้นที่ 7: คลิกปุ่มตรวจสอบ
      cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
    });

    // ขั้นที่ 8: รอให้ validation เสร็จ
    cy.wait(2000);

    // ขั้นที่ 9: ตรวจสอบปุ่มยืนยันหลังจากกดตรวจสอบ
    cy.get('.ant-modal-content').within(() => {
      // ตรวจสอบว่าปุ่มยืนยันไม่เป็น disabled แล้ว
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
      cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');

      // ขั้นที่ 10: บันทึกข้อมูล
      cy.get('button[type="submit"]').contains('ยืนยัน').click();
    });

    // ขั้นที่ 11: ตรวจสอบผลลัพธ์
    cy.get('.ant-modal-content').should('not.exist');
    cy.log('✅ สร้าง Assessment ใหม่สำเร็จ');
    cy.url().should('include', '/assessment/create');
  });

  it.only('TC-A-004 - สามารถสร้าง/Save Draft/แก้ไข/ยกเลิก แบบประเมินได้', () => {
    cy.visit('https://dev-ecsa.looksocial.dev/assessment');
    cy.url().should('include', '/assessment');
    cy.wait(2000); // รอให้หน้าโหลดเสร็จ

    // ขั้นที่ 1: คลิกปุ่ม Create New Assessment
    cy.get('#assessment_code').clear().type('BCP_2025_TEST');
    cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

    cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
    cy.wait(3000)
    cy.get('button[type="submit"]').contains('ยืนยัน').click();
    // cy.wait(5000); // รอให้ modal ปิด และไปหน้าใหม่

    // ขั้นที่ 4: ทดสอบ ทดสอบ drag and drop
    cy.log('🎯 ทดสอบ drag and drop ด้วย cypress-drag-drop');

    const dataTransfer = new DataTransfer();
    // const widgetSelectors = [
    //   '.border-b > :nth-child(1) > .gap-2', // Section
    //   '.border-b > :nth-child(2) > .gap-2', // Yes/No
    //   '.border-b > :nth-child(3) > .gap-2', // Choice
    //   '.border-b > :nth-child(4) > .gap-2', // Checkbox
    //   ':nth-child(5) > .gap-2',             // Text
    //   ':nth-child(6) > .gap-2',             // Rating
    //   ':nth-child(7) > .gap-2',             // Ranking
    //   ':nth-child(8) > .gap-2'              // Date
    // ];

    // const widgetNames = [
    //   'Section',
    //   'Yes/No',
    //   'Choice',
    //   'Checkbox',
    //   'Text',
    //   'Rating',
    //   'Ranking',
    //   'Date'
    // ];

    // ลาก widget ลงมาต่อกัน
    // widgetSelectors.forEach((selector, idx) => {
    //   cy.get(selector).first().trigger('dragstart', { dataTransfer });
    //   cy.get('.h-\\[100vh\\] > .h-screen > .ant-form > .bg-white')
    //     .scrollIntoView({ block: 'end' })
    //     .trigger('drop', { dataTransfer, force: true })
    //     .trigger('dragend', { dataTransfer, force: true });
    //   cy.wait(1000); // เพิ่ม wait ให้ element สร้างทัน
    // });

    // ลาก widget ลงมาอยู่ใน section
    cy.get('.border-b > :nth-child(1) > .gap-2').trigger('dragstart', { dataTransfer });
    cy.get('.h-\\[100vh\\] > .h-screen > .ant-form > .bg-white')
      .trigger('drop', { dataTransfer, force: true })
      .trigger('dragend', { dataTransfer, force: true });
    cy.wait(3000);

    const widgetsInSection = [
      '.border-b > :nth-child(2) > .gap-2', // Yes/No
      '.border-b > :nth-child(3) > .gap-2', // Choice
      '.border-b > :nth-child(4) > .gap-2', // Checkbox
      ':nth-child(5) > .gap-2',             // Text
      ':nth-child(6) > .gap-2',             // Rating
      ':nth-child(7) > .gap-2',             // Ranking
      ':nth-child(8) > .gap-2'              // Date
    ];

    widgetsInSection.forEach((selector) => {
      cy.get(selector).first().trigger('dragstart', { dataTransfer });
      cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
        .first()
        .trigger('drop', { dataTransfer, force: true });

      cy.wait(500);

      cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
        .first()
        .trigger('dragend', { dataTransfer, force: true });
      cy.wait(1000);
    });


    for (let i = 0; i < 3; i++) {
      // สร้าง Section ใหม่
      cy.get('.border-b > :nth-child(1) > .gap-2').first().trigger('dragstart', { dataTransfer });
      cy.get('.h-\\[100vh\\] > .h-screen > .ant-form > .bg-white')
        .trigger('drop', { dataTransfer, force: true })
        .trigger('dragend', { dataTransfer, force: true });
      cy.wait(1000);

      // ลาก widgets เข้า Section ที่สร้างล่าสุด (ใช้ .eq(i) เพื่อเลือก Section ตามรอบ)
      const widgetsInSection = [
        '.border-b > :nth-child(2) > .gap-2', // Yes/No
        '.border-b > :nth-child(3) > .gap-2', // Choice
        '.border-b > :nth-child(4) > .gap-2', // Checkbox
        ':nth-child(5) > .gap-2',             // Text
        ':nth-child(6) > .gap-2',             // Rating
        ':nth-child(7) > .gap-2',             // Ranking
        ':nth-child(8) > .gap-2'              // Date
      ];

      widgetsInSection.forEach((selector) => {
        cy.get(selector).first().trigger('dragstart', { dataTransfer });
        cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
          .eq(i) // เลือก Section ตามรอบที่สร้าง
          .trigger('drop', { dataTransfer, force: true });
        cy.wait(500);
        cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200 .gap-4')
          .eq(i)
          .trigger('dragend', { dataTransfer, force: true });
        cy.wait(1000);
      });
    }

    cy.get('.material-symbols-outlined .cursor-pointer .hover:text-[#4CB847]').click();

    cy.get(':nth-child(3) > :nth-child(1) > .mt-4 > .border > :nth-child(1) > .gap-4 > .flex.w-full > :nth-child(4) > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-thead > tr > :nth-child(6) > .flex').click();
    cy.log('✅ เปิด modal เพิ่มรายชื่อผู้ประเมินและทดสอบแบบฟรอมการประเมิน');
    cy.get('.ant-modal-content').should('be.visible');

    cy.get('#department_level_name').type('ระดับหน่วยงาน{enter}');
    cy.get('#department_id').type('หน่วยงาน{enter}');
    cy.get('#assessor_id').type('Assessor{enter}');

    // เลือกประเภทผู้ประเมิน
    cy.get('#assessor_type').within(() => {
      cy.contains('ผู้ประเมินหลัก').click();
    });

    // กดปุ่ม Assign
    cy.contains('button', 'Assign').click();

    // ตรวจสอบตาราง
    cy.get('.ant-table-tbody').should('be.visible');

    // ตรวจสอบปุ่มยืนยัน disabled
    cy.contains('button', 'ยืนยัน').should('be.disabled');

    // กดปุ่มยกเลิก
    cy.contains('button', 'ยกเลิก').click();
  })

  it.skip('TC-A-005 - preview assessment form', () => {
    cy.visit('https://dev-ecsa.looksocial.dev/assessment');
    cy.url().should('include', '/assessment');
    cy.get('.bg-white\\/90').should('be.visible');

    // Test case logic here
    cy.get('[data-row-key="8c18d24f-de2e-4fd4-a941-659b26476a5d"] > :nth-child(7) > .gap-2 > [style="width: 32px; height: 32px; color: black; border: 1px solid rgb(209, 213, 219); outline-width: 1px; outline-offset: -1px;"]').click();
    cy.log('✅ เปิด หน้าแบบประเมินสำเร็จ');
  })
})

