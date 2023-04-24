// This is a sample test file to show how to write tests with Cypress
//
// Note that while this file demonstrates how to write tests,
// it does not imply a good structure, naming convention, organization, etc.
// (ie. It work, but I have no idea if this is a good tests)

// import { makeOwner } from "../../src/seed/db";

// const existingOwner = {
//   code: "Owner123",
//   firstName: "Adam",
//   lastName: "Smith",
//   phone: "0987654321",
//   address: "Adam Street Smith District",
//   imageUri: "",
//   petTypes: ["Dog", "Cat"],
// };

// async function makeExistingOwner() {
//   await makeOwner(
//     "Owner123",
//     "Adam",
//     "Smith",
//     "0987654321",
//     "Adam Street Smith District",
//     "",
//     ["Dog", "Cat"]
//   );
//   return;
// }

// await makeExistingOwner();

describe("Can traverse to register owner page", () => {
  it("Click buttons to register owner page", () => {
    cy.visit("/");
    cy.contains("Register").click();
    cy.contains("Register Pet Owner").click();
    cy.url().should("include", "/registerPetOwner");
  });
});

export {};
