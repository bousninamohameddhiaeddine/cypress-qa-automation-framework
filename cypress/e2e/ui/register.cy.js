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

describe("Inscription", { tags: "@regression" }, () => {
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
  it(`[${data.newUser.jira}] ${data.newUser.case}`, { tags: "@smoke" }, () => {
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
  // Cas négatifs de l'étape "New User Signup!" — register-data.json → "invalid"
  //   QAP-13 · TC05    — Inscription avec un courriel déjà utilisé    · Négatif · Haute
  //   QAP-39 · TC01-N1 — Inscription avec nom vide                    · Négatif · Moyenne
  //   QAP-40 · TC01-N2 — Inscription avec courriel mal formé (x2)     · Négatif · Moyenne
  //
  // "error" → message du serveur · "validation" → champ bloqué par le navigateur (HTML5)
  //
  // "paste": true → le courriel est collé au lieu d'être tapé.
  // Note QA (QAP-40) : en tapant "123 @test.com" touche par touche, l'espace est un instant
  // en fin de texte et le navigateur le supprime (règle HTML des <input type="email">) :
  // le site recevrait "123@test.com". À la main, l'espace est conservé : on colle donc la valeur.
  // ---------------------------------------------------------------
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'inscription - ${row.case}`, () => {
      // "env:userEmail" = courriel du compte de test (déjà inscrit)
      // "unique"        = courriel jamais utilisé, généré à chaque exécution
      let email = row.email;
      if (row.email === "env:userEmail") email = existingEmail;
      if (row.email === "unique") email = `qa.test.${Date.now()}@example.com`;

      LoginPage.open();
      LoginPage.signup(row.name, email, { paste: row.paste });

      if (row.error) {
        LoginPage.shouldShowError(row.error);
        cy.url().should("include", "/signup");
      }
      if (row.validation) {
        LoginPage.shouldHaveInvalidField(row.validation);
        cy.url().should("include", "/login"); // le navigateur a bloqué l'envoi
      }
    });
  });

  // ---------------------------------------------------------------
  // Cas négatifs du formulaire "Enter Account Information"
  // — register-data.json → "invalidAccountForm"
  //   QAP-41 · TC01-N3 — Création de compte sans mot de passe         · Négatif · Moyenne
  //   QAP-42 · TC01-N4 — Champs d'adresse obligatoires vides (x6)     · Négatif · Moyenne
  //
  // "skip" = champ laissé vide. Le navigateur doit bloquer la création du compte.
  // Si le compte est quand même créé → probable vrai bug du site : ouvrir un Bug dans Jira.
  // ---------------------------------------------------------------
  data.invalidAccountForm.forEach((row) => {
    it(`[${row.jira}] Refuse la création du compte - ${row.case}`, () => {
      const u = data.newUser;
      const email = `qa.test.${Date.now()}@example.com`;

      LoginPage.open();
      LoginPage.signup(u.name, email);
      SignupPage.shouldBeVisible(u.name, email);
      SignupPage.fillAccountForm(u, row.skip);
      SignupPage.createAccount();

      SignupPage.shouldHaveInvalidField(row.skip);
      AccountStatusPage.shouldNotShowAccountCreated();
    });
  });
});
