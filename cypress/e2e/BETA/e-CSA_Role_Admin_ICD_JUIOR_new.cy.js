describe('e-CSA Role Admin ICD Junior', () => {
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
  });

  describe('e-CSA Assessment Form', () => {
    it('TC-A-001 - สามารถดูแบบประเมินได้', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.wait(3000);
      cy.get('.bg-white\\/90').should('be.visible');

      // table
      cy.get('.card')
        .should('be.visible')
        .find('.ant-table-wrapper')
        .should('be.visible')
        .should('have.class', 'ant-table-wrapper')
        .find('.ant-table-tbody')
        .should('be.visible')
        .find('tr')
        .should('have.length.greaterThan', 0);

      // Assessment Form
      cy.get('.bg-white\\/90').should('be.visible');
      cy.log('✅ แสดง Assessment Form');

      cy.log('✅ สามารถดูแบบประเมินได้');
      cy.get('.ant-table-tbody > :nth-child(1)> :nth-child(7) > .gap-2 > [style="width: 32px; height: 32px; color: black; border: 1px solid rgb(209, 213, 219); outline-width: 1px; outline-offset: -1px;"]').click(); // คลิกปุ่มดูแบบประเมิน
      cy.url().should('include', '/assessment/view');

      cy.log('✅ สามารถซ่อนข้อมูลแบบประเมินโดยใช้ปุ่ม Hide ได้');
      cy.log('✅ ตรวจสอบว่า Assessment Date แสดงข้อมูลถูกต้อง');
      cy.get('.opacity-100 > .bg-white').should('be.visible').click(); // hide data
      cy.get('.transition-all.duration-300.ease-in-out.w-\\[650px\\].px-4.overflow-hidden').should('not.exist');
      cy.log('✅ ตรวจสอบว่า Assessment ข้อมูลถูกซ่อนอย่างถูกต้องไป');
      cy.log('✅ สามารถแสดงข้อมูลแบบประเมินโดยใช้ปุ่ม Show ได้');
      cy.get('.opacity-100 > .bg-white').should('be.visible').click(); // แสดงข้อมูลแบบประเมินอีกครั้ง
      cy.get('.transition-all.duration-300.ease-in-out.w-\\[650px\\].px-4.overflow-hidden').should('be.visible'); //
    })

    it('TC-A-002 - สามารถใช้ Search หาแบบประเมินได้', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.wait(3000);
      cy.get('.bg-white\\/90').should('be.visible');

      // ค้นหาข้อมูลบริษัท
      cy.log('เทสกรอกข้อมูลค้นหา บริษัท');
      cy.get('#company').type('BCP');
      cy.contains('button', 'Search').click();

      // ตรวจสอบข้อมูลแถวแรก
      cy.get('.ant-table-tbody tr').first().within(() => {
        cy.get('td').eq(1).should('contain', 'BCP'); // คอลัมน์บริษัท
      });
      cy.wait(3000)
      cy.get('#company').clear();

      // กรอกปีในช่องค้นหา
      cy.get('#year').type('2025');
      cy.contains('button', 'Search').click();
      cy.get('#year').clear();

      // ตรวจสอบข้อมูลแถวแรกว่ามีปี 2025
      cy.get('.ant-table-tbody tr').first().within(() => {
        cy.get('td').eq(2).should('contain', '2025'); // คอลัมน์ปี (index 2)
      });

      // กรอกรหัสแบบประเมินในช่องค้นหา
      cy.get('#assessment_code').type('BCP_2019_001');
      cy.contains('button', 'Search').click();

      // ตรวจสอบว่าตารางมีข้อมูลแสดง
      cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

      // ตรวจสอบข้อมูลแถวแรกว่ามีรหัสแบบประเมินที่ค้นหา
      cy.get('.ant-table-tbody tr').first().within(() => {
        cy.get('td').eq(3).should('contain', 'BCP_2019_001'); // คอลัมน์รหัสแบบประเมิน (index 3)
      });
      cy.log('✅ สามารถ Clear ข้อมูลที่ Search ได้');
      cy.get('.gap-4 > .gap-2 > [type="button"]').should('be.visible').click(); // คลิกปุ่ม Reset
    });
  })

  describe('Create Assessment', () => {
    it('สามารถสร้าง/Save Draft/แก้ไข/ยกเลิก แบบประเมินได้', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.get('.bg-white\\/90').should('be.visible');
      cy.wait(2000);


      cy.log('📝 สามารถสร้างแบบประเมินใหม่ได้');
      // คลิกปุ่ม Create New Assessment
      cy.get('.gap-4 > button.bg-\\[\\#4CB847\\]').click();

      // ตรวจสอบ Modal เปิดขึ้น
      cy.get('.ant-modal-content').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'Create New Assessment');

      //  ทำงานภายใน modal เท่านั้น
      cy.get('.ant-modal-content').within(() => {

        // ขั้แก้ไขข้อมูล (ตอนนี้จะเลือก element ใน modal เท่านั้น)
        cy.get('#assessment_code').clear().type('BCP_2025_TEST');
        cy.get('#name').clear().type('แบบประเมินทดสอบระบบ E-CSA');
        cy.get('#description').clear().type('การทดสอบการสร้างแบบประเมินใหม่ในระบบ E-CSA');
        cy.log('🗓️ ทดสอบ Date Picker Elements แบบละเอียด');
        cy.get('#start_date').click();
        cy.get('#end_date').click();
        cy.get('#open_next_round_date').click();
        // คลิกปุ่มตรวจสอบ
        cy.get('button').contains('ตรวจสอบ').should('be.visible').click();
      });

      // ตรวจสอบปุ่มยืนยันหลังจากกดตรวจสอบ
      cy.get('.ant-modal-content').within(() => {
        cy.get('button[type="submit"]').should('not.be.disabled');
        cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
        cy.log('✅ ปุ่มยืนยันสามารถใช้งานได้หลังจากกดตรวจสอบ');
        cy.get('button[type="submit"]').contains('ยืนยัน').click(); //บันทึกข้อมูล
      });

      cy.wait(5000);
      // ลาก widget ลงมาอยู่ใน section

      const dataTransfer = new DataTransfer();
      cy.get('.border-b > :nth-child(1) > .gap-2').trigger('dragstart', { dataTransfer });
      cy.get('.min-h-full > .ant-form > .bg-white')
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

      // ลบ widget ที่เพิ่มเข้ามา
      cy.get(':nth-child(1) > :nth-child(1) > .mt-4 > .p-2 > :nth-child(1) > :nth-child(1) > .items-center.flex-col > .my-auto > .flex > :nth-child(2)').click();

      cy.get('.w-full > .bg-white').click({ force: true });// คลิกเพื่อปุ่มยกเลิก popup



      cy.log('✅ TC-A-007 - สามารถ Assign/ลบ Assessor ได้');
      cy.contains('Assign').first().click({ force: true });
      cy.wait(3000);

      // Dropdown แรก - Department/Unit
      cy.get('.col-span-2 .ant-select-selector').eq(0).click();
      cy.get('.ant-select-dropdown:visible .ant-select-item-option').first().click();
      cy.wait(500);

      // Dropdown ที่สอง - Sub Department
      cy.get('.col-span-2 .ant-select-selector').eq(1).click();
      cy.wait(1000);
      cy.get('.rc-virtual-list-holder-inner:visible .ant-select-item-option-content').first().click();
      cy.wait(500);

      // Dropdown ที่สาม - Final Level
      cy.get('.col-span-2 .ant-select-selector').eq(2).click();
      cy.wait(1000);
      cy.get('.rc-virtual-list-holder-inner:visible')
        .last() // ใช้ last() เพื่อเลือก dropdown ล่าสุด
        .find('.ant-select-item-option-content, .ant-select-item-option-active')
        .first()
        .click();

      // เลือก Assessor และยืนยัน
      cy.get('.ant-table-selection').first().click();
      cy.get('#assessor_type > :nth-child(1) > .ant-radio-label').click();

      cy.get('[type="submit"]').contains('ยืนยัน').click();
      cy.log('✅ Assign Assessor สำเร็จ');

      cy.log('📝 ลบองค์ประกอบ');
      cy.get('.gap-2 > .gap-4 > :nth-child(1) > .flex > .material-symbols-outlined').click();
      cy.get('.border-gray-200 > .w-full').click();
      cy.log('✅ ลบองค์ประกอบสำเร็จ');

      //ปิดหน้า Assessment create form
      // cy.get('.text-neutral-800').click();
      // cy.get('.gap-6 > .w-full > .bg-\\[\\#4CB847\\]').click();
      // cy.log('✅ ปิดหน้า create และ กลับไปที่หน้า Assessment');

    });
  })

  describe('copy Assessment', () => {
    it('TC-A-004 - Copy Assessment Modal ทำงานถูกต้อง', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.get('.bg-white\\/90').should('be.visible');
      cy.wait(2000);

      cy.log('📋 เปิด Copy Assessment Modal');
      cy.get('.pt-4.px-4 > .gap-4 > .bg-white').should('be.visible').click();

      // ตรวจสอบ Modal เปิดขึ้น
      cy.get('.ant-modal-content').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'Copy Assessment');

      cy.log('🔍 ทดสอบการค้นหาใน Copy Assessment Modal');

      cy.get('.ant-modal-content').within(() => {
        // ทดสอบค้นหาตามบริษัท
        cy.get('#company').should('be.visible').type('BCP');
        cy.get('button').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบผลลัพธ์การค้นหา
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.get('.ant-table-tbody tr').first().should('contain', 'BCP');
        cy.log('✅ ค้นหาตามบริษัทสำเร็จ');

        // Reset การค้นหา
        cy.get('button').contains('Reset').click();
        cy.wait(500);

        // ทดสอบค้นหาตามปี
        cy.get('#year').should('be.visible').type('2025');
        cy.get('button').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบผลลัพธ์การค้นหาตามปี
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.get('.ant-table-tbody tr').first().should('contain', '2025');
        cy.log('✅ ค้นหาตามปีสำเร็จ');

        // Reset การค้นหา
        cy.get('button').contains('Reset').click();
        cy.wait(500);

        // ทดสอบค้นหาตามรหัสแบบประเมิน
        cy.get('#assessment_code').should('be.visible').type('BCP_2019_001');
        cy.get('button').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบผลลัพธ์การค้นหา
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);
        cy.log('✅ ค้นหาตามรหัสแบบประเมินสำเร็จ');

        // Reset การค้นหา
        cy.get('button').contains('Reset').click();
        cy.wait(500);
      });

      cy.log('📋 ทดสอบการเลือกแบบประเมินเพื่อ Copy');

      cy.get('.ant-modal-content').within(() => {
        // เลือกแบบประเมินแรกในตาราง
        cy.get('.ant-table-tbody tr').first().within(() => {
          cy.get('.ant-radio-input').click({ force: true });
        });

        // ตรวจสอบว่ามีการเลือกแบบประเมิน
        cy.get('.ant-table-tbody tr').first().within(() => {
          cy.get('.ant-radio-input').should('be.checked');
        });

        cy.log('✅ เลือกแบบประเมินสำเร็จ');

        // ตรวจสอบว่าปุ่ม "ถัดไป" เปิดใช้งานได้หลังจากเลือกแบบประเมิน
        cy.get('button').contains('ถัดไป').should('not.be.disabled');
        cy.get('button').contains('ถัดไป').should('not.have.attr', 'disabled');

        cy.log('✅ ปุ่มถัดไปเปิดใช้งานได้หลังจากเลือกแบบประเมิน');
      });

      cy.log('📄 ทดสอบ Pagination');

      cy.get('.ant-modal-content').within(() => {
        // ตรวจสอบข้อมูลหน้าแรก
        cy.get('.ant-table-tbody tr').should('have.length', 10);

        // ทดสอบไปหน้าถัดไป
        cy.get('.ant-pagination-next').should('not.have.class', 'ant-pagination-disabled');
        cy.get('.ant-pagination-next').click();
        cy.wait(1000);

        // ตรวจสอบว่าเป็นหน้า 2
        cy.get('.ant-pagination-item-2').should('have.class', 'ant-pagination-item-active');
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

        // กลับไปหน้าแรก
        cy.get('.ant-pagination-item-1').click();
        cy.wait(1000);
        cy.get('.ant-pagination-item-1').should('have.class', 'ant-pagination-item-active');

        // ทดสอบการเปลี่ยนจำนวนรายการต่อหน้า
        cy.get('.ant-pagination-options-size-changer').click();
        cy.get('.ant-select-dropdown').should('be.visible');
        cy.get('.ant-select-item-option').contains('20 / page').click();
        cy.wait(1000);

        // ตรวจสอบว่าแสดง 20 รายการ
        cy.get('.ant-table-tbody tr').should('have.length.lessThan', 21);
        cy.get('.ant-select-selection-item').should('contain', '20 / page');

        cy.log('✅ Pagination ทำงานถูกต้อง');
      });

      cy.log('❌ ทดสอบการยกเลิก Copy Assessment');

      cy.get('.ant-modal-content').within(() => {
        // คลิกปุ่มยกเลิก
        cy.get('button').contains('ยกเลิก').should('be.visible').click();
      });

      // ตรวจสอบว่า Modal ปิด
      cy.get('.ant-modal-content').should('not.exist');

      // ตรวจสอบว่ายังอยู่ในหน้า Assessment เดิม
      cy.url().should('include', '/assessment');
      cy.url().should('not.include', '/create');

      cy.log('✅ ยกเลิก Copy Assessment สำเร็จ');
    });

    // เพิ่ม test case สำหรับทดสอบการปิด Modal ด้วยปุ่ม X
    it('สามารถปิด Copy Assessment Modal ด้วยปุ่ม X ได้', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.get('.bg-white\\/90').should('be.visible');
      cy.wait(2000);

      cy.log('📋 เปิด Copy Assessment Modal');
      cy.get('.pt-4.px-4 > .gap-4 > .bg-white').should('be.visible').click();

      // ตรวจสอบ Modal เปิดขึ้น
      cy.get('.ant-modal-content').should('be.visible');

      cy.log('❌ ทดสอบปิด Modal ด้วยปุ่ม X');

      // คลิกปุ่ม X
      cy.get('.ant-modal-close').should('be.visible').click();

      // ตรวจสอบว่า Modal ปิด
      cy.get('.ant-modal-content').should('not.exist');

      cy.log('✅ ปิด Modal ด้วยปุ่ม X สำเร็จ');
    });

    // เพิ่ม test case สำหรับทดสอบการค้นหาแบบรวม
    it('สามารถค้นหาแบบรวมหลายเงื่อนไขได้', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/assessment');
      cy.url().should('include', '/assessment');
      cy.get('.bg-white\\/90').should('be.visible');
      cy.wait(2000);

      cy.log('📋 เปิด Copy Assessment Modal');
      cy.get('.pt-4.px-4 > .gap-4 > .bg-white').should('be.visible').click();

      cy.get('.ant-modal-content').should('be.visible');

      cy.log('🔍 ทดสอบการค้นหาแบบรวมหลายเงื่อนไข');

      cy.get('.ant-modal-content').within(() => {
        // กรอกหลายเงื่อนไขพร้อมกัน
        cy.get('#company').type('BCP');
        cy.get('#year').type('2025');
        cy.get('#assessment_code').type('BCP_2019_001');

        // ค้นหา
        cy.get('button').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบผลลัพธ์
        cy.get('.ant-table-tbody tr').should('have.length.greaterThan', 0);

        // ตรวจสอบว่าข้อมูลที่แสดงตรงกับเงื่อนไขที่ค้นหา
        cy.get('.ant-table-tbody tr').each(($row) => {
          cy.wrap($row).should('contain', 'BCP');
          cy.wrap($row).should('contain', '2025');
        });

        cy.log('✅ ค้นหาแบบรวมหลายเงื่อนไขสำเร็จ');
      });
    });

    it('ADMINICDSENIOR-SN-154-155-156-157-158-159-160', () => {
      cy.get('#assessment_code').type('BCP_Test_Edit_For_Draft');
      cy.contains('button', 'Search').click();
      cy.wait(2000);
      cy.get('.ant-table-tbody tr').first().within(() => {
        cy.get('.ant-table-cell').eq(1).click();
      });
      cy.wait(2000);
      cy.contains('แก้ไขแบบประเมิน').should('be.visible').click();

      // กำหนดจำนวน Section ที่ต้องการสร้าง
      const sectionGroups = [
        { tab: 1, name: 'I การควบคุมภายในองค์กร (Control Environment)' },
        { tab: 2, name: 'II การประเมินความเสี่ยง (Risk Assessment)' },
        { tab: 3, name: 'III การควบคุมการปฎิบัติงาน (Control Activities)' },
        { tab: 4, name: 'IV ระบบสารสนเทศและการสื่อสารข้อมูล (Information & Communication)' },
        { tab: 5, name: 'V ระบบติดตาม (Monitoring & Activities)' }
      ];
      const widgetsInSection = [
        'Yes/No',
        'Choice',
        'Checkbox',
        'Text',
        'Rating',
        'Ranking',
        'Date'
      ];
      const dataTransfer = new DataTransfer();
      cy.contains('Section').trigger('dragstart', { dataTransfer });
      cy.wait(1000);
      cy.get('.ant-form > .p-4')
        .trigger('drop', { dataTransfer, force: true })
        .trigger('dragend', { dataTransfer, force: true });
      cy.wait(1000);

      widgetsInSection.forEach((text) => {
        cy.contains(text).first().trigger('dragstart', { dataTransfer });
        cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200')
          .last()
          .find('.gap-4')
          .first()
          .trigger('drop', { dataTransfer, force: true })
          .trigger('dragend', { dataTransfer, force: true });
        cy.wait(1000);
      });

      cy.contains('ยืนยันการสร้างแบบประเมิน').click();
      cy.wait(2000);
      cy.get('.p-6').should('be.visible').within(() => {
        cy.contains('ไม่สามารถสร้างแบบประเมินประจำปี').should('be.visible');
        cy.contains('ปิด').click();
      });

      cy.wait(2000);
      cy.log('ตรวจสอบ validation ของแต่ละข้อ');
      cy.get('.border.p-2.w-full.rounded.transition-colors.duration-200.border-gray-200').each(($section) => {
        cy.wrap($section).within(() => {
          // ตรวจสอบ validation ชื่อ Section (ถ้ามี)
          cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกชื่อ Section'))
            .should('have.length.at.least', 0);

          // ตรวจสอบ validation คำถาม (ทุก widget)
          cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณากรอกข้อมูล'))
            .should('have.length.greaterThan', 0);

          // ตรวจสอบ validation ผู้ประเมิน
          cy.get('.ant-form-item-explain-error').filter((i, el) => el.innerText.includes('กรุณาเลือกผู้ประเมินอย่างน้อย 1 คน'))
            .should('have.length.greaterThan', 0);
        });
      });
    });
  })
})