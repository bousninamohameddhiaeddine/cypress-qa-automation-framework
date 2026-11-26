import { TestCasesLocators as L } from "./locators";

// Page "Test Cases" : https://automationexercise.com/test_cases
class TestCasesPage {
  shouldBeVisible() {
    cy.url().should("include", "/test_cases");
    cy.get(L.title).should("be.visible");
  }
}

export default new TestCasesPage();
