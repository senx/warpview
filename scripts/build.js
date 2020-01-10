/*
 *  Copyright 2020  SenX S.A.S.
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

const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  await fs.ensureDir('elements');
  const es2015 = [
    './dist/elements/runtime-es2015.js',
    './dist/elements/polyfills-es2015.js',
    './dist/elements/main-es2015.js',
  ];
  const es5 = [
    './dist/elements/runtime-es5.js',
    './dist/elements/polyfills-es5.js',
    './dist/elements/main-es5.js',
  ];
  await concat(es2015, 'elements/warpview-editor-es2015.js');
  await concat(es5, 'elements/warpview-editor-es5.js');
  await concat([
    './scripts/loader.js',
    './dist/elements/scripts.js'
  ], 'elements/warpview-editor.js');
  await fs.copyFile('./dist/elements/styles.css', 'elements/warpview-editor.css');
  try {
    await fs.copy('./dist/elements/assets/', 'elements/assets/')
  } catch (e) {
    // nothing
  }
})();
