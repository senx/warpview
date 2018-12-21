/*! Built with http://stenciljs.com */
const{h:t}=window.warpview;class s{}class e{static cleanArray(t){return t.filter(t=>!!t)}static unique(t){let s={},e=[];for(let r=0,n=t.length;r<n;++r)s.hasOwnProperty(t[r])||(e.push(t[r]),s[t[r]]=1);return e}static isArray(t){return t&&"object"==typeof t&&t instanceof Array&&"number"==typeof t.length&&"function"==typeof t.splice&&!t.propertyIsEnumerable("length")}static isValidResponse(t){let s;try{s=JSON.parse(t)}catch(s){return console.error("Response non JSON compliant",t),!1}return!!e.isArray(s)||(console.error("Response isn't an Array",s),!1)}static isEmbeddedImage(t){return!("string"!=typeof t||!/^data:image/.test(t))}static isEmbeddedImageObject(t){return!(null===t||null===t.image||null===t.caption||!e.isEmbeddedImage(t.image))}static isPositionArray(t){if(!t||!t.positions)return!1;if(e.isPositionsArrayWithValues(t)||e.isPositionsArrayWithTwoValues(t))return!0;for(let s in t.positions){if(t.positions[s].length<2||t.positions[s].length>3)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static isPositionsArrayWithValues(t){if(null===t||null===t.positions)return!1;for(let s in t.positions){if(3!==t.positions[s].length)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static isPositionsArrayWithTwoValues(t){if(null===t||null===t.positions)return!1;for(let s in t.positions){if(4!==t.positions[s].length)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static metricFromJSON(t){let s={ts:t[0],value:void 0,alt:void 0,lon:void 0,lat:void 0};switch(t.length){case 2:s.value=t[1];break;case 3:s.alt=t[1],s.value=t[2];break;case 4:s.lat=t[1],s.lon=t[2],s.value=t[3];break;case 5:s.lat=t[1],s.lon=t[2],s.alt=t[3],s.value=t[4]}return s}static gtsFromJSON(t,s){return{gts:{c:t.c,l:t.l,a:t.a,v:t.v,id:s}}}static gtsFromJSONList(t,s){let r,n=[];return(t||[]).forEach((t,a)=>{let l=t;t.gts&&(l=t.gts),r=void 0!==s&&""!==s?s+"-"+a:a,e.isArray(l)&&n.push(e.gtsFromJSONList(l,r)),e.isGts(l)&&n.push(e.gtsFromJSON(l,r)),e.isEmbeddedImage(l)&&n.push({image:l,caption:"Image",id:r}),e.isEmbeddedImageObject(l)&&n.push({image:l.image,caption:l.caption,id:r})}),{content:n||[]}}static flatDeep(t){return e.isArray(t)||(t=[t]),t.reduce((t,s)=>Array.isArray(s)?t.concat(e.flatDeep(s)):t.concat(s),[])}static flattenGtsIdArray(t,s){const r=[];return console.log("flattenGtsIdArray",t,s),e.isGts(t)&&(t=[t]),t.forEach(t=>{if(console.log("flattenGtsIdArray a.forEach",t,s),e.isArray(t)){console.log("flattenGtsIdArray d isArray");const n=e.flattenGtsIdArray(t,s);r.push(n.res),s=n.r}else t.v&&(t.id=s,r.push(t),s++);console.log("flattenGtsIdArray res r",r,s)}),console.log("flattenGtsIdArray res",r),{res:r,r:s}}static serializeGtsMetadata(t){let s=[];Object.keys(t.l).forEach(e=>{s.push(e+"="+t.l[e])});let e=[];return Object.keys(t.a).forEach(s=>{e.push(s+"="+t.a[s])}),t.c+"{"+s.join(",")+(e.length>0?",":"")+e.join(",")+"}"}static gtsToPath(t){let s=[];for(let e=0;e<t.v.length;e++){let r=t.v[e];r.length,r.length,4===r.length&&s.push({ts:Math.floor(r[0]/1e3),lat:r[1],lon:r[2],val:r[3]}),5===r.length&&s.push({ts:Math.floor(r[0]/1e3),lat:r[1],lon:r[2],elev:r[3],val:r[4]})}return s}static equalMetadata(t,s){if(!(void 0!==t.c&&void 0!==s.c&&void 0!==t.l&&void 0!==s.l&&t.l instanceof Object&&s.l instanceof Object))return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"),!1;if(t.c!==s.c)return!1;for(let e in t.l)if(!s.l.hasOwnProperty(e)||t.l[e]!==s.l[e])return!1;for(let e in s.l)if(!t.l.hasOwnProperty(e))return!1;return!0}static isGts(t){return!(!t||null===t.c||null===t.l||null===t.a||null===t.v||!e.isArray(t.v))}static isGtsToPlot(t){if(!e.isGts(t)||0===t.v.length)return!1;for(let s=0;s<t.v.length;s++)if(null!==t.v[s][t.v[s].length-1]){if("number"==typeof t.v[s][t.v[s].length-1]||void 0!==t.v[s][t.v[s].length-1].constructor.prototype.toFixed)return!0;break}return!1}static isBooleanGts(t){if(!e.isGts(t)||0===t.v.length)return!1;for(let s=0;s<t.v.length;s++)if(null!==t.v[s][t.v[s].length-1]){if("boolean"!=typeof t.v[s][t.v[s].length-1])return!0;break}return!1}static isGtsToAnnotate(t){if(!e.isGts(t)||0===t.v.length)return!1;for(let s=0;s<t.v.length;s++)if(null!==t.v[s][t.v[s].length-1]){if("number"!=typeof t.v[s][t.v[s].length-1]&&t.v[s][t.v[s].length-1].constructor&&"Big"!==t.v[s][t.v[s].length-1].constructor.name&&void 0===t.v[s][t.v[s].length-1].constructor.prototype.toFixed)return!0;break}return!1}static gtsSort(t){t.isSorted||(t.v=t.v.sort(function(t,s){return t[0]-s[0]}),t.isSorted=!0)}static gtsTimeRange(t){return e.gtsSort(t),0===t.v.length?null:[t.v[0][0],t.v[t.v.length-1][0]]}static getData(t){return"string"==typeof t?e.getData(JSON.parse(t)):t&&t.hasOwnProperty("data")?t:e.isArray(t)&&t.length>0&&t[0].data?t[0]:e.isArray(t)?{data:t}:new s}static getDivider(t){let s=1e3;return"ms"===t&&(s=1),"ns"===t&&(s=1e6),s}}e.formatLabel=(t=>{const s=t.split("{");let e=`<span class="gtsInfo"><span class='gts-classname'>${s[0]}</span>`;if(s.length>1){e+="<span class='gts-separator'>{</span>";const t=s[1].substr(0,s[1].length-1).split(",");t.length>0&&t.forEach((s,r)=>{const n=s.split("=");s.length>1&&(e+=`<span><span class='gts-labelname'>${n[0]}</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>${n[1]}</span>`,r!==t.length-1&&(e+="<span>, </span>"))}),e+="<span class='gts-separator'>}</span>"}if(s.length>2){e+="<span class='gts-separator'>{</span>";const t=s[2].substr(0,s[2].length-1).split(",");t.length>0&&t.forEach((s,r)=>{const n=s.split("=");s.length>1&&(e+=`<span><span class='gts-attrname'>${n[0]}</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>${n[1]}</span>`,r!==t.length-1&&(e+="<span>, </span>"))}),e+="<span class='gts-separator'>}</span>"}return e+="</span>"});export{e as a,s as b};