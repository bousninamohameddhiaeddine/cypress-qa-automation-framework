const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automationexercise.com",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
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