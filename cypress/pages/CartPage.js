import { CartLocators as L } from "./locators";
import Header from "./Header";

// "Rs. 500" → 500
const toNumber = (text) => Number(text.replace(/[^0-9]/g, ""));

// Page "Shopping Cart" : https://automationexercise.com/view_cart
class CartPage {
  open() {
    Header.goToCart();
    cy.url().should("include", "/view_cart");
  }

  shouldHaveProductCount(count) {
    cy.get(L.rows).should("have.length", count);
  }

  shouldContainProducts(names) {
    names.forEach((name) => {
      cy.get(L.rows).find(L.rowName).should("contain.text", name);
    });
  }

  shouldNotContainProduct(name) {
    cy.contains(L.rows, name).should("not.exist");
  }

  // Quantité affichée pour un produit
  shouldHaveQuantity(name, quantity) {
    cy.contains(L.rows, name).find(L.rowQuantity).should("have.text", String(quantity));
  }

  // Pour chaque ligne : Total = Prix × Quantité
  shouldHaveConsistentTotals() {
    cy.get(L.rows).each(($row) => {
      const price = toNumber($row.find(L.rowPrice).text());
      const quantity = toNumber($row.find(L.rowQuantity).text());
      const total = toNumber($row.find(L.rowTotal).text());
      const name = $row.find(L.rowName).text();
      expect(total, `total de "${name}" (${price} × ${quantity})`).to.eq(price * quantity);
    });
  }

  // QAP-50 : aucune ligne avec une quantité ≤ 0
  // On attend d'abord que le contenu du panier soit affiché (lignes OU "Cart is empty!") :
  // sans cette attente, le test lisait la page avant l'affichage des lignes et passait à tort
  // (capture : panier à -1 / Rs. -500 avec un test vert).
  shouldNotContainInvalidQuantity() {
    cy.get(`${L.rows}, ${L.emptyCart}`).should("be.visible");
    cy.get("body").then(($body) => {
      $body.find(L.rows).each((i, row) => {
        const quantity = Number(Cypress.$(row).find(L.rowQuantity).text().trim());
        expect(quantity, "quantité dans le panier").to.be.greaterThan(0);
      });
    });
  }

  removeProduct(name) {
    cy.contains(L.rows, name).find(L.rowDelete).click();
    this.shouldNotContainProduct(name);
  }

  shouldBeEmpty() {
    cy.get(L.emptyCart).should("be.visible");
  }

  proceedToCheckout() {
    cy.get(L.proceedToCheckout).click();
  }

  // Utilisateur non connecté : la fenêtre propose "Register / Login"
  goToLoginFromCheckoutModal() {
    cy.get(L.checkoutModal).should("be.visible");
    cy.get(L.checkoutModalLogin).click();
    cy.url().should("include", "/login");
  }
}

export default new CartPage();
