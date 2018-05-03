const sass = require('@stencil/sass');
exports.config = {
  namespace: 'quantumviz',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www'
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
