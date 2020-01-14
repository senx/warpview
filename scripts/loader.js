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

window.addEventListener('load', function() {
  console.log(scriptPath());
  const script = document.createElement('script');
  script.src = scriptPath() + '/warpview-elements.js';
  script.setAttribute('nomodule', 'true');
  script.setAttribute('defer', 'true');
  document.body.appendChild(script);

  const css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.setAttribute('href', scriptPath() + '/warpview-elements.css');
  document.head.appendChild(css);

});
const scriptPath = function () {
  let scripts = document.getElementsByTagName('SCRIPT');
  let path = '';
  if (scripts && scripts.length > 0) {
    for (let i in scripts) {
      if (scripts[i].src && scripts[i].src.match(/\/warpview-elements\.js$/)) {
        path = scripts[i].src.replace(/(.*)\/warpview-elements\.js$/, '$1');
        break;
      }
    }
  }
  return path;
};
