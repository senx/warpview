const sass = require("@stencil/sass");
exports.config = {
  namespace: "quantumviz",
  plugins: [sass()],
  enableCache: true,
  globalStyle: 'src/globals/style.scss',
  copy: [
    { src: 'assets' }
  ],
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
