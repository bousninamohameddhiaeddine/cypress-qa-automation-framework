// =====================================================================
// Module : Configuration
// Story Jira : QAP-56 — Écrire le test de vérification de la configuration
// Epic Jira  : QAP-2  — S1 Installation, premiers tests et projet Jira
// Vérifie que Cypress, le baseUrl et le blocage des pubs fonctionnent.
// =====================================================================

describe("Vérification de la configuration", () => {
  // ---------------------------------------------------------------
  // QAP-56 — La page d'accueil se charge correctement
  // ---------------------------------------------------------------
  it("[QAP-56] La page d'accueil se charge correctement", () => {
    cy.visit("/");

    cy.title().should("contain", "Automation Exercise");
    cy.get('img[alt="Website for automation practice"]').should("be.visible");
    cy.get(".shop-menu").within(() => {
      cy.contains("a", "Home").should("be.visible");
      cy.contains("a", "Products").should("be.visible");
      cy.contains("a", "Signup / Login").should("be.visible");
    });
  });
});
