const sass = require("@stencil/sass");
exports.config = {
  namespace: "warpview",
  plugins: [sass()],
  enableCache: false,
  globalStyle: 'src/globals/style.scss',
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www"
    },
    { type: 'docs' }
  ],
  nodeResolve: {
    browser: true
  }
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
