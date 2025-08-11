const { faker } = require("@faker-js/faker");

describe('Master Data', () => {
  beforeEach(() => {
    cy.loginApiAssessor();
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('Minified React error #418') ||
        err.message.includes('visit https://react.dev/errors') ||
        err.message.includes('React') ||
        err.message.includes('chunk loading failed') ||
        err.message.includes('HTML')) {
        return false;
      }
      return true;
    });
  });

  describe.only('2.1.1 สามารถใช้งาน Master Data การจัดการ Email Template ได้', () => {
    const randomStageNo = faker.number.int({ min: 1, max: 10 }); // เลข 1-10
    const randomRemind1 = faker.number.int({ min: -30, max: -1 }); // เลขติดลบ -30 ถึง -1
    const randomRemind2 = faker.number.int({ min: -30, max: -1 }); // เลขติดลบ -30 ถึง -1

    it('ADMINICDJUNIOR-SN-08 - การจัดการ Email Template', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');

      // ตรวจสอบว่ามี form สำหรับค้นหารายการ
      cy.get('form').should('be.visible');
      // ตรวจสอบว่ามี table สำหรับแสดงรายการ Email Template
      cy.get('.card').should('be.visible');
      cy.contains('Template ทั้งหมด').should('be.visible');
      cy.get('.ant-table').should('be.visible');
    });

    it('ADMINICDJUNIOR-SN-09 - ดูตัวอย่าง email Template', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      // คลิกที่ Template ตัวแรกในตาราง (row แรก)
      cy.get('.ant-table-tbody tr').first().find('button').first().click();

      // ตรวจสอบว่าเข้าสู่หน้ารายละเอียด Template
      cy.url().should('include', '/master-data/email/');
      cy.get('h2').contains('ข้อมูล').should('be.visible');

      // คลิกปุ่ม "ดูตัวอย่าง" ใน radio button
      cy.get('.ant-radio-button-wrapper').contains('ดูตัวอย่าง').click();

      // ตรวจสอบว่าแสดงหน้าดูตัวอย่าง
      cy.get('.ant-radio-button-wrapper-checked').contains('ดูตัวอย่าง').should('exist');
      cy.get('.bg-white').contains('From:').should('be.visible');
      cy.get('.bg-white').contains('To:').should('be.visible');
      cy.get('.bg-white').contains('Subject:').should('be.visible');
      cy.get('.content-wrapper').should('be.visible');
    });

    it('ADMINICDJUNIOR-SN-10 - กลับสู่หน้า Email Template ทั้งหมด', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');

      // คลิกที่ Template ตัวแรกในตาราง (row แรก) เพื่อเข้าสู่หน้ารายละเอียด
      cy.get('.ant-table-tbody tr').first().find('button').first().click();

      // ตรวจสอบว่าเข้าสู่หน้ารายละเอียด Template
      cy.url().should('include', '/master-data/email/');
      cy.get('h2').contains('ข้อมูล').should('be.visible');

      // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
      cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');

      // ตรวจสอบว่าแสดงฟอร์มแก้ไขเนื้อหา
      cy.contains('From:').should('be.visible');
      cy.contains('To:').should('be.visible');
      cy.contains('Subject:').should('be.visible');
      cy.contains('Body:').should('be.visible');

      // คลิกที่ปุ่ม arrow_back หรือหัวข้อ Template เพื่อกลับไปหน้ารายการ
      cy.contains('การจัดการ e-mail Template').should('have.text', 'การจัดการ e-mail Template').click();
      // cy.get('button[aria-label*="Go back to"]').click();

      // ตรวจสอบว่ากลับมาหน้ารายการ Template
      cy.url().should('eq', 'https://dev-ecsa.looksocial.dev/master-data/email');
      cy.contains('Template ทั้งหมด').should('be.visible');
      cy.get('.ant-table').should('be.visible');

      // คลิกไอคอนรูปปากกา (edit) ของ row แรก
      cy.get('.ant-table-tbody tr').first().find('button .material-symbols-outlined').contains('edit').click();

      // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
      cy.get('.ant-modal').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

      // ตรวจสอบ fields ใน modal โดยใช้ within
      cy.get('.ant-modal').within(() => {
        cy.get('#name').should('be.visible');
        cy.get('#stage_no').should('be.visible');
        cy.get('#stage_desc').should('be.visible');
        cy.get('#remind1').should('be.visible');
      });

      // คลิกปิด modal
      cy.get('.ant-modal-close').click();

    });

    it('ADMINICDJUNIOR-SN-11 - แก้ไขรายละเอียด Template', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');

      // เข้าสู่รายละเอียด Template
      cy.get('.ant-table-tbody tr').first().find('button').first().click();

      // ตรวจสอบว่าเข้าสู่หน้ารายละเอียด Template
      cy.url().should('include', '/master-data/email/');

      // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
      cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');

      // แก้ไข Subject โดยใช้ ID เฉพาะ
      cy.get('[data-slate-editor="true"][contenteditable="true"]').first().clear().click();
      cy.get('[data-slate-editor="true"][contenteditable="true"]').first().click().type('Test Subject - Updated Template');

      // แก้ไข Body โดยสร้างประโยคที่ใช้ dynamic variables ครบทุกองค์ประกอบ
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().clear().click();

      // สร้างข้อความที่ใช้ dynamic variables ครบทุกตัว
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('เรียน ');
      cy.get('button').contains('ชื่อย่อบริษัท').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type(' / ');
      cy.get('button').contains('ชื่อบริษัท').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('{enter}{enter}ขอแจ้งให้ทราบว่า การประเมินความเพียงพอของระบบการควบคุมภายในประจำปี ');
      cy.get('button').contains('ปีที่ประเมิน').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type(' จะเริ่มดำเนินการในวันที่ ');
      cy.get('button').contains('วันที่เริ่มการประเมิน').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('{enter}{enter}รายละเอียดการประเมิน:{enter}• รหัสแบบประเมิน: ');
      cy.get('button').contains('รหัสของแบบประเมิน').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('{enter}• หากท่านมีข้อสงสัยเพิ่มเติม กรุณาติดต่อ ICD Admin ที่เบอร์ ');
      cy.get('button').contains('เบอร์ของ ICD Admin').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('{enter}{enter}สำหรับการเข้าสู่ระบบประเมิน ');
      cy.get('button').contains('Click ที่นี่ (เพื่อเข้าสู่ Assessment)').click();

      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().type('{enter}{enter}ขอบคุณสำหรับความร่วมมือครับ{enter}{enter}ด้วยความเคารพ{enter} จากทีม Looksocial');

      // ตรวจสอบว่า dynamic variables ทั้งหมดถูกแทรกใน body
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.nameAcronymCompany}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.nameCompany}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.year}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.dateOpening}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.assessmentDocumentCode}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.phoneNumberIcdAdmin}}');
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().should('contain', '{{.clickHereToAssessment}}');
    });

    it('ADMINICDJUNIOR-SN-12 - แก้ไขข้อมูลแบบประเมินของ email Template', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');

      // คลิกที่ Template ตัวแรกในตาราง (row แรก)
      cy.wait(2000);
      cy.get('#code').type('EML-04-001');
      cy.contains('Search').click();
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // คลิกปุ่ม "แก้ไขข้อมูล"
      cy.contains('แก้ไขข้อมูล').click();

      // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
      cy.get('.ant-modal').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

      // แก้ไขข้อมูลใน modal
      cy.get('.ant-modal').within(() => {
        // แก้ไข e-mail เรื่อง
        cy.get('#name').clear().type('ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');
        // แก้ไข Stage Number
        cy.get('#stage_no').clear().type('2');
        // แก้ไข Stage Description
        cy.get('#stage_desc').clear().type('Update สร้างแบบประเมิน - Modified');
        // แก้ไข Remind 1
        cy.get('#remind1').clear().type(randomRemind1);
        // ตรวจสอบว่าข้อมูลถูกแก้ไขแล้ว
        cy.get('#name').should('have.value', 'ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');
        cy.get('#stage_no').should('have.value', '2.0'); //เพราะว่าจะมี ทศนิยม 1 ตำแหน่ง
        cy.get('#stage_desc').should('have.value', 'Update สร้างแบบประเมิน - Modified');
        cy.get('#remind1').should('have.value', randomRemind1.toString());
        cy.contains('บันทึก').click();
      });

      cy.get('.flex-1 > .justify-center').should('be.visible').should('have.text', 'บันทึกการเปลี่ยนแปลงของ e-mail เรื่อง ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated สำเร็จ');
      cy.contains('ปิด').click();
      cy.wait(2000);
      cy.get('.gap-6 > .flex-col > .text-gray-800').should('have.text', randomRemind1.toString());

      // // ตรวจสอบ notification บันทึกสำเร็จ (หากมี)
      // cy.get('.ant-notification', { timeout: 10000 }).should('be.visible');
      // cy.get('.ant-notification').should('contain', 'บันทึก');

      // // ตรวจสอบว่าข้อมูลในหน้ารายละเอียดอัพเดทแล้ว
      // cy.get('h2').contains('ข้อมูล').should('be.visible');
      // cy.contains('ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated').should('be.visible');
      // cy.contains('2  Update สร้างแบบประเมิน - Modified').should('be.visible');
      // cy.contains('-45000').should('be.visible');
    });

    it('ADMINICDJUNIOR-SN-13 - แก้ไขข้อมูลวัน Remind', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');

      cy.wait(2000);
      cy.get('#code').type('EML-02-006');
      cy.contains('Search').click();
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // คลิกปุ่ม "แก้ไขข้อมูล"
      cy.contains('แก้ไขข้อมูล').click();

      // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
      cy.get('.ant-modal').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

      // แก้ไขข้อมูลใน modal
      cy.get('.ant-modal').within(() => {
        // แก้ไข e-mail เรื่อง
        cy.get('#name').clear().type('ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');

        // แก้ไข Stage Number
        cy.get('#stage_no').clear().type('2');

        // แก้ไข Stage Description
        cy.get('#stage_desc').clear().type('Update สร้างแบบประเมิน - Modified');

        // แก้ไข Remind 1
        cy.get('#remind1').clear().type(randomRemind1);
        cy.get('#remind2').clear().type(randomRemind2);

        // ตรวจสอบว่าข้อมูลถูกแก้ไขแล้ว
        cy.get('#name').should('have.value', 'ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');
        cy.get('#stage_no').should('have.value', '2.0'); //เพราะว่าจะมี ทศนิยม 1 ตำแหน่ง
        cy.get('#stage_desc').should('have.value', 'Update สร้างแบบประเมิน - Modified');
        cy.get('#remind1').should('have.value', randomRemind1.toString());
        cy.get('#remind2').should('have.value', randomRemind2.toString());

        cy.contains('บันทึก').click();
      });

      cy.get('.flex-1 > .justify-center').should('be.visible').should('have.text', 'บันทึกการเปลี่ยนแปลงของ e-mail เรื่อง ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated สำเร็จ');

      cy.get('.ant-modal-body > .gap-6').within(() => {
        cy.contains('ปิด').click();
      })

      cy.wait(2000);
      cy.get('.gap-6 > :nth-child(1) > .text-gray-800').should('have.text', randomRemind1.toString());
      cy.get('.gap-6 > :nth-child(2) > .text-gray-800').should('have.text', randomRemind2.toString());
    });

    it('ADMINICDJUNIOR-SN-14 - แสดง Guide Text หัวข้อ Remind ที่ EML-04-001', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      cy.get('button').contains('EML-04-001').click();

      // เลื่อนเมาส์ไปที่เครื่องหมายตกใจข้างคำว่า Remind
      cy.wait(2000);
      cy.contains('Remind 1')
        .parent()
        .find('.material-symbols-outlined')
        .trigger('mouseover');

      // ตรวจสอบ Guide Text
      cy.get('.ant-tooltip-open').should('be.visible');
      cy.get('.ant-tooltip-inner')
        .should('contain', 'จำนวนวันที่แจ้งเตือนผ่านทางอีเมลก่อนวันเปิดแบบประเมิน');
    });

    it('ADMINICDJUNIOR-SN-15 - แสดง Guide Text หัวข้อ Remind ที่ EML-02-006', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // ค้นหา Template EML-02-006
      cy.get('#code').type('EML-02-006{enter}');
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(2000);

      // เลื่อนเมาส์ไปที่ Remind 1
      cy.contains('Remind 1')
        .parent()
        .find('.material-symbols-outlined')
        .trigger('mouseover');

      cy.get('.ant-tooltip-inner')
        .should('contain', 'จำนวนวันที่แจ้งเตือนผ่านทางอีเมลก่อนวันปิดแบบประเมินครั้งที่ 1');

      cy.get('body').trigger('mouseover'); // เลื่อนเมาส์ออกก่อน
      cy.wait(500);

      cy.contains('Remind 2')
        .parent()
        .find('.material-symbols-outlined')
        .trigger('mouseover');

      cy.get('.ant-tooltip-inner')
        .should('contain', 'จำนวนวันที่แจ้งเตือนผ่านทางอีเมลก่อนวันปิดแบบประเมินครั้งที่ 2');
    });

    it('ADMINICDJUNIOR-SN-16 - Search หา Email Template', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // ตรวจสอบสถานะเริ่มต้น - แสดงรายการทั้งหมด
      cy.get('.ant-table-tbody tr').should('have.length.at.least', 1);
      cy.contains('Template ทั้งหมด').should('be.visible');

      // กรอกข้อมูลในฟอร์มค้นหา
      cy.get('#code').clear().type('EML-04-001');

      // ตรวจสอบว่าข้อมูลถูกกรอกแล้ว
      cy.get('#code').should('have.value', 'EML-04-001');

      // คลิก Search
      cy.get('button[type="submit"]').contains('Search').click();
      cy.wait(1000);

      // ตรวจสอบผลการค้นหา
      cy.get('.ant-table-tbody tr').should('have.length.at.least', 1);

      // ตรวจสอบว่าผลลัพธ์ตรงกับเงื่อนไขที่ค้นหา
      cy.get('.ant-table-tbody tr').each(($row) => {
        cy.wrap($row).should('contain', 'EML-04-001');
      });
    });

    it('ADMINICDJUNIOR-SN-17 - Clear ข้อมูลที่ Search', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // บันทึกจำนวนรายการเริ่มต้น
      cy.get('.ant-table-tbody tr').then(($rows) => {
        const initialRowCount = $rows.length;

        // กรอกข้อมูลในฟอร์มค้นหา
        cy.get('#code').clear().type('EML-04-001');
        // cy.get('#stage').clear().type('1');
        // cy.get('#name').clear().type('ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน');

        // คลิก Search
        cy.get('button[type="submit"]').contains('Search').click();
        cy.wait(1000);

        // ตรวจสอบว่าได้ผลการค้นหา
        cy.get('.ant-table-tbody').should('contain', 'EML-04-001');
        cy.get('.ant-table-tbody tr').should('have.length.lessThan', initialRowCount);

        // คลิก Reset
        cy.get('button[type="button"]').contains('Reset').click();
        cy.wait(1000);

        // ตรวจสอบว่าข้อมูลถูกเคลียร์
        cy.get('#code').should('have.value', '');
        cy.get('#stage').should('have.value', '');
        cy.get('#name').should('have.value', '');

        // ตรวจสอบว่าแสดงรายการทั้งหมดกลับมา
        cy.get('.ant-table-tbody tr').should('have.length', initialRowCount);

        // ตรวจสอบว่าไม่มีเงื่อนไขการค้นหาคงเหลือ
        cy.url().should('not.include', 'code=');
        cy.url().should('not.include', 'stage=');
        cy.url().should('not.include', 'name=');
      });
    });
  })

  describe('2.1.2 ไม่สามารถใช้งาน Master Data การจัดการ Email Template ได้', () => {

    it('ADMINICDJUNIOR-SN-18 - ไม่สามารถแก้ไข Template ได้ เนื่องจากกรอกรายละเอียดข้อมูลแบบประเมินไม่ครบหรือไม่กรอกข้อมูลใด ๆ เลย', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // ทดสอบ Template EML-04-001 (มี Remind 1)
      cy.get('#code').type('EML-04-001{enter}');
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // คลิกปุ่ม "แก้ไขข้อมูล"
      cy.contains('แก้ไขข้อมูล').click();

      // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
      cy.get('.ant-modal').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');

      // ทดสอบกรณีไม่กรอกข้อมูลใด ๆ เลย
      cy.get('.ant-modal').within(() => {
        // เคลียร์ข้อมูลทั้งหมด
        cy.get('#name').clear();
        cy.get('#stage_no').clear();
        cy.get('#stage_desc').clear();
        cy.get('#remind1').clear();

        // ตรวจสอบ validation messages โดยใช้ class ที่ถูกต้อง
        cy.get('.ant-form-item-explain-error').should('have.length', 4); // มี 4 error messages

        // ตรวจสอบ error message แต่ละฟิลด์
        cy.get('#name_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#stage_no_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#stage_desc_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#remind1_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

        // ตรวจสอบว่าฟิลด์มี error state
        cy.get('#name').should('have.class', 'ant-input-status-error');
        cy.get('#stage_no').should('have.attr', 'aria-invalid', 'true');
        cy.get('#stage_desc').should('have.class', 'ant-input-status-error');
        cy.get('#remind1').should('have.class', 'ant-input-status-error');

        // ตรวจสอบว่าปุ่มบันทึกถูก disable
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('button[type="submit"]').should('have.class', 'bg-[#F3F4F6]');
        cy.get('button[type="submit"]').should('have.css', 'cursor', 'not-allowed');
      });

      // ปิด modal และทดสอบ Template EML-02-006 (มี Remind 1 และ 2)
      cy.get('.ant-modal-close').click();
      cy.contains('การจัดการ e-mail Template').click();
      cy.wait(1000);

      cy.get('#code').clear().type('EML-02-006{enter}');
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      cy.contains('แก้ไขข้อมูล').click();

      cy.get('.ant-modal').within(() => {
        // เคลียร์ข้อมูลทั้งหมด
        cy.get('#name').clear();
        cy.get('#stage_no').clear();
        cy.get('#stage_desc').clear();
        cy.get('#remind1').clear();
        cy.get('#remind2').clear();

        // ตรวจสอบ validation messages สำหรับ EML-02-006 (จะมี 5 error messages)
        cy.get('.ant-form-item-explain-error').should('have.length', 5);

        // ตรวจสอบ error message แต่ละฟิลด์
        cy.get('#name_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#stage_no_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#stage_desc_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#remind1_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');
        cy.get('#remind2_help .ant-form-item-explain-error').should('contain', 'กรุณากรอกข้อมูล');

        // ตรวจสอบว่าปุ่มบันทึกถูก disable
        cy.get('button[type="submit"]').should('be.disabled');
      });
    });

    it('ADMINICDJUNIOR-SN-19 - ไม่สามารถแก้ไข Template ได้ เนื่องจาก Remind ที่ไม่ใช่ตัวเลข', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // ทดสอบ Template EML-04-001
      cy.get('#code').type('EML-04-001{enter}');
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      cy.contains('แก้ไขข้อมูล').click();

      cy.get('.ant-modal').within(() => {
        // กรอกข้อมูลปกติ
        cy.get('#name').clear().type('Test Email Subject');
        cy.get('#stage_no').clear().type('1');
        cy.get('#stage_desc').clear().type('Test Stage Description');

        // กรอก Remind ด้วยตัวอักษร
        cy.get('#remind1').clear().type('abc123');

        // ตรวจสอบ validation error สำหรับ Remind 1
        cy.get('#remind1_help .ant-form-item-explain-error')
          .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');

        // ตรวจสอบ error state ของ input field
        cy.get('#remind1').should('have.class', 'ant-input-status-error');
        cy.get('#remind1').should('have.attr', 'aria-invalid', 'true');
        cy.get('#remind1').should('have.value', 'abc123');

        // ตรวจสอบว่าปุ่มบันทึกถูก disable
        cy.get('button[type="submit"]').should('be.disabled');

        // พยายามคลิกบันทึก (ถึงแม้จะ disabled)
        cy.contains('บันทึก').click({ force: true });
      });

      // ปิด modal และทดสอบ Template EML-02-006
      cy.get('.ant-modal-close').click();
      cy.contains('การจัดการ e-mail Template').click();
      cy.wait(1000);

      cy.get('#code').clear().type('EML-02-006{enter}');
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      cy.contains('แก้ไขข้อมูล').click();

      cy.get('.ant-modal').within(() => {
        cy.get('#name').clear().type('Test Email Subject 2');
        cy.get('#stage_no').clear().type('2');
        cy.get('#stage_desc').clear().type('Test Stage Description 2');

        // กรอก Remind 1 และ 2 ด้วยตัวอักษร
        cy.get('#remind1').clear().type('xyz789');
        cy.get('#remind2').clear().type('def456');

        // ตรวจสอบ validation errors สำหรับทั้ง Remind 1 และ 2
        cy.get('#remind1_help .ant-form-item-explain-error')
          .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');
        cy.get('#remind2_help .ant-form-item-explain-error')
          .should('contain', 'กรุณากรอกตัวเลขติดลบ เช่น -1, -2, -3');

        // ตรวจสอบ error states
        cy.get('#remind1').should('have.class', 'ant-input-status-error');
        cy.get('#remind1').should('have.attr', 'aria-invalid', 'true');
        cy.get('#remind1').should('have.value', 'xyz789');

        cy.get('#remind2').should('have.class', 'ant-input-status-error');
        cy.get('#remind2').should('have.attr', 'aria-invalid', 'true');
        cy.get('#remind2').should('have.value', 'def456');

        // ตรวจสอบว่าปุ่มบันทึกถูก disable
        cy.get('button[type="submit"]').should('be.disabled');

        // พยายามคลิกบันทึก (ถึงแม้จะ disabled)
        cy.contains('บันทึก').click({ force: true });
      });
    });

    it('ADMINICDJUNIOR-SN-20 - ไม่สามารถแก้ไข Template ได้ เนื่องจากไม่ได้กรอก Subject', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // เลือก Template ใดก็ได้
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
      cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');
      cy.wait(3000)

      // เคลียร์ Subject
      cy.get('[data-slate-editor="true"][contenteditable="true"] > [data-slate-node="element"]').first().click().clear();

      // ตรวจสอบว่า Subject ว่างเปล่า - อาจมี <br> tag เหลืออยู่
      cy.get('[data-slate-editor="true"][contenteditable="true"]').first().within(() => {
        cy.get('[data-slate-node="element"]').should(($el) => {
          const text = $el.text().trim();
          expect(text).to.be.empty;
        });
      });

      // หรือตรวจสอบโดยตรงว่ามีเฉพาะ <br> tag
      cy.get('[data-slate-editor="true"][contenteditable="true"]').first()
        .find('[data-slate-node="element"]')
        .should('contain.html', '<br>');
    });

    it('ADMINICDJUNIOR-SN-21 - ไม่สามารถแก้ไข Template ได้ เนื่องจากไม่ได้กรอก Body', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);

      // เลือก Template ใดก็ได้
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // ตรวจสอบว่าอยู่ในแท็บ "แก้ไขเนื้อหา" (default)
      cy.get('.ant-radio-button-wrapper-checked').contains('แก้ไขเนื้อหา').should('exist');
      cy.wait(3000)

      // เคลียร์ Body
      cy.get('[data-slate-editor="true"][contenteditable="true"] > [data-slate-node="element"]').last().click().clear();

      // ตรวจสอบว่า Body ว่างเปล่า - อาจมี <p><br></p> tag เหลืออยู่
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last().within(() => {
        cy.get('p[data-slate-node="element"]').should(($el) => {
          const text = $el.text().trim();
          expect(text).to.be.empty;
        });
      });

      // หรือตรวจสอบโดยตรงว่ามีเฉพาะ <p><br></p> tag
      cy.get('[data-slate-editor="true"][contenteditable="true"]').last()
        .find('p[data-slate-node="element"]')
        .should('contain.html', '<br>');

      // คลิกปุ่มบันทึก
      cy.contains('บันทึก').click();

      // ตรวจสอบ validation message
      cy.get('.ant-modal-body > .gap-6').within(() => {
        cy.contains('บันทึกฉบับร่างของแบบประเมินประจำปีไม่สำเร็จ').should('be.visible').should('have.text', 'บันทึกฉบับร่างของแบบประเมินประจำปีไม่สำเร็จ');
        cy.contains('ปิด').click();
      });

    });
  });

})