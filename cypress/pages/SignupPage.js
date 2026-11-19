import { SignupLocators as L } from "./locators";

// Page "Enter Account Information" : https://automationexercise.com/signup
// (2e étape de l'inscription, après LoginPage.signup())
class SignupPage {
  shouldBeVisible(name, email) {
    cy.get(L.title).should("be.visible");
    cy.get(L.name).should("have.value", name);
    cy.get(L.email).should("have.value", email);
  }

  fillAccountInformation(u) {
    cy.get(u.title === "Mr" ? L.titleMr : L.titleMrs).check();
    cy.get(L.password).type(u.password, { log: false });
    cy.get(L.days).select(u.day);
    cy.get(L.months).select(u.month);
    cy.get(L.years).select(u.year);
    cy.get(L.newsletter).check();
    cy.get(L.optin).check();
  }

  fillAddress(u) {
    cy.get(L.firstName).type(u.firstName);
    cy.get(L.lastName).type(u.lastName);
    cy.get(L.company).type(u.company);
    cy.get(L.address).type(u.address);
    cy.get(L.address2).type(u.address2);
    cy.get(L.country).select(u.country);
    cy.get(L.state).type(u.state);
    cy.get(L.city).type(u.city);
    cy.get(L.zipcode).type(u.zipcode);
    cy.get(L.mobile).type(u.mobile);
  }

  createAccount() {
    cy.get(L.createAccount).click();
  }
}

export default new SignupPage();
