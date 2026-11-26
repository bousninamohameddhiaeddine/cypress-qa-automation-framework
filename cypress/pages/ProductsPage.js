import { ProductsLocators as L } from "./locators";
import HomePage from "./HomePage";
import Header from "./Header";
import CartModal from "./CartModal";

// Page "All Products" : https://automationexercise.com/products
// (aussi : résultats de recherche, produits par catégorie et par marque)
class ProductsPage {
  // Ouvre la page depuis l'accueil, au début du test (pas dans un beforeEach)
  open() {
    HomePage.visit();
    Header.goToProducts();
    // On attend d'abord la nouvelle adresse : la page d'accueil a aussi un titre
    // ".features_items h2.title" ("Features Items") qui pouvait être lu par erreur
    cy.url().should("include", "/products");
    this.shouldShowTitle("All Products");
  }

  shouldShowTitle(title) {
    cy.get(L.pageTitle).should("be.visible").and("contain.text", title);
  }

  shouldShowProducts() {
    cy.get(L.productList).should("be.visible");
    cy.get(L.productCards).should("have.length.greaterThan", 0);
  }

  openFirstProduct() {
    cy.get(L.firstViewProduct).first().click();
    cy.url().should("include", "/product_details/");
  }

  // ----- Panier -----

  // Ajoute le produit n° index (0 = premier) et garde son nom dans l'alias @<alias>
  // Le bouton apparaît au survol : on clique sur celui de la carte, toujours présent
  // { type: "static" } : l'alias garde la VALEUR lue ici. Sans cette option, Cypress 12+
  // refait la recherche quand on lit l'alias… sur la page Panier, où elle ne trouve rien.
  addToCart(index, alias = `product${index}`) {
    cy.get(L.productNames).eq(index).invoke("text").as(alias, { type: "static" });
    cy.get(L.addToCartButtons).eq(index).click();
  }

  // Ajoute tous les produits affichés (ex. après une recherche) et garde leurs noms dans @names
  addAllToCart() {
    cy.get(L.productNames).then(($names) => {
      cy.wrap($names.toArray().map((el) => el.textContent.trim())).as("names", { type: "static" });
    });
    cy.get(L.addToCartButtons).each(($button) => {
      cy.wrap($button).click();
      CartModal.continueShopping();
    });
  }

  // ----- Recherche -----

  search(term) {
    cy.get(L.searchInput).fill(term);
    cy.get(L.searchButton).click();
    this.shouldShowTitle("Searched Products");
  }

  // Vérifie les résultats d'une recherche.
  // nameMatch = "all"  → TOUS les noms contiennent le terme
  // nameMatch = "some" → AU MOINS UN nom contient le terme. Le site cherche aussi dans la
  //   catégorie : un produit de la catégorie "Dress" peut s'appeler "Sleeves Top and Short".
  shouldShowResultsFor(term, nameMatch = "all") {
    const t = term.toLowerCase();
    cy.get(L.productNames).should(($names) => {
      const matching = $names.filter((i, el) => el.textContent.toLowerCase().includes(t));
      expect($names.length, "nombre de produits trouvés").to.be.greaterThan(0);
      if (nameMatch === "all") {
        expect(matching.length, `produits contenant "${term}"`).to.eq($names.length);
      } else {
        expect(matching.length, `produits contenant "${term}"`).to.be.greaterThan(0);
      }
    });
  }

  shouldShowNoResults() {
    cy.get(L.productCards).should("have.length", 0);
  }

  // ----- Catégories et marques (barre latérale) -----

  openCategory(category, sub) {
    cy.get(L.categoryPanel).should("be.visible");
    cy.get(L.categoryToggle(category)).click();
    cy.get(L.subCategoryLink(category, sub)).should("be.visible").click();
  }

  openBrand(brand) {
    cy.get(L.brandsPanel).should("be.visible");
    cy.get(L.brandLink(brand)).click();
  }
}

export default new ProductsPage();
