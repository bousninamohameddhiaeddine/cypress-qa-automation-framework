import { HomeLocators as L } from "./locators";
import Header from "./Header";
import Footer from "./Footer";

// Page d'accueil : https://automationexercise.com/
class HomePage {
  visit() {
    cy.visit("/");
    Header.shouldShowLogo();
  }

  // Descend en bas de la page et vérifie que le pied de page est visible
  scrollToFooter() {
    cy.scrollTo("bottom");
    Footer.shouldShowSubscription();
  }

  // QAP-33 : remonte avec le bouton flèche
  scrollUpWithArrow() {
    cy.get(L.scrollUpButton).should("be.visible").click();
  }

  // QAP-34 : remonte sans le bouton flèche
  scrollUpWithoutArrow() {
    cy.scrollTo("top");
  }

  shouldBeAtTop() {
    cy.get(L.heroTitle).should("be.visible");
    cy.window().its("scrollY").should("be.lessThan", 100);
  }
}

export default new HomePage();
