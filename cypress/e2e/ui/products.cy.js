// =====================================================================
// Module : Produits (liste, détail, recherche, catégories, marques, avis)
// Story Jira : QAP-65 — Automatiser contact, produits, recherche, abonnement et avis
// Epic Jira  : QAP-3  — S2 Tests pilotés par les données (JSON) et Page Objects
// Données    : search-data.json, catalog-data.json, review-data.json
// =====================================================================
import searchData from "../../fixtures/search-data.json";
import catalogData from "../../fixtures/catalog-data.json";
import reviewData from "../../fixtures/review-data.json";
import HomePage from "../../pages/HomePage";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailPage from "../../pages/ProductDetailPage";

describe("Produits", { tags: "@regression" }, () => {
  // ---------------------------------------------------------------
  // QAP-16 · TC08 — Liste des produits et page de détail d'un produit
  // Type : Positif · Priorité : Haute · smoke
  // ---------------------------------------------------------------
  it("[QAP-16] Liste des produits et page de détail", { tags: "@smoke" }, () => {
    ProductsPage.open();
    ProductsPage.shouldShowProducts();
    ProductsPage.openFirstProduct();
    ProductDetailPage.shouldShowAllInformation();
  });

  // ---------------------------------------------------------------
  // QAP-17 · TC09 — Recherche d'un produit existant
  // Type : Positif · Priorité : Haute
  // search-data.json → "valid" (un test par terme)
  // "nameMatch": "all"  → tous les noms contiennent le terme (ex. Jeans)
  // "nameMatch": "some" → au moins un nom contient le terme (ex. Dress, Top)
  // Note QA : le site cherche aussi dans la CATÉGORIE du produit. Ex. : "Dress" renvoie
  // "Sleeves Top and Short - Blue & Pink" (catégorie Kids > Dress). Ce n'est pas un bug
  // de la recherche (remarque possible sur le classement du produit dans le catalogue).
  // ---------------------------------------------------------------
  searchData.valid.forEach((row) => {
    it(`[${row.jira}] ${row.case}`, () => {
      ProductsPage.open();
      ProductsPage.search(row.term);
      ProductsPage.shouldShowResultsFor(row.term, row.nameMatch);
    });
  });

  // ---------------------------------------------------------------
  // Cas négatifs de recherche — search-data.json → "invalid"
  //   QAP-45 · TC09-N1 — Recherche d'un produit inexistant                        · Moyenne
  //   QAP-46 · TC09-N2 — Recherche avec caractères spéciaux et injection simple (x3) · Moyenne
  // Attendu : la page ne plante pas et n'affiche aucun produit.
  // Si l'injection SQL renvoie des produits → probable vrai bug : ouvrir un Bug dans Jira.
  // ---------------------------------------------------------------
  searchData.invalid.forEach((row) => {
    it(`[${row.jira}] Recherche sans résultat - ${row.case}`, () => {
      ProductsPage.open();
      ProductsPage.search(row.term);
      ProductsPage.shouldShowNoResults();
    });
  });

  // ---------------------------------------------------------------
  // QAP-26 · TC18 — Affichage des produits par catégorie
  // Type : Positif · Priorité : Moyenne
  // Note QA : l'énoncé du site demande de vérifier "WOMEN - TOPS PRODUCTS" après un clic
  // sur "Dress". On vérifie le titre de la sous-catégorie réellement cliquée.
  // ---------------------------------------------------------------
  it(`[${catalogData.categories.jira}] ${catalogData.categories.case}`, () => {
    HomePage.visit();
    catalogData.categories.rows.forEach((row) => {
      ProductsPage.openCategory(row.category, row.sub);
      ProductsPage.shouldShowTitle(row.title);
      ProductsPage.shouldShowProducts();
    });
  });

  // ---------------------------------------------------------------
  // QAP-27 · TC19 — Affichage des produits par marque
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  it(`[${catalogData.brands.jira}] ${catalogData.brands.case}`, () => {
    ProductsPage.open();
    catalogData.brands.rows.forEach((row) => {
      ProductsPage.openBrand(row.brand);
      ProductsPage.shouldShowTitle(row.title);
      ProductsPage.shouldShowProducts();
    });
  });

  // ---------------------------------------------------------------
  // QAP-29 · TC21 — Ajout d'un avis sur un produit
  // Type : Positif · Priorité : Moyenne
  // ---------------------------------------------------------------
  reviewData.valid.forEach((row) => {
    it(`[${row.jira}] ${row.case}`, () => {
      ProductsPage.open();
      ProductsPage.openFirstProduct();
      ProductDetailPage.writeReview(row);
      ProductDetailPage.shouldShowReviewSuccess(row.success);
    });
  });

  // ---------------------------------------------------------------
  // Cas négatifs d'avis — review-data.json → "invalid"
  //   QAP-48 · TC21-N1 — Avis produit avec des champs obligatoires vides (x3) · Basse
  // ---------------------------------------------------------------
  reviewData.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'avis - ${row.case}`, () => {
      ProductsPage.open();
      ProductsPage.openFirstProduct();
      ProductDetailPage.writeReview(row);
      ProductDetailPage.shouldHaveInvalidField(row.validation);
      ProductDetailPage.shouldNotShowReviewSuccess();
    });
  });
});
