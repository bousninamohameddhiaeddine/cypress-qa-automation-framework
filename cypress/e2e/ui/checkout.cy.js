// =====================================================================
// Module : Commande et paiement
// Story Jira : QAP-66 — Automatiser les parcours panier et commande
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : checkout-data.json (commentaire, carte de test fictive)
//              + register-data.json → "newUser" via support/testUser.js
// Règle : chaque test crée son propre compte (courriel unique) et le supprime à la fin.
// Le compte partagé n'est jamais utilisé ici.
// =====================================================================
import data from "../../fixtures/checkout-data.json";
import { newTestUser } from "../../support/testUser";
import { registerViaUi, deleteAccountViaUi, createAccountAndLogin } from "../../support/flows";
import HomePage from "../../pages/HomePage";
import Header from "../../pages/Header";
import ProductsPage from "../../pages/ProductsPage";
import CartModal from "../../pages/CartModal";
import CartPage from "../../pages/CartPage";
import CheckoutPage from "../../pages/CheckoutPage";
import PaymentPage from "../../pages/PaymentPage";

// Ajoute les 2 premiers produits et ouvre le panier
const addTwoProductsAndOpenCart = () => {
  ProductsPage.open();
  ProductsPage.addToCart(0, "product1");
  CartModal.continueShopping();
  ProductsPage.addToCart(1, "product2");
  CartModal.viewCart();
  CartPage.shouldHaveProductCount(2);
};

// Depuis le panier d'un utilisateur connecté : checkout, vérifications, paiement
const checkoutAndPay = (u) => {
  CartPage.proceedToCheckout();
  CheckoutPage.shouldBeVisible();
  CheckoutPage.shouldShowDeliveryAddress(u);
  CheckoutPage.shouldShowProductsInReview(2);
  CheckoutPage.placeOrder(data.comment);
  PaymentPage.pay(data.card);
  PaymentPage.shouldShowOrderPlaced(data.orderConfirmed);
};

describe("Commande", () => {
  // ---------------------------------------------------------------
  // QAP-22 · TC14 — Commande : inscription pendant le paiement
  // Type : Positif · Priorité : Haute
  // L'inscription se fait par l'interface : c'est ce que ce cas vérifie.
  // ---------------------------------------------------------------
  it("[QAP-22] Commande avec inscription pendant le paiement", () => {
    const u = newTestUser();

    addTwoProductsAndOpenCart();
    CartPage.proceedToCheckout();
    CartPage.goToLoginFromCheckoutModal();
    registerViaUi(u);

    CartPage.open();
    CartPage.shouldHaveProductCount(2);
    checkoutAndPay(u);
    cy.captureValidation(); // capture : commande confirmée

    deleteAccountViaUi();
  });

  // ---------------------------------------------------------------
  // QAP-23 · TC15 — Commande : inscription avant le paiement
  // Type : Positif · Priorité : Haute
  // ---------------------------------------------------------------
  it("[QAP-23] Commande avec inscription avant le paiement", () => {
    const u = newTestUser();

    HomePage.visit();
    Header.goToSignupLogin();
    registerViaUi(u);

    addTwoProductsAndOpenCart();
    checkoutAndPay(u);
    cy.captureValidation();

    deleteAccountViaUi();
  });

  // ---------------------------------------------------------------
  // QAP-24 · TC16 — Commande : connexion avant le paiement
  // Type : Positif · Priorité : Haute
  // Test hybride : compte préparé par l'API, parcours vérifié par l'interface.
  // ---------------------------------------------------------------
  it("[QAP-24] Commande avec connexion avant le paiement", () => {
    const u = newTestUser();

    createAccountAndLogin(u);
    addTwoProductsAndOpenCart();
    checkoutAndPay(u);
    cy.captureValidation();

    deleteAccountViaUi();
  });

  // ---------------------------------------------------------------
  // QAP-31 · TC23 — Vérification des adresses de livraison et de facturation
  // Type : Positif · Priorité : Haute
  // Une seule source de vérité : le même objet "u" sert à l'inscription et à la comparaison.
  // ---------------------------------------------------------------
  it("[QAP-31] Adresses de livraison et de facturation", () => {
    const u = newTestUser();

    HomePage.visit();
    Header.goToSignupLogin();
    registerViaUi(u);

    addTwoProductsAndOpenCart();
    CartPage.proceedToCheckout();
    CheckoutPage.shouldBeVisible();
    CheckoutPage.shouldShowDeliveryAddress(u);
    CheckoutPage.shouldShowBillingAddress(u);
    cy.captureValidation(); // capture : les deux adresses

    deleteAccountViaUi();
  });

  // ---------------------------------------------------------------
  // QAP-32 · TC24 — Téléchargement de la facture après commande
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  it("[QAP-32] Téléchargement de la facture", () => {
    const u = newTestUser();
    cy.task("deleteFile", data.invoiceFile); // pas d'ancienne facture

    addTwoProductsAndOpenCart();
    CartPage.proceedToCheckout();
    CartPage.goToLoginFromCheckoutModal();
    registerViaUi(u);
    CartPage.open();
    checkoutAndPay(u);

    PaymentPage.downloadInvoice();
    cy.readFile(data.invoiceFile, { timeout: 15000 })
      .should("not.be.empty")
      .and("contain", u.firstName)
      .and("contain", u.lastName);
    PaymentPage.continue();

    deleteAccountViaUi();
  });

  // QAP-49 et QAP-84 (validation de la carte) : voir payment.cy.js
});
