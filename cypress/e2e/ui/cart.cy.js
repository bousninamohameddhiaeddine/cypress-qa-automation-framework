// =====================================================================
// Module : Panier
// Story Jira : QAP-66 — Automatiser les parcours panier et commande
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : cypress/fixtures/cart-data.json
// Note : un visiteur non connecté a un panier vide au début de chaque test
// (Cypress efface les cookies entre les tests).
// =====================================================================
import data from "../../fixtures/cart-data.json";
import { newTestUser } from "../../support/testUser";
import { createAccountAndLogin } from "../../support/flows";
import HomePage from "../../pages/HomePage";
import Header from "../../pages/Header";
import LoginPage from "../../pages/LoginPage";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailPage from "../../pages/ProductDetailPage";
import CartModal from "../../pages/CartModal";
import CartPage from "../../pages/CartPage";

describe("Panier", () => {
  // ---------------------------------------------------------------
  // QAP-20 · TC12 — Ajout de deux produits au panier et vérification des montants
  // Type : Positif · Priorité : Haute · smoke
  // ---------------------------------------------------------------
  it("[QAP-20] Ajout de deux produits et vérification des montants", () => {
    ProductsPage.open();
    ProductsPage.addToCart(0, "product1");
    CartModal.continueShopping();
    ProductsPage.addToCart(1, "product2");
    CartModal.viewCart();

    CartPage.shouldHaveProductCount(2);
    cy.get("@product1").then((p1) => {
      cy.get("@product2").then((p2) => {
        CartPage.shouldContainProducts([p1, p2]);
        CartPage.shouldHaveQuantity(p1, 1);
        CartPage.shouldHaveQuantity(p2, 1);
      });
    });
    CartPage.shouldHaveConsistentTotals();
  });

  // ---------------------------------------------------------------
  // QAP-21 · TC13 — Ajout d'un produit avec une quantité de 4
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  it(`[${data.quantity.jira}] ${data.quantity.case}`, () => {
    ProductsPage.open();
    ProductsPage.openFirstProduct();
    ProductDetailPage.shouldShowAllInformation();
    ProductDetailPage.rememberName();
    ProductDetailPage.setQuantity(data.quantity.value);
    ProductDetailPage.addToCart();
    CartModal.viewCart();

    cy.get("@productName").then((name) => {
      CartPage.shouldHaveQuantity(name, data.quantity.value);
    });
    CartPage.shouldHaveConsistentTotals();
  });

  // ---------------------------------------------------------------
  // QAP-50 · TC13-N1 — Ajout au panier avec une quantité invalide (0, négative)
  // Type : Négatif / valeurs limites · Priorité : Moyenne
  // cart-data.json → "invalidQuantity" (un test par valeur)
  // Attendu : aucune ligne avec une quantité ≤ 0 dans le panier.
  // Si le site accepte la valeur → vrai bug : ouvrir un Bug dans Jira (le test reste rouge).
  //
  // Note QA : le test se fait CONNECTÉ. En visiteur, le panier restait vide et le test
  // passait sans rien prouver (faux positif). Compte jetable créé par l'API, supprimé à la fin.
  // ---------------------------------------------------------------
  data.invalidQuantity.forEach((row) => {
    it(`[${row.jira}] Refuse l'ajout au panier - ${row.case}`, () => {
      const u = newTestUser();
      createAccountAndLogin(u);

      ProductsPage.open();
      ProductsPage.openFirstProduct();
      ProductDetailPage.setQuantity(row.value);
      ProductDetailPage.addToCart();
      CartModal.viewCartFromModalOrMenu(() => CartPage.open());
      CartPage.shouldNotContainInvalidQuantity();

      cy.deleteAccountByApi(u.email, u.password);
    });
  });

  // ---------------------------------------------------------------
  // QAP-25 · TC17 — Suppression d'un produit du panier
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  it("[QAP-25] Suppression d'un produit du panier", () => {
    ProductsPage.open();
    ProductsPage.addToCart(0, "product1");
    CartModal.continueShopping();
    ProductsPage.addToCart(1, "product2");
    CartModal.viewCart();
    CartPage.shouldHaveProductCount(2);

    cy.get("@product1").then((p1) => {
      cy.get("@product2").then((p2) => {
        CartPage.removeProduct(p1);
        CartPage.shouldHaveProductCount(1);
        CartPage.shouldContainProducts([p2]);
        CartPage.removeProduct(p2);
      });
    });
    CartPage.shouldBeEmpty();
  });

  // ---------------------------------------------------------------
  // QAP-28 · TC20 — Recherche, ajout au panier puis conservation du panier après connexion
  // Type : Positif · Priorité : Moyenne
  // Choix QA : on utilise un compte jetable créé par l'API (et supprimé à la fin) plutôt
  // que le compte partagé, pour ne jamais laisser son panier "sale".
  // ---------------------------------------------------------------
  it("[QAP-28] Panier conservé après connexion", () => {
    const u = newTestUser();
    cy.createAccountByApi(u);

    ProductsPage.open();
    ProductsPage.search(data.searchTerm);
    ProductsPage.shouldShowResultsFor(data.searchTerm, "all");
    ProductsPage.addAllToCart();
    CartPage.open();
    cy.get("@names").then((names) => CartPage.shouldContainProducts(names));

    // connexion par l'interface (cy.login() viderait le panier du visiteur)
    Header.goToSignupLogin();
    LoginPage.login(u.email, u.password);
    Header.shouldBeLoggedInAs(u.name);

    CartPage.open();
    cy.get("@names").then((names) => CartPage.shouldContainProducts(names));

    cy.deleteAccountByApi(u.email, u.password);
  });

  // ---------------------------------------------------------------
  // QAP-30 · TC22 — Ajout au panier depuis les articles recommandés
  // Type : Positif · Priorité : Basse
  // ---------------------------------------------------------------
  it("[QAP-30] Ajout depuis les articles recommandés", () => {
    HomePage.visit();
    HomePage.addFirstRecommendedToCart();
    CartModal.viewCart();
    cy.get("@recommended").then((name) => CartPage.shouldContainProducts([name]));
  });
});
