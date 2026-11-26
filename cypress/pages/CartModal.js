import { CartModalLocators as L } from "./locators";

// Fenêtre "Added!" qui s'ouvre après chaque ajout au panier
class CartModal {
  shouldBeVisible() {
    cy.get(L.modal).should("be.visible");
  }

  continueShopping() {
    this.shouldBeVisible();
    cy.get(L.continueShopping).click();
    cy.get(L.modal).should("not.be.visible");
  }

  viewCart() {
    this.shouldBeVisible();
    cy.get(L.viewCart).click();
    cy.url().should("include", "/view_cart");
  }

  // Pour les cas négatifs (QAP-50) : on ne sait pas d'avance si le site accepte l'ajout.
  // Si la fenêtre "Added!" est ouverte (le site a accepté), on passe par "View Cart"
  // (la fenêtre recouvre le menu) ; sinon on passe par le menu "Cart".
  viewCartFromModalOrMenu(openCartFromMenu) {
    cy.get("body").then(($body) => {
      if ($body.find(L.modal).is(":visible")) this.viewCart();
      else openCartFromMenu();
    });
  }
}

export default new CartModal();
