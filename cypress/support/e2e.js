// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { screenshotName } from "./screenshot";
Cypress.on("uncaught:exception", () => false);

// Une capture par test, avec date et heure dans le nom (historique conservé) :
// - SUCCÈS : la page à la fin du test (viewport),
//            SAUF si le test a déjà pris sa capture avec cy.captureValidation()
// - ÉCHEC  : tout l'écran Cypress avec le message d'erreur (runner)
//     · cypress run  → capture automatique de Cypress (screenshotOnRunFailure)
//     · cypress open → screenshotOnRunFailure ne fonctionne pas, on la prend ici
beforeEach(() => {
  Cypress.validationCaptured = false;
});

afterEach(function () {
  const { title, state, err } = this.currentTest;
  const failed = state === "failed";

  // En cas d'échec : le message d'erreur exact dans un fichier .txt à côté des captures
  // (la capture ne montre pas toujours la ligne en erreur du journal Cypress)
  if (failed && err) {
    const file = `${Cypress.config("screenshotsFolder")}/${screenshotName(title, "FAILED")}.txt`;
    cy.writeFile(file, `${title}\n\n${err.message}\n`, { log: false });
  }

  if (failed && !Cypress.config("isInteractive")) return; // déjà prise par Cypress
  if (!failed && state !== "passed") return;
  if (!failed && Cypress.validationCaptured) return; // déjà prise dans le test

  cy.screenshot(screenshotName(title, failed ? "FAILED" : "PASSED"), {
    capture: failed ? "runner" : "viewport",
  });
});