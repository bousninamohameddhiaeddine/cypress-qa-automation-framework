import { AccountStatusLocators as L } from "./locators";

// Pages de confirmation "Account Created!" et "Account Deleted!"
class AccountStatusPage {
  shouldShowAccountCreated() {
    cy.get(L.accountCreated).should("be.visible");
  }

  shouldShowAccountDeleted() {
    cy.get(L.accountDeleted).should("be.visible");
  }

  continue() {
    cy.get(L.continueButton).click();
  }
}

export default new AccountStatusPage();
