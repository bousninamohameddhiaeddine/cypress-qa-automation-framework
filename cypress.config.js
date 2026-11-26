const { defineConfig } = require("cypress");
const fs = require("fs");
const { plugin: cypressGrepPlugin } = require("@cypress/grep/plugin");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automationexercise.com",
    downloadsFolder: "cypress/downloads",
    setupNodeEvents(on, config) {
      // cy.task("deleteFile", chemin) : supprime un fichier avant un téléchargement
      // (sinon une ancienne facture pourrait faire passer le test QAP-32 à tort)
      on("task", {
        deleteFile(filePath) {
          fs.rmSync(filePath, { force: true });
          return null;
        },
      });

      // @cypress/grep : avec grepFilterSpecs, seuls les fichiers qui contiennent
      // le tag demandé sont ouverts (exécution smoke plus rapide)
      cypressGrepPlugin(config);
      return config;
    },
    viewportWidth: 1366,
    viewportHeight: 768,
    // 15 s : le site de pratique est souvent lent (Cloudflare, serveur surchargé).
    // Cypress continue dès que l'élément est là : un délai plus long ne ralentit pas
    // les tests quand le site est rapide.
    defaultCommandTimeout: 15000,
    retries: { runMode: 2, openMode: 0 },
    video: false,
    // capture automatique en cas d'échec (écran complet + erreur)
    screenshotOnRunFailure: true,
    // ne pas vider cypress/screenshots avant chaque "cypress run" : on garde l'historique
    trashAssetsBeforeRuns: false,
    screenshotsFolder: "cypress/screenshots",
    blockHosts: [
      "*googlesyndication.com",
      "*doubleclick.net",
      "*googleadservices.com",
      "*google-analytics.com",
    ],
  },
});