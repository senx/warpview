const sass = require("@stencil/sass");
exports.config = {
  namespace: "quantumviz",
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
