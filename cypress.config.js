const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1280, // Largura da tela (Desktop)
    viewportHeight: 720, // Altura da tela (Desktop)
  },
});
