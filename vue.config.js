const { defineConfig } = require("@vue/cli-service");
process.env.VUE_APP_VERSION = require("./package.json").version;
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    i18n: {
      locale: 'fi',
      fallbackLocale: 'fi',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    }
  }
});
