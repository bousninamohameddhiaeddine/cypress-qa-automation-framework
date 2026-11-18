// Commandes personnalisées du projet
// (les captures d'écran sont gérées automatiquement dans e2e.js)
import { screenshotName } from "./screenshot";

// cy.captureValidation() : prend la capture "PASSED" à un moment précis du test
// (au lieu de la fin). La capture automatique de fin de test est alors désactivée
// pour ce test, il n'y a donc qu'une seule capture.
Cypress.Commands.add("captureValidation", () => {
  Cypress.validationCaptured = true;
  cy.screenshot(screenshotName(Cypress.currentTest.title, "PASSED"), { capture: "viewport" });
});

// Ouvre la page "Signup / Login" depuis l'accueil.
// À appeler au début de chaque test (pas dans un beforeEach) : si le site ne charge pas,
// seul ce test échoue et les suivants s'exécutent quand même.
Cypress.Commands.add("openLoginPage", () => {
  cy.visit("/");
  cy.get('img[alt="Website for automation practice"]').should("be.visible");
  cy.contains("a", "Signup / Login").click();
  cy.contains("h2", "Login to your account").should("be.visible");
  cy.contains("h2", "New User Signup!").should("be.visible");
});
