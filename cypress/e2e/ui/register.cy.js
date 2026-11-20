// =====================================================================
// Module : Inscription
// Story Jira : QAP-59 — Automatiser TC01, TC05 (inscription)
// Epic Jira  : QAP-2  — S1 Installation, premiers tests et projet Jira
// Données    : cypress/fixtures/register-data.json
// =====================================================================
import data from "../../fixtures/register-data.json";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import AccountStatusPage from "../../pages/AccountStatusPage";
import Header from "../../pages/Header";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let existingEmail;

describe("Inscription", () => {
  // Le hook ne fait que lire les identifiants : il ne peut pas échouer à cause du site
  beforeEach(() => {
    cy.env(["userEmail"], { log: false }).then((env) => {
      existingEmail = env.userEmail;
    });
  });

  // ---------------------------------------------------------------
  // QAP-9 · TC01 — Inscription d'un nouvel utilisateur puis suppression
  // Type : Positif · Priorité : Haute
  // Note : crée un compte unique puis le supprime (le compte partagé n'est pas touché)
  // ---------------------------------------------------------------
  it(`[${data.newUser.jira}] ${data.newUser.case}`, () => {
    const u = data.newUser;
    const email = `qa.test.${Date.now()}@example.com`; // courriel unique à chaque exécution

    LoginPage.open();
    LoginPage.signup(u.name, email);

    SignupPage.shouldBeVisible(u.name, email);
    SignupPage.fillAccountForm(u);
    SignupPage.createAccount();

    AccountStatusPage.shouldShowAccountCreated();
    cy.captureValidation(); // capture de validation : "Account Created!"
    AccountStatusPage.continue();
    Header.shouldBeLoggedInAs(u.name);

    Header.deleteAccount();
    AccountStatusPage.shouldShowAccountDeleted();
    AccountStatusPage.continue();
    Header.shouldShowSignupLoginLink();
  });

  // ---------------------------------------------------------------
  // QAP-13 · TC05 — Inscription avec un courriel déjà utilisé
  // Type : Négatif · Priorité : Haute
  // Piloté par les données : un test par ligne de register-data.json → "invalid".
  // Négatifs à ajouter dans le JSON (séance 3) :
  //   QAP-39 · TC01-N1 — Inscription avec nom vide
  //   QAP-40 · TC01-N2 — Inscription avec courriel mal formé
  //   QAP-41 · TC01-N3 — Création de compte sans mot de passe
  //   QAP-42 · TC01-N4 — Champs d'adresse obligatoires vides
  // ---------------------------------------------------------------
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'inscription - ${row.case}`, () => {
      // "env:userEmail" = utiliser le courriel du compte de test (déjà inscrit)
      const email = row.email === "env:userEmail" ? existingEmail : row.email;

      LoginPage.open();
      LoginPage.signup(row.name, email);
      LoginPage.shouldShowError(row.error);
      cy.url().should("include", "/signup");
    });
  });
});
