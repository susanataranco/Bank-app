const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BACKEND_API_URL,
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})
