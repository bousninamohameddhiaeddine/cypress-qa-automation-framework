// =====================================================================
// Module : Paiement — validation des données de carte
// Story Jira : QAP-66 — Automatiser les parcours panier et commande
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : payment-data.json (cas négatifs) + checkout-data.json (carte valide)
//
// Un seul compte jetable pour tout le fichier : créé par l'API avant les tests,
// supprimé par l'API à la fin. Chaque test se connecte avec cy.login() (session en cache),
// ce qui évite de créer 28 comptes et de surcharger le site.
// (Le hook ne fait qu'un appel API : aucune navigation dans le site.)
// =====================================================================
import paymentData from "../../fixtures/payment-data.json";
import checkoutData from "../../fixtures/checkout-data.json";
import { newTestUser } from "../../support/testUser";
import ProductsPage from "../../pages/ProductsPage";
import CartModal from "../../pages/CartModal";
import CartPage from "../../pages/CartPage";
import CheckoutPage from "../../pages/CheckoutPage";
import PaymentPage from "../../pages/PaymentPage";

const u = newTestUser();

// Connexion, un produit dans le panier, jusqu'à la page de paiement
const goToPayment = () => {
  cy.login(u.email, u.password);
  ProductsPage.open();
  ProductsPage.addToCart(0);
  CartModal.viewCart();
  CartPage.proceedToCheckout();
  CheckoutPage.shouldBeVisible();
  CheckoutPage.placeOrder(checkoutData.comment);
};

describe("Paiement - validation de la carte", { tags: "@regression" }, () => {
  before(() => {
    cy.createAccountByApi(u);
  });

  after(() => {
    cy.deleteAccountByApi(u.email, u.password);
  });

  // ---------------------------------------------------------------
  // QAP-49 · TC16-N1 — Paiement avec des informations de carte manquantes
  // Type : Négatif · Priorité : Haute · payment-data.json → "emptyField" (x5)
  // Attendu : le navigateur bloque l'envoi (champ obligatoire), commande non confirmée.
  // ---------------------------------------------------------------
  paymentData.emptyField.forEach((row) => {
    it(`[${row.jira}] Refuse le paiement - ${row.case}`, () => {
      goToPayment();
      PaymentPage.fillCard(checkoutData.card, row);
      PaymentPage.submit();
      PaymentPage.shouldHaveInvalidField(row.field);
      PaymentPage.shouldNotShowOrderPlaced();
    });
  });

  // ---------------------------------------------------------------
  // QAP-84 · TC16-N2 — Paiement avec des données de carte au format invalide
  // Type : Négatif / valeurs limites · Priorité : Haute
  // payment-data.json → "invalidFormat" (x23 : nom, carte, CVC, mois, année)
  // Règles (exigences QA) : nom = lettres · carte = 16 chiffres · CVC = 3 chiffres ·
  //                         mois = 01 à 12 · année = 4 chiffres, non passée
  // Attendu : SOIT la saisie est bloquée (le champ ne contient pas la valeur invalide),
  //           SOIT le paiement est refusé ("Order Placed!" n'apparaît pas).
  // Si le site accepte → écart à documenter dans un Bug lié à QAP-84 (le test reste rouge).
  // ---------------------------------------------------------------
  paymentData.invalidFormat.forEach((row) => {
    it(`[${row.jira}] Refuse le paiement - ${row.case}`, () => {
      goToPayment();
      PaymentPage.fillCard(checkoutData.card, row);

      PaymentPage.fieldValue(row.field).then((value) => {
        if (value !== row.value) {
          // Le site a bloqué ou modifié la saisie : la valeur invalide n'est pas envoyée
          cy.log(`Saisie bloquée par le site : "${row.value}" → "${value}"`);
          return;
        }
        PaymentPage.submit();
        PaymentPage.shouldNotShowOrderPlaced();
      });
    });
  });
});
