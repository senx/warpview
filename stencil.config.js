const sass = require("@stencil/sass");
exports.config = {
  namespace: "warpview",
  plugins: [sass()],
  enableCache: true,
  globalStyle: 'src/globals/style.scss',
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www"
    }
  ],
  nodeResolve: {
    browser: true
  }
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
