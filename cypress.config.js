const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automationexercise.com",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    retries: { runMode: 2, openMode: 0 },
    video: false,
    blockHosts: [
      "*googlesyndication.com",
      "*doubleclick.net",
      "*googleadservices.com",
      "*google-analytics.com",
    ],
  },
});