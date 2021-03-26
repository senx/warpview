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

#!/usr/bin/env node
const {execSync} = require('child_process');
const semverSort = require('semver-sort');
let repo = 'https://github.com/senx/warpview';
let md =
  `WarpView
---

`;

let tagList = execSync('git tag -l --sort=-v:refname | head -n 10');
tagList = tagList.toString().split('\n').filter(i => i !== '');
tagList = semverSort.desc(tagList);
let lastTag = tagList[0];
tagList = tagList.slice(1, -1);
tagList.forEach(tag => {
  md += `## ${lastTag}

`;
  execSync(`git log --no-merges --date=iso --format="> +  ts%ct  | %s %N (*[%cN](%ce) | [view commit](${repo}/commit/%H)*)" ${tag}..${lastTag}`)
    .toString().split('\n').forEach(l => {
    let timestamp = /ts([0-9]+)/.exec(l);
    if (timestamp) {
      l = l.replace('ts' + timestamp[1], new Date(timestamp[1] * 1000).toISOString().split('T')[0].replace(/\-/gi, '/'));
    }
    let issue = /#([0-9]+)/.exec(l);
    if (issue) {
      l = l.replace('#' + issue[1], `[#${issue[1]}](${repo}/issues/${issue[1]})`);
    }
    md += l + '\n';
  });
  lastTag = tag;

});
console.log(md);
