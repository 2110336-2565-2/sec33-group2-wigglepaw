// This is a sample test file to show how to write tests with Cypress
//
// Note that while this file demonstrates how to write tests,
// it does not imply a good structure, naming convention, organization, etc.
// (ie. It work, but I have no idea if this is a good tests)

describe("Frontpage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Find PetSitter button link to matching page", () => {
    cy.get("a[href='/matching']").click();
    cy.url().should("include", "/matching");
  });
});

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Login with valid credentials", () => {
    cy.get("input#username-input").type("uOwner134");
    cy.get("input#password-input").type("pOwner134");
    cy.get("button#login-button").click();
    cy.url().should("eq", `${Cypress.config().baseUrl!}/`);
  });

  it("Login with invalid credentials", () => {
    cy.get("input#username-input").type("uOwner134");
    cy.get("input#password-input").type("wrongpassword");
    cy.get("button#login-button").click();
    // expect an error alert
    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Login failed");
    });
    cy.url().should("include", "/login");
  });
});

export {};
