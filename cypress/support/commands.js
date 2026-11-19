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
// (la navigation vers les pages est dans les Page Objects : cypress/pages/)
