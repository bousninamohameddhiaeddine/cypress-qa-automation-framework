import { ProductsLocators as L } from "./locators";
import HomePage from "./HomePage";
import Header from "./Header";

// Page "All Products" : https://automationexercise.com/products
// (aussi : résultats de recherche, produits par catégorie et par marque)
class ProductsPage {
  // Ouvre la page depuis l'accueil, au début du test (pas dans un beforeEach)
  open() {
    HomePage.visit();
    Header.goToProducts();
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
