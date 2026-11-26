// =====================================================================
// Module : Contact
// Story Jira : QAP-65 — Automatiser contact, produits, recherche, abonnement et avis
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : cypress/fixtures/contact-data.json
// =====================================================================
import data from "../../fixtures/contact-data.json";
import ContactPage from "../../pages/ContactPage";

describe("Contact", { tags: "@regression" }, () => {
  // ---------------------------------------------------------------
  // QAP-14 · TC06 — Envoi du formulaire de contact avec fichier joint
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  data.valid.forEach((row) => {
    it(`[${row.jira}] ${row.case}`, () => {
      ContactPage.open();
      ContactPage.fill(row);
      ContactPage.attach(row.file);
      ContactPage.submit();
      ContactPage.shouldHaveAskedConfirmation(row.confirm);
      ContactPage.shouldShowSuccess(row.success);
      cy.captureValidation(); // capture : message "Success!"
      ContactPage.backToHome();
    });
  });

  // ---------------------------------------------------------------
  // Cas négatifs — contact-data.json → "invalid"
  //   QAP-43 · TC06-N1 — Formulaire de contact avec un courriel au format invalide · Moyenne
  //   QAP-44 · TC06-N2 — Formulaire de contact envoyé sans courriel                · Moyenne
  // "validation" = champ bloqué par le navigateur (HTML5)
  // ---------------------------------------------------------------
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'envoi du formulaire - ${row.case}`, () => {
      ContactPage.open();
      ContactPage.fill(row);
      ContactPage.submit();
      ContactPage.shouldHaveInvalidField(row.validation);
      ContactPage.shouldNotShowSuccess();
    });
  });
});
