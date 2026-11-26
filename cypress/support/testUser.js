// Utilisateurs jetables pour les tests qui créent un compte (panier, commande).
// Une seule source de vérité : les données de register-data.json → "newUser".
import registerData from "../fixtures/register-data.json";

// Nouvel utilisateur avec un courriel unique à chaque appel
export const newTestUser = () => ({
  ...registerData.newUser,
  email: `qa.test.${Date.now()}@example.com`,
});
