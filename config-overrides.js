const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy, disableEsLint } = require("customize-cra");
module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
      javascriptEnabled: true,
    modifyVars: { '@primary-color': '#2e8aa8' }
  })
);
