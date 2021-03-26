/*
 *  Copyright 2021  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
const sass = require('sass');
const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './scripts/header.js',
    './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    './scripts/loader.js',
    './dist/warpview/elements/main.js'
  ];
  const css = [
    './node_modules/leaflet/dist/leaflet.css',
    './node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    './node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    './dist/warpview/elements/warpview-elements.css'
  ];
  await concat(files, './dist/warpview/elements/warpview-elements.js');
  fs.copy('./src/assets/fonts', './dist/warpview/elements/fonts');
  fs.copy('./node_modules/leaflet/dist/images', './dist/warpview/elements/images');
  const result = sass.renderSync({
    file: './projects/warpview-ng/src/lib/styles/warpview.scss',
    outFile: './dist/warpview/elements/warpview-elements.css',
    outputStyle: 'compressed'
  });
  let compiledScssCode = result.css.toString();
  // remove comments from the css output
  compiledScssCode = compiledScssCode.replace(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//gi, '');
  compiledScssCode = compiledScssCode.replace(/\/src\/assets\/fonts/gi, './fonts');
  fs.writeFileSync('./dist/warpview/elements/warpview-elements.css', compiledScssCode);
  concat(css, './dist/warpview/elements/warpview-elements.css');
})();
