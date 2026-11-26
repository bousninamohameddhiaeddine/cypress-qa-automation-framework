import { HeaderLocators as L } from "./locators";

// Menu en haut de toutes les pages du site
class Header {
  // Attente plus longue que le défaut (8 s) : le site est derrière Cloudflare, qui ralentit
  // ou recharge parfois la page pour un navigateur automatisé (requêtes /cdn-cgi/rum).
  // Sans ce délai, le test échoue au hasard (test "flaky").
  shouldShowLogo() {
    cy.get(L.logo, { timeout: 30000 }).should("be.visible");
  }

  goToSignupLogin() {
    cy.get(L.signupLoginLink).click();
  }

  shouldShowSignupLoginLink() {
    cy.get(L.signupLoginLink).should("be.visible");
  }

  shouldBeLoggedInAs(name) {
    cy.get(L.loggedInAs).should("be.visible").and("contain.text", `Logged in as ${name}`);
  }

  shouldBeLoggedOut() {
    cy.get(L.loggedInAs).should("not.exist");
  }

  logout() {
    cy.get(L.logoutLink).click();
  }

  deleteAccount() {
    cy.get(L.deleteAccountLink).click();
  }

  goToProducts() {
    cy.get(L.productsLink).click();
  }

  goToCart() {
    cy.get(L.cartLink).click();
  }

  goToTestCases() {
    cy.get(L.testCasesLink).click();
  }

  goToContact() {
    cy.get(L.contactLink).click();
  }
}

export default new Header();
