const sass = require("@stencil/sass");
exports.config = {
  namespace: "quantumviz",
  plugins: [sass()],
  enableCache: true,
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www"
    }
  ]
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
