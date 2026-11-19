import Header from "./Header";

// Page d'accueil : https://automationexercise.com/
class HomePage {
  visit() {
    cy.visit("/");
    Header.shouldShowLogo();
  }
}

export default new HomePage();
