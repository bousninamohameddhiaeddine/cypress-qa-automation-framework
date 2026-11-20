import { HeaderLocators as L } from "./locators";

// Menu en haut de toutes les pages du site
class Header {
  shouldShowLogo() {
    cy.get(L.logo).should("be.visible");
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
}

export default new Header();
