class t{constructor(t,s=!1){this.isDebug=!1,this.className=t.name,this.isDebug=s}log(t,e,r){let a=[];switch(a.push(`[${this.className}] ${e.join(" - ")}`),a=a.concat(r),t){case s.DEBUG:break;case s.ERROR:console.error(...a);break;case s.INFO:console.log(...a);break;case s.WARN:console.warn(...a);break;default:this.isDebug&&console.log(...a)}}debug(t,...e){this.log(s.DEBUG,t,e)}error(t,...e){this.log(s.ERROR,t,e)}warn(t,...e){this.log(s.WARN,t,e)}info(t,...e){this.log(s.INFO,t,e)}}var s;!function(t){t[t.DEBUG=0]="DEBUG",t[t.ERROR=1]="ERROR",t[t.WARN=2]="WARN",t[t.INFO=3]="INFO"}(s||(s={}));class e{}class r{static cleanArray(t){return t.filter(t=>!!t)}static unique(t){let s={},e=[];for(let r=0,a=t.length;r<a;++r)s.hasOwnProperty(t[r])||(e.push(t[r]),s[t[r]]=1);return e}static isArray(t){return t&&"object"==typeof t&&t instanceof Array&&"number"==typeof t.length&&"function"==typeof t.splice&&!t.propertyIsEnumerable("length")}static isValidResponse(t){let s;try{s=JSON.parse(t)}catch(s){return this.LOG.error(["isValidResponse"],"Response non JSON compliant",t),!1}return!!r.isArray(s)||(this.LOG.error(["isValidResponse"],"Response isn't an Array",s),!1)}static isEmbeddedImage(t){return!("string"!=typeof t||!/^data:image/.test(t))}static isEmbeddedImageObject(t){return!(null===t||null===t.image||null===t.caption||!r.isEmbeddedImage(t.image))}static isPositionArray(t){if(!t||!t.positions)return!1;if(r.isPositionsArrayWithValues(t)||r.isPositionsArrayWithTwoValues(t))return!0;for(let s in t.positions){if(t.positions[s].length<2||t.positions[s].length>3)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static isPositionsArrayWithValues(t){if(null===t||null===t.positions)return!1;for(let s in t.positions){if(3!==t.positions[s].length)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static isPositionsArrayWithTwoValues(t){if(null===t||null===t.positions)return!1;for(let s in t.positions){if(4!==t.positions[s].length)return!1;for(let e in t.positions[s])if("number"!=typeof t.positions[s][e])return!1}return!0}static gtsFromJSON(t,s){return{gts:{c:t.c,l:t.l,a:t.a,v:t.v,id:s}}}static gtsFromJSONList(t,s){let e,a=[];return(t||[]).forEach((t,n)=>{let i=t;t.gts&&(i=t.gts),e=void 0!==s&&""!==s?s+"-"+n:n,r.isArray(i)&&a.push(r.gtsFromJSONList(i,e)),r.isGts(i)&&a.push(r.gtsFromJSON(i,e)),r.isEmbeddedImage(i)&&a.push({image:i,caption:"Image",id:e}),r.isEmbeddedImageObject(i)&&a.push({image:i.image,caption:i.caption,id:e})}),{content:a||[]}}static flatDeep(t){return r.isArray(t)||(t=[t]),t.reduce((t,s)=>Array.isArray(s)?t.concat(r.flatDeep(s)):t.concat(s),[])}static flattenGtsIdArray(t,s){const e=[];return r.isGts(t)&&(t=[t]),t.forEach(t=>{if(r.isArray(t)){const a=r.flattenGtsIdArray(t,s);e.push(a.res),s=a.r}else t.v&&(t.id=s,e.push(t),s++)}),{res:e,r:s}}static sanitizeNames(t){return t.replace(/{/g,"&#123;").replace(/}/g,"&#125;").replace(/,/g,"&#44;").replace(/>/g,"&#62;").replace(/</g,"&#60;").replace(/"/g,"&#34;").replace(/'/g,"&#39;")}static serializeGtsMetadata(t){let s=[],e=[];return t.l&&Object.keys(t.l).forEach(e=>{s.push(this.sanitizeNames(e+"="+t.l[e]))}),t.a&&Object.keys(t.a).forEach(s=>{e.push(this.sanitizeNames(s+"="+t.a[s]))}),this.sanitizeNames(t.c)+"{"+s.join(",")+(e.length>0?",":"")+e.join(",")+"}"}static gtsToPath(t,s=1e3){let e=[];for(let r=0;r<t.v.length;r++){let a=t.v[r];4===a.length&&e.push({ts:Math.floor(a[0]/s),lat:a[1],lon:a[2],val:a[3]}),5===a.length&&e.push({ts:Math.floor(a[0]/s),lat:a[1],lon:a[2],elev:a[3],val:a[4]})}return e}static equalMetadata(t,s){if(!(void 0!==t.c&&void 0!==s.c&&void 0!==t.l&&void 0!==s.l&&t.l instanceof Object&&s.l instanceof Object))return this.LOG.error(["equalMetadata"],"Error in GTS, metadata is not well formed"),!1;if(t.c!==s.c)return!1;for(let e in t.l)if(!s.l.hasOwnProperty(e)||t.l[e]!==s.l[e])return!1;for(let e in s.l)if(!t.l.hasOwnProperty(e))return!1;return!0}static isGts(t){return!(!t||null===t.c||null===t.l||null===t.a||null===t.v||!r.isArray(t.v))}static isGtsToPlot(t){if(!r.isGts(t)||0===t.v.length)return!1;for(let s=0;s<t.v.length;s++)if(null!==t.v[s][t.v[s].length-1]){if("number"==typeof t.v[s][t.v[s].length-1]||void 0!==t.v[s][t.v[s].length-1].constructor.prototype.toFixed)return!0;break}return!1}static isGtsToAnnotate(t){if(!r.isGts(t)||0===t.v.length)return!1;for(let s=0;s<t.v.length;s++)if(null!==t.v[s][t.v[s].length-1]){if("number"!=typeof t.v[s][t.v[s].length-1]&&t.v[s][t.v[s].length-1].constructor&&"Big"!==t.v[s][t.v[s].length-1].constructor.name&&void 0===t.v[s][t.v[s].length-1].constructor.prototype.toFixed)return!0;break}return!1}static gtsSort(t){t.isSorted||(t.v=t.v.sort(function(t,s){return t[0]-s[0]}),t.isSorted=!0)}static getData(t){return"string"==typeof t?r.getData(JSON.parse(t)):t&&t.hasOwnProperty("data")?t:r.isArray(t)&&t.length>0&&t[0].data?t[0]:r.isArray(t)?{data:t}:new e}static getDivider(t){let s=1e3;return"ms"===t&&(s=1),"ns"===t&&(s=1e6),s}}r.LOG=new t(r),r.formatLabel=(t=>{const s=t.split("{");let e=`<span class="gtsInfo"><span class='gts-classname'>${s[0]}</span>`;if(s.length>1){e+="<span class='gts-separator'>{</span>";const t=s[1].substr(0,s[1].length-1).split(",");t.length>0&&t.forEach((s,r)=>{const a=s.split("=");s.length>1&&(e+=`<span><span class='gts-labelname'>${a[0]}</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>${a[1]}</span>`,r!==t.length-1&&(e+="<span>, </span>"))}),e+="<span class='gts-separator'>}</span>"}if(s.length>2){e+="<span class='gts-separator'>{</span>";const t=s[2].substr(0,s[2].length-1).split(",");t.length>0&&t.forEach((s,r)=>{const a=s.split("=");s.length>1&&(e+=`<span><span class='gts-attrname'>${a[0]}</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>${a[1]}</span>`,r!==t.length-1&&(e+="<span>, </span>"))}),e+="<span class='gts-separator'>}</span>"}return e+="</span>"});export{r as a,t as b,e as c};