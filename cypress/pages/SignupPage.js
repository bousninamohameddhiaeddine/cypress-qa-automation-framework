import { SignupLocators as L } from "./locators";

// Champs texte du formulaire. Les noms sont les mêmes dans le JSON (register-data.json)
// et dans locators.js, ce qui permet de les remplir en boucle.
const TEXT_FIELDS = [
  "password",
  "firstName",
  "lastName",
  "company",
  "address",
  "address2",
  "state",
  "city",
  "zipcode",
  "mobile",
];

// Page "Enter Account Information" : https://automationexercise.com/signup
// (2e étape de l'inscription, après LoginPage.signup())
class SignupPage {
  // Vérifie que la page est affichée et que le site a repris le nom et le courriel
  // saisis à l'étape précédente
  shouldBeVisible(name, email) {
    cy.get(L.title).should("be.visible");
    cy.get(L.name).should("have.value", name);
    cy.get(L.email).should("have.value", email);
  }

  // Remplit tout le formulaire.
  // "skip" = nom d'un champ à laisser vide (cas négatifs), ex. "firstName"
  fillAccountForm(u, skip = null) {
    cy.get(u.title === "Mr" ? L.titleMr : L.titleMrs).check();
    cy.get(L.days).select(u.day);
    cy.get(L.months).select(u.month);
    cy.get(L.years).select(u.year);
    cy.get(L.newsletter).check();
    cy.get(L.optin).check();
    cy.get(L.country).select(u.country);

    TEXT_FIELDS.forEach((field) => {
      const value = field === skip ? "" : u[field];
      cy.get(L[field]).fill(value, field === "password" ? { log: false } : {});
    });
  }

  // Validation HTML5 : "field" = nom du champ (ex. "firstName"), le même que dans le JSON
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }

  createAccount() {
    cy.get(L.createAccount).click();
  }
}

export default new SignupPage();
