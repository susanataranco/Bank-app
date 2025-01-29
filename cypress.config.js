const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})
