// =====================================================================
// Module : Abonnement à l'infolettre
// Story Jira : QAP-65 — Automatiser contact, produits, recherche, abonnement et avis
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : cypress/fixtures/subscription-data.json
// =====================================================================
import data from "../../fixtures/subscription-data.json";
import HomePage from "../../pages/HomePage";
import Header from "../../pages/Header";
import Footer from "../../pages/Footer";

// Ouvre la page demandée par la ligne du JSON ("home" ou "cart")
const openPage = (page) => {
  HomePage.visit();
  if (page === "cart") {
    Header.goToCart();
    cy.url().should("include", "/view_cart");
  }
};

describe("Abonnement", () => {
  // ---------------------------------------------------------------
  //   QAP-18 · TC10 — Abonnement à l'infolettre depuis la page d'accueil · Positif · Moyenne
  //   QAP-19 · TC11 — Abonnement à l'infolettre depuis la page Panier    · Positif · Basse
  // subscription-data.json → "valid"
  // ---------------------------------------------------------------
  data.valid.forEach((row) => {
    it(`[${row.jira}] ${row.case}`, () => {
      openPage(row.page);
      Footer.shouldShowSubscription();
      Footer.subscribe(row.email);
      Footer.shouldShowSuccess(row.success);
    });
  });

  // ---------------------------------------------------------------
  // Cas négatifs — subscription-data.json → "invalid"
  //   QAP-47 · TC10-N1 — Abonnement avec un courriel invalide ou vide (x2) · Négatif · Basse
  // ---------------------------------------------------------------
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'abonnement - ${row.case}`, () => {
      openPage("home");
      Footer.subscribe(row.email);
      Footer.shouldHaveInvalidField(row.validation);
      Footer.shouldNotShowSuccess();
    });
  });
});
