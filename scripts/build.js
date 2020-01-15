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
  const files = [
    './dist/elements/runtime.js',
    './dist/elements/polyfills.js',
    './dist/elements/scripts.js',
    './dist/elements/main.js',
    './scripts/loader.js'
  ];
  await concat( files, 'elements/warpview-elements.js');
  await fs.copyFile('./dist/elements/styles.css', 'elements/warpview-elements.css');
  try {
    await fs.copy('./dist/elements/assets/', 'elements/assets/')
  } catch (e) {
    // nothing
  }
})();