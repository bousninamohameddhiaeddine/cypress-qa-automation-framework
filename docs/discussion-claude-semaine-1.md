# Discussion avec Claude — Projet Cypress QA Automation (semaine 1)

> Historique de la session de travail avec Claude Code (VS Code), du 15 au 17 novembre 2026.
> Les identifiants réels (courriel, mot de passe) ont été retirés de ce document.

---

## 1. Accès à Copilot

**Moi :** Est-ce que tu as accès à Copilot, la liste de recherche ?

**Claude :** Non. Claude Code et GitHub Copilot sont deux extensions séparées dans VS Code ; je ne vois ni l'historique, ni les suggestions de Copilot. Je vois les fichiers du projet, le texte sélectionné dans l'éditeur, le terminal et le web. Pour me montrer quelque chose de Copilot, il faut le copier-coller ici.

---

## 2. Lien vers une conversation claude.ai

**Moi :** *(lien `claude.ai/chat/...`)*

**Claude :** Je ne peux pas ouvrir les conversations claude.ai : elles sont privées et liées au compte. Je peux lire uniquement les liens d'artifacts (`claude.ai/artifact/...`). Solution : copier-coller le contenu important ici.

---

## 3. Le plan du projet et le projet Jira

**Moi :** *(envoi de deux PDF : `plan-projet-cypress.md.pdf` et `projet-jira-explication.pdf`)* — Voilà, qu'est-ce que je vais faire ?

**Claude :** Vérification du dépôt : il correspond au document Jira. QAP-51 à QAP-55 sont terminées (Cypress 16.2.1 installé, `cypress.config.js` rempli, `e2e.js` avec `uncaught:exception`, `.gitignore` qui protège les secrets). Aucun fichier de test encore.

Étapes pour finir la semaine 1 :

1. **QAP-56** : test de vérification `cypress/e2e/verification.cy.js`, le voir passer, commit `QAP-56: ...`, push, passer en « Terminé ».
2. **QAP-57** : créer le compte de test, `cypress.env.json` (privé) et `cypress.env.example.json` (publié, fausses valeurs).
3. **QAP-58** : connexion — TC02 `[QAP-10]`, TC03 `[QAP-11]`, TC04 `[QAP-12]`.
4. **QAP-59** : inscription — TC01 `[QAP-9]`, TC05 `[QAP-13]`.
5. **QAP-60** : post LinkedIn.

En parallèle dans Jira : créer le Sprint 1 avec QAP-56 à QAP-60.

---

## 4. QAP-56 — Test de vérification

**Moi :** Est-ce que tu peux faire le test de vérification ?

**Claude :** Fichier créé : `cypress/e2e/verification.cy.js`

```js
describe("Vérification de la configuration", () => {
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
```

Cypress plante dans le terminal de Claude (« Illegal instruction »), donc le test doit être lancé dans le terminal VS Code :

```bash
npx cypress run --browser chrome --spec cypress/e2e/verification.cy.js
```

**Moi :** All specs passed!

**Claude :**
- Commit `ee4c0fe QAP-56: add setup verification test` poussé sur `main`.
- Jira : QAP-56 passée à « Terminé(e) », avec un commentaire (résultat + commit).

Prochaine étape : QAP-57, créer le compte de test sur automationexercise.com (ne jamais envoyer le mot de passe dans le chat).

---

## 5. QAP-58 — Tests de connexion (TC02, TC03, TC04)

**Moi :** Maintenant je veux automatiser les cas de test TC2, 3, 4.

**Claude :** Fichiers créés :

| Fichier | Rôle | Sur GitHub ? |
|---|---|---|
| `cypress/e2e/ui/login.cy.js` | Les 3 tests | Oui |
| `cypress/fixtures/login-data.json` | Données de TC03 (cas invalides) | Oui |
| `cypress.env.example.json` | Modèle avec fausses valeurs | Oui |
| `cypress.env.json` | Vrais identifiants | **Non** (ignoré par git) |

- `[QAP-10]` TC02 : connexion valide → « Logged in as … » (le compte partagé n'est pas supprimé).
- `[QAP-11]` TC03 : data-driven depuis le JSON → « Your email or password is incorrect! ».
- `[QAP-12]` TC04 : connexion → Logout → retour à la page de connexion.

`login-data.json` :

```json
{
  "invalid": [
    {
      "jira": "QAP-11",
      "case": "Identifiants incorrects",
      "email": "inconnu.qa@test.com",
      "password": "Faux1234!",
      "error": "Your email or password is incorrect!"
    }
  ]
}
```

---

## 6. Structure du projet proposée ailleurs

**Moi :** *(structure collée avec `.github/copilot-instructions.md`, `register.cy.js`, `fixtures/user.json`)*

**Claude :** Cette structure ne correspond pas au disque : ces 3 fichiers n'existent pas. Conseils :
- `register.cy.js` → c'est QAP-59, la prochaine étape.
- `user.json` → à éviter : un fichier dans `fixtures/` part sur GitHub avec le mot de passe. Les identifiants vont dans `cypress.env.json`.
- `copilot-instructions.md` → sert seulement à Copilot, pas nécessaire au projet.

---

## 7. Erreur Cypress 16 : `Cypress.env()` supprimé

**Moi :** *(capture : « `Cypress.env()` was removed in Cypress version 16.0.0. Please update to use `Cypress.expose()` for non-sensitive values, or `cy.env()` for sensitive values. »)*

**Claude :** Cypress 16 a supprimé `Cypress.env()`. Les identifiants sont maintenant lus avec `cy.env()` (commande asynchrone) :

```js
let user;

beforeEach(() => {
  cy.env(["userEmail", "userPassword", "userName"], { log: false }).then((env) => {
    user = { email: env.userEmail, password: env.userPassword, name: env.userName };
  });
});
```

`{ log: false }` évite d'afficher le mot de passe dans les logs.

⚠️ **Sécurité :** les vrais identifiants avaient été mis dans `cypress.env.example.json`, qui est publié sur GitHub. Correction : les vraies valeurs vont dans `cypress.env.json`, et l'exemple garde des fausses valeurs. Conseil : utiliser un mot de passe unique pour le compte de test.

---

## 8. Captures d'écran pour la documentation

### 8.1 Première demande

**Moi :** Je veux prendre des captures pour l'échec ou le succès, pour la documentation.

**Claude :** `cypress.env.example.json` remis avec de fausses valeurs. Ajout d'une capture à la fin de chaque test réussi (`afterEach`) ; en cas d'échec, Cypress prend la capture automatiquement. Les captures n'existent qu'avec `cypress run`. Le dossier `cypress/screenshots/` est ignoré par git : copier les meilleures dans `docs/screenshots/` pour la documentation.

### 8.2 Captures pendant l'exécution

**Moi :** Je veux que le test prenne les captures en cours d'exécution.

**Claude :** Ajout d'une commande `cy.capture("etape")` numérotée (01, 02, 03…) à chaque étape clé, rangée dans un dossier par test. Attention : la capture du formulaire rempli montre le courriel en clair.

### 8.3 Une seule capture par test

**Moi :** Il y a beaucoup de captures. Je veux à chaque test une seule, pour la validation, pas une dizaine.

**Claude :** Une seule capture à la fin de chaque test, au moment de la validation. Remarque : avec `retries: { runMode: 2 }`, un test qui échoue peut produire jusqu'à 3 captures `(failed)`.

### 8.4 Capture même en cas d'échec

**Moi :** Je veux qu'il prenne la capture même si le test échoue, pour voir d'où vient l'erreur.

**Claude :** Capture automatique dans un `afterEach` :
- PASSED → la page à la fin du test (`viewport`) ;
- FAILED → tout l'écran Cypress avec le message d'erreur (`runner`).

---

## 9. Pourquoi les autres tests ne s'exécutent pas après un échec ?

**Moi :** Pourquoi, quand un test échoue dans une suite, Cypress ne continue pas les autres ? (test 1 passe, 2 échoue, 3 ne s'exécute pas)

**Claude :** Vérification des captures : la dernière exécution enregistrée avait les 3 tests en réussite. Pour diagnostiquer, il faut la sortie du terminal de l'exécution en échec.

**Moi :** *(capture : « Because this error occurred during a `before each` hook we are skipping the remaining tests in the current suite: Connexion »)*

**Claude :** L'échec venait du **`beforeEach`** (logo de la page d'accueil introuvable). Quand un **hook** échoue, Cypress saute volontairement tous les tests restants du `describe`. Correction proposée : la navigation sort du `beforeEach` et va au début de chaque test. Le hook ne fait plus que lire les identifiants.

**Moi :** Ne change rien, c'est moi qui ai provoqué l'erreur pour tester. Sinon, est-ce qu'on peut configurer Cypress pour qu'il fasse les autres tests même si les hooks échouent ?

**Claude :** Non, il n'existe aucune option : c'est le comportement de Mocha (le moteur de Cypress). Solutions possibles :

| Solution | Effet |
|---|---|
| **Retries** (`runMode: 2`) | Un `beforeEach` en échec est relancé avec le test. En `cypress open`, `openMode: 0`, donc pas de relance. |
| **Navigation dans le test** | Un échec ne touche que ce test. |
| **Un `describe` par test** | Un hook en échec ne saute que son propre `describe`. |

**Règle à retenir :** dans un hook, ne mettre que ce qui ne peut pas échouer (lire des données). Tout ce qui touche le site va dans le test.

---

## 10. Historique des captures

**Moi :** Pourquoi il ne prend pas de nouvelles captures dans les nouvelles exécutions ?

**Claude :** Les captures étaient bien prises (dates des fichiers vérifiées), mais avec le même nom elles **remplaçaient** les anciennes (`overwrite: true`). De plus, en `cypress open`, la capture d'échec automatique ne fonctionne pas.

**Moi :** Je ne veux pas qu'il remplace, je veux garder l'historique.

**Claude :**
- Date et heure locales dans le nom : `[QAP-10] Connexion avec identifiants valides - PASSED - 2026-11-17_10-50-41.png`.
- `trashAssetsBeforeRuns: false` dans `cypress.config.js` : le dossier n'est plus vidé avant chaque `cypress run`.

**Moi :** Nouvelle erreur : il ne prend pas de captures en cas d'échec.

**Claude :** En `cypress open`, `screenshotOnRunFailure` ne fonctionne pas. Le `afterEach` prend maintenant lui-même la capture FAILED en mode interactif :

| Mode | Test réussi | Test échoué |
|---|---|---|
| `cypress open` | `... - PASSED - date.png` | `... - FAILED - date.png` (notre code) |
| `cypress run` | `... - PASSED - date.png` | `... (failed).png` (Cypress) |

---

## 11. QAP-59 — Tests d'inscription (TC01, TC05)

**Moi :** Maintenant je veux faire les tests TC1 et TC5.

**Claude :** Fichiers créés :
- `cypress/e2e/ui/register.cy.js` — les 2 tests ;
- `cypress/fixtures/register-data.json` — données du formulaire + cas invalide.

**`[QAP-9]` TC01 — inscription puis suppression**
- Courriel unique à chaque exécution : `qa.test.<horodatage>@example.com`.
- Remplit tout le formulaire, vérifie « Account Created! » puis « Logged in as QA Test ».
- Supprime le compte, vérifie « Account Deleted! ». Le compte partagé n'est jamais touché.

**`[QAP-13]` TC05 — courriel déjà utilisé**
- S'inscrit avec le courriel du compte de test (lu dans `cypress.env.json`) → « Email Address already exist! ».
- Data-driven : les cas TC01-N1, N2… s'ajouteront dans le tableau `invalid` en semaine 2.

Nettoyage : nouvelle commande partagée `cy.openLoginPage()` dans `commands.js`, utilisée par les deux fichiers de tests, au début de chaque test.

---

## 12. Capture de validation au bon moment (QAP-9)

**Moi :** Pour le test QAP-9, il prend la capture au mauvais moment. Il faut la prendre au moment de « Account Created ».

**Claude :** Nouvelle commande `cy.captureValidation()` :

```js
cy.get('[data-qa="account-created"]').should("be.visible");
cy.captureValidation(); // capture de validation : "Account Created!"
```

- Elle prend la capture PASSED à cet endroit précis.
- La capture automatique de fin de test est désactivée pour ce test : il n'y en a qu'une.
- Les autres tests gardent leur capture de fin.
- Le nom des captures est construit dans `cypress/support/screenshot.js`, partagé par `e2e.js` et `commands.js`.

---

## État actuel du projet

```
cypress-qa-automation-framework/
├── cypress/
│   ├── e2e/
│   │   ├── ui/
│   │   │   ├── login.cy.js        # TC02, TC03, TC04 (QAP-58)
│   │   │   └── register.cy.js     # TC01, TC05 (QAP-59)
│   │   └── verification.cy.js     # QAP-56 ✅ (commité)
│   ├── fixtures/
│   │   ├── login-data.json
│   │   └── register-data.json
│   └── support/
│       ├── commands.js            # cy.openLoginPage(), cy.captureValidation()
│       ├── e2e.js                 # captures automatiques PASSED / FAILED
│       └── screenshot.js          # nom des captures avec date
├── docs/
│   └── discussion-claude-semaine-1.md
├── cypress.config.js
├── cypress.env.json               # privé, jamais sur GitHub
├── cypress.env.example.json       # fausses valeurs
└── package.json
```

### Statut Jira

| Story | Statut |
|---|---|
| QAP-56 Test de vérification | ✅ Terminé (commit `ee4c0fe`) |
| QAP-57 Compte de test et `cypress.env.json` | Fait localement, à passer en Terminé |
| QAP-58 Connexion TC02, TC03, TC04 | Écrit, à valider puis commiter |
| QAP-59 Inscription TC01, TC05 | Écrit, à valider puis commiter |
| QAP-60 Post LinkedIn | À faire |

### Commandes utiles

```bash
# Tous les tests UI
npx cypress run --browser chrome --spec "cypress/e2e/ui/*.cy.js"

# Un seul fichier
npx cypress run --browser chrome --spec cypress/e2e/ui/login.cy.js

# Mode interactif
npx cypress open
```

### Leçons retenues

- **Cypress 16** : `Cypress.env()` n'existe plus → `cy.env()` pour les secrets, `Cypress.expose()` pour le reste.
- **Secrets** : uniquement dans `cypress.env.json` (ignoré par git), jamais dans `cypress.env.example.json` ou `fixtures/`.
- **Hooks** : un échec dans `beforeEach` saute toute la suite → n'y mettre que ce qui ne peut pas échouer.
- **Captures** : `screenshotOnRunFailure` ne marche qu'avec `cypress run`.
- **Clés Jira** : toujours `[QAP-xx]` dans les titres de tests, pour le script de la semaine 6.
