// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-real-events/support';
import 'cypress-axe';
import '@4tw/cypress-drag-drop';

// จัดการ uncaught exceptions ทั้งโปรเจค
// Cypress.on('uncaught:exception', (err, runnable) => {
//     // ข้าม React errors และ chunk loading errors
//     if (err.message.includes('Minified React error') || 
//         err.message.includes('visit https://react.dev/errors') ||
//         err.message.includes('Loading chunk') ||
//         err.message.includes('Loading CSS chunk') ||
//         err.message.includes('ChunkLoadError')) {
//         return false; // ป้องกันไม่ให้ Cypress fail
//     }
    
//     // ให้ errors อื่นๆ ยังคง fail ตามปกติ
//     return true;
// });
