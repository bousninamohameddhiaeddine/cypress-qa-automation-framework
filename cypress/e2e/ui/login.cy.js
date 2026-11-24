// =====================================================================
// Module : Connexion
// Story Jira : QAP-58 — Automatiser TC02, TC03, TC04 (connexion)
// Epic Jira  : QAP-2  — S1 Installation, premiers tests et projet Jira
// Données    : cypress/fixtures/login-data.json
// =====================================================================
import data from "../../fixtures/login-data.json";
import LoginPage from "../../pages/LoginPage";
import Header from "../../pages/Header";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let user;

describe("Connexion", () => {
  // Le hook ne fait que lire les identifiants : il ne peut pas échouer à cause du site
  beforeEach(() => {
    cy.env(["userEmail", "userPassword", "userName"], { log: false }).then((env) => {
      user = { email: env.userEmail, password: env.userPassword, name: env.userName };
    });
  });

  // ---------------------------------------------------------------
  // QAP-10 · TC02 — Connexion avec identifiants valides
  // Type : Positif · Priorité : Haute
  // Note : le compte partagé n'est PAS supprimé (la suppression est testée dans TC01 / QAP-9)
  // ---------------------------------------------------------------
  it("[QAP-10] Connexion avec identifiants valides", () => {
    LoginPage.open();
    LoginPage.login(user.email, user.password);
    Header.shouldBeLoggedInAs(user.name);
  });

  // ---------------------------------------------------------------
  // Cas négatifs de connexion — pilotés par login-data.json → "invalid"
  // (un test par ligne du JSON)
  //   QAP-11 · TC03    — Connexion avec identifiants incorrects   · Négatif · Haute
  //   QAP-35 · TC02-N1 — Bon courriel, mauvais mot de passe       · Négatif · Haute
  //   QAP-36 · TC02-N2 — Connexion avec courriel vide             · Négatif · Moyenne
  //   QAP-37 · TC02-N3 — Connexion avec mot de passe vide         · Négatif · Moyenne
  //   QAP-38 · TC02-N4 — Connexion avec courriel mal formé (x2)   · Négatif · Moyenne
  //
  // Deux sortes d'erreurs dans le JSON :
  //   "error"      → message du serveur affiché dans la page
  //   "validation" → champ bloqué par le navigateur (HTML5), nom du localisateur
  // ---------------------------------------------------------------
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse la connexion - ${row.case}`, () => {
      // "env:userEmail" = utiliser le courriel du compte de test (jamais écrit dans le JSON)
      const email = row.email === "env:userEmail" ? user.email : row.email;

      LoginPage.open();
      LoginPage.login(email, row.password);

      if (row.error) LoginPage.shouldShowError(row.error);
      if (row.validation) LoginPage.shouldHaveInvalidField(row.validation);
      LoginPage.shouldBeLoggedOut();
    });
  });

  // ---------------------------------------------------------------
  // QAP-12 · TC04 — Déconnexion
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  it("[QAP-12] Déconnexion", () => {
    LoginPage.open();
    LoginPage.login(user.email, user.password);
    Header.shouldBeLoggedInAs(user.name);
    Header.logout();
    LoginPage.shouldBeLoggedOut();
    LoginPage.shouldBeVisible();
  });
});
