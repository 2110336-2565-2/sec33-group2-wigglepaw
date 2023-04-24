// This is a sample test file to show how to write tests with Cypress
//
// Note that while this file demonstrates how to write tests,
// it does not imply a good structure, naming convention, organization, etc.
// (ie. It work, but I have no idea if this is a good tests)

// import { makeOwner } from '../../src/seed/db';

// const existingOwner = {
//   code: 'Owner123',
//   firstName: 'Adam',
//   lastName: 'Smith',
//   phone: '0987654321',
//   address: 'Adam Street Smith District',
//   imageUri: '',
//   petTypes: ['Dog', 'Cat'],
// };

// async function makeExistingOwner() {
//   await makeOwner(
//     'Owner123',
//     'Adam',
//     'Smith',
//     '0987654321',
//     'Adam Street Smith District',
//     '',
//     ['Dog', 'Cat']
//   );
//   return;headlessui-me'
// }

// await makeExistingOwner();

// describe("Can traverse to register owner page", () => {
//   it("Click buttons to register owner page", () => {
//     cy.visit("/");
//     cy.contains("Register").click();
//     cy.contains("Register Pet Owner").click();
//     cy.url().should("include", "/registerPetOwner");
//   });
// });

describe("Fields validation", () => {
  beforeEach(() => {
    cy.visit("/registerPetOwner");
  });

  it("TC1-1", () => {
    cy.get("#firstName").type("Bobby");
    cy.get("#lastName").type("Testing");
    cy.get("#email").type("bobby123@hotmail.com");
    cy.get("#address").type("Bangkok");
    cy.get("#phone").type("0818118111");
    cy.get("#username").type("bobby123");
    cy.get("#password").type("Bobby123_");
    cy.get("#confirmPassword").type("Bobby123_");
    cy.get("#type").type("Dog Cat ");
    cy.contains("Next").click();
    cy.contains("2/2").should("exist");
    cy.get("#holderName").type("Bobby Testing");
    cy.get("#cardNo").type("4242424242424242");
    cy.get("#expDate").type("2025-01-01");
    cy.get("#cvv").type("666");
    cy.get(".col-span-2.items-center > .mr-2").check();
    cy.get("#register-button").click();
  });
});

export {};
