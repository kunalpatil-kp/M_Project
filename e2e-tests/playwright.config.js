const { defineConfig, devices } = require(`@playwright/test`);
module.exports = defineConfig({
  testDir: `./tests`,
  timeout: 90000,
  retries: 1,
  workers: 1,
  reporter: [
    [`list`],
    [`json`, { outputFile: `test-results/results.json` }]
  ],
  use: {
    screenshot: `only-on-failure`,
    headless: true,
    actionTimeout: 30000,
    navigationTimeout: 90000,
  },
  projects: [
    { name: `chromium`, use: { ...devices[`Desktop Chrome`] } },
  ],
});
