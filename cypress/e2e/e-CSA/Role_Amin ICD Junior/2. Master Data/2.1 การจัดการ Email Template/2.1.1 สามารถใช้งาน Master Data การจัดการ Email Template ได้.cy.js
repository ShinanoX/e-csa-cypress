const { faker } = require("@faker-js/faker");

describe('Master Data', () => {
  beforeEach(() => {
    cy.loginApiRoleAdmin();
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

  describe('2.1.1 สามารถใช้งาน Master Data การจัดการ Email Template ได้', () => {
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
      cy.contains('แก้ไขข้อมูล').click();
      // ตรวจสอบว่าแสดง modal แก้ไขข้อมูล
      cy.get('.ant-modal').should('be.visible');
      cy.get('.ant-modal-title').should('contain', 'แก้ไขข้อมูล');
      // แก้ไขข้อมูลใน modal
      cy.get('.ant-modal').within(() => {
        cy.get('#name').clear().type('ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');
        cy.get('#stage_no').clear().type('2');
        cy.get('#stage_desc').clear().type('Update สร้างแบบประเมิน - Modified');
        // แก้ไข Remind 1
        cy.get('#remind1').clear().type(randomRemind1);
        // ตรวจสอบว่าข้อมูลถูกแก้ไขแล้ว
        cy.get('#name').should('have.value', 'ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated');
        cy.get('#stage_no').should('have.value', '2'); //เพราะว่าจะมี ทศนิยม 1 ตำแหน่ง
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
        cy.get('#stage_no').should('have.value', '2'); //เพราะว่าจะมี ทศนิยม 1 ตำแหน่ง
        cy.get('#stage_desc').should('have.value', 'Update สร้างแบบประเมิน - Modified');
        cy.get('#remind1').should('have.value', randomRemind1.toString());
        cy.get('#remind2').should('have.value', randomRemind2.toString());

        cy.contains('บันทึก').click();
      });

      cy.get('.flex-1 > .justify-center').should('be.visible').should('have.text', 'บันทึกการเปลี่ยนแปลงของ e-mail เรื่อง ระบบแจ้ง Admin ICD ให้สร้างแบบประเมิน - Updated สำเร็จ');

      cy.get('.ant-modal-body > .gap-12').within(() => {
        cy.contains('ปิด').click();
      })

      cy.wait(2000);
      cy.get('.gap-6 > :nth-child(1) > .text-gray-800').should('have.text', randomRemind1.toString());
      cy.get('.gap-6 > :nth-child(2) > .text-gray-800').should('have.text', randomRemind2.toString());
    });

    it('ADMINICDJUNIOR-SN-14 - แสดง Guide Text หัวข้อ Remind ที่ EML-04-001', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);
      cy.get('#code').type('EML-02-006');
      cy.contains('Search').click();
      cy.wait(1000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(1000);

      // เลื่อนเมาส์ไปที่เครื่องหมายตกใจข้างคำว่า Remind
      cy.wait(2000);
      cy.contains('Remind 1')
        .parent()
        .find('.material-symbols-outlined')
        .trigger('mouseover');

      // ตรวจสอบ Guide Text
      cy.wait(1000);
      cy.get('.ant-tooltip-open').should('be.visible');
      cy.get('.ant-tooltip-inner')
        .should('contain', 'จำนวนวันที่แจ้งเตือนผ่านทางอีเมลก่อนวันปิดแบบประเมินครั้งที่ 1');
    });

    it('ADMINICDJUNIOR-SN-15 - แสดง Guide Text หัวข้อ Remind ที่ EML-02-006', () => {
      cy.visit('https://dev-ecsa.looksocial.dev/master-data/email');
      cy.wait(2000);
      cy.get('#code').type('EML-02-006');
      cy.contains('Search').click();
      cy.wait(3000);
      cy.get('.ant-table-tbody tr').first().find('button').first().click();
      cy.wait(2000);

      // เลื่อนเมาส์ไปที่ Remind 1
      cy.contains('Remind 1')
        .parent()
        .find('.material-symbols-outlined')
        .trigger('mouseover');
      cy.wait(3000);
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
})