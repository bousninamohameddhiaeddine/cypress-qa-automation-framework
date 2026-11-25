import { ContactLocators as L } from "./locators";
import HomePage from "./HomePage";
import Header from "./Header";

// Page "Contact Us" : https://automationexercise.com/contact_us
class ContactPage {
  // Ouvre la page depuis l'accueil, au début du test (pas dans un beforeEach)
  open() {
    HomePage.visit();
    Header.goToContact();
    cy.get(L.title).should("be.visible");
  }

  // row = ligne du JSON (name, email, subject, message)
  fill(row) {
    cy.get(L.name).fill(row.name);
    cy.get(L.email).fill(row.email);
    cy.get(L.subject).fill(row.subject);
    cy.get(L.message).fill(row.message);
  }

  attach(filePath) {
    cy.get(L.uploadFile).selectFile(filePath);
  }

  // Le site affiche une boîte confirm() "Press OK to proceed!".
  // On remplace window.confirm sur la fenêtre affichée, juste avant le clic : le site reçoit
  // "OK" (true) sans boîte bloquante. (cy.on("window:confirm") ne suffisait pas : la vraie
  // boîte du navigateur apparaissait parfois et bloquait le test jusqu'à un clic manuel.)
  submit() {
    cy.window().then((win) => {
      cy.stub(win, "confirm").as("confirm").returns(true);
    });
    cy.get(L.submitButton).click();
  }

  // La boîte de confirmation a bien été demandée, avec le bon texte
  shouldHaveAskedConfirmation(text) {
    cy.get("@confirm").should("have.been.calledOnceWith", text);
  }

  shouldShowSuccess(message) {
    cy.get(L.successMessage).should("be.visible").and("contain.text", message);
  }

  shouldNotShowSuccess() {
    cy.shouldNotBeDisplayed(L.successMessage);
  }

  backToHome() {
    cy.get(L.homeButton).click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  }

  // Validation HTML5 : "field" = nom du localisateur (ex. "email")
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }
}

export default new ContactPage();
