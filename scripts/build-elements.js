const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/elements/runtime.js',
    './dist/elements/polyfills.js',
    './dist/elements/es2015-polyfills.js',
    './dist/elements/scripts.js',
    './dist/elements/main.js',
  ];
  await fs.ensureDir('elements');
  await concat(files, 'elements/warpview-elements.js');
  await fs.copyFile('./dist/elements/styles.css', 'elements/warpview-styles.css');
  try {
    await fs.copy('./dist/elements/assets/', 'elements/assets/')
  } catch (e) {
    // nothing
  }
})();
