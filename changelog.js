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
