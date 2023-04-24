import { firstNames, petTypes } from "./../../src/seed/pool";
import { z } from "zod";
import { Ownerfields } from "../pool/registerOwner";
import { makeOwner } from "../../src/seed/db";
// This is a sample test file to show how to write tests with Cypress
//
// Note that while this file demonstrates how to write tests,
// it does not imply a good structure, naming convention, organization, etc.
// (ie. It work, but I have no idea if this is a good tests)

/* const existingOwner = {
  code: "Owner123",
  firstName: "Adam",
  lastName: "Smith",
  phone: "0987654321",
  address: "Adam Street Smith District",
  imageUri: "",
  petTypes: ["Dog", "Cat"],
};

async function makeExistingOwner() {
  await makeOwner(
    "Owner123",
    "Adam",
    "Smith",
    "0987654321",
    "Adam Street Smith District",
    "",
    ["Dog", "Cat"]
  );
} */

function validInput(fields: {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  type: string;
}) {
  cy.get("#firstName").type(fields.firstname);
  cy.get("#lastName").type(fields.lastname);
  cy.get("#email").type(fields.email);
  cy.get("#address").type(fields.address);
  cy.get("#phone").type(fields.phone);
  cy.get("#username").type(fields.username);
  cy.get("#password").type(fields.password);
  cy.get("#confirmPassword").type(fields.password);
  cy.get("#type").type(fields.type);
  cy.contains("Next").click();
  cy.contains("2/2").should("exist");
  cy.get("#holderName").type(fields.firstname + " " + fields.lastname);
  cy.get("#cardNo").type("4242424242424242");
  cy.get("#expDate").type("2025-01-01");
  cy.get("#cvv").type("666");
  cy.get(".col-span-2.items-center > .mr-2").check();
  cy.get("#register-button").click();
}

describe("Can traverse to register owner page", () => {
  it("Click buttons to register owner page", () => {
    cy.visit("/");
    cy.contains("Register").click();
    cy.contains("Register Pet Owner").click();
    cy.url().should("include", "/registerPetOwner");
  });
});

describe("Fields validation", () => {
  beforeEach(() => {
    cy.visit("/registerPetOwner");
  });

  it("TC1-1", async () => {
    validInput(Ownerfields["TC1-1"]);
  });
});

export {};
