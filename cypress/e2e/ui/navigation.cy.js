// =====================================================================
// Module : Navigation
// Story Jira : QAP-65 — Automatiser contact, produits, recherche, abonnement et avis
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// =====================================================================
import HomePage from "../../pages/HomePage";
import Header from "../../pages/Header";
import TestCasesPage from "../../pages/TestCasesPage";

describe("Navigation", () => {
  // ---------------------------------------------------------------
  // QAP-15 · TC07 — Accès à la page « Test Cases »
  // Type : Positif · Priorité : Basse
  // ---------------------------------------------------------------
  it("[QAP-15] Accès à la page Test Cases", () => {
    HomePage.visit();
    Header.goToTestCases();
    TestCasesPage.shouldBeVisible();
  });

  // ---------------------------------------------------------------
  // QAP-33 · TC25 — Défilement vers le haut avec le bouton flèche
  // Type : Positif · Priorité : Basse
  // ---------------------------------------------------------------
  it("[QAP-33] Défilement vers le haut avec le bouton flèche", () => {
    HomePage.visit();
    HomePage.scrollToFooter();
    HomePage.scrollUpWithArrow();
    HomePage.shouldBeAtTop();
  });

  // ---------------------------------------------------------------
  // QAP-34 · TC26 — Défilement vers le haut sans le bouton flèche
  // Type : Positif · Priorité : Basse
  // ---------------------------------------------------------------
  it("[QAP-34] Défilement vers le haut sans le bouton flèche", () => {
    HomePage.visit();
    HomePage.scrollToFooter();
    HomePage.scrollUpWithoutArrow();
    HomePage.shouldBeAtTop();
  });
});
