/*! Built with http://stenciljs.com */
const{h:t}=window.warpview;class e{}class r{static cleanArray(t){return t.filter(t=>!!t)}static unique(t){let e={},r=[];for(let s=0,n=t.length;s<n;++s)e.hasOwnProperty(t[s])||(r.push(t[s]),e[t[s]]=1);return r}static isArray(t){return t&&"object"==typeof t&&t instanceof Array&&"number"==typeof t.length&&"function"==typeof t.splice&&!t.propertyIsEnumerable("length")}static isValidResponse(t){let e;try{e=JSON.parse(t)}catch(e){return console.error("Response non JSON compliant",t),!1}return!!r.isArray(e)||(console.error("Response isn't an Array",e),!1)}static isEmbeddedImage(t){return!("string"!=typeof t||!/^data:image/.test(t))}static isEmbeddedImageObject(t){return!(null===t||null===t.image||null===t.caption||!r.isEmbeddedImage(t.image))}static isPositionArray(t){if(!t||!t.positions)return!1;if(r.isPositionsArrayWithValues(t)||r.isPositionsArrayWithTwoValues(t))return!0;for(let e in t.positions){if(t.positions[e].length<2||t.positions[e].length>3)return!1;for(let r in t.positions[e])if("number"!=typeof t.positions[e][r])return!1}return!0}static isPositionsArrayWithValues(t){if(null===t||null===t.positions)return!1;for(let e in t.positions){if(3!==t.positions[e].length)return!1;for(let r in t.positions[e])if("number"!=typeof t.positions[e][r])return!1}return!0}static isPositionsArrayWithTwoValues(t){if(null===t||null===t.positions)return!1;for(let e in t.positions){if(4!==t.positions[e].length)return!1;for(let r in t.positions[e])if("number"!=typeof t.positions[e][r])return!1}return!0}static metricFromJSON(t){let e={ts:t[0],value:void 0,alt:void 0,lon:void 0,lat:void 0};switch(t.length){case 2:e.value=t[1];break;case 3:e.alt=t[1],e.value=t[2];break;case 4:e.lat=t[1],e.lon=t[2],e.value=t[3];break;case 5:e.lat=t[1],e.lon=t[2],e.alt=t[3],e.value=t[4]}return e}static gtsFromJSON(t,e){return{gts:{c:t.c,l:t.l,a:t.a,v:t.v,id:e}}}static gtsFromJSONList(t,e){let s,n=[];return(t||[]).forEach((t,o)=>{let a=t;t.gts&&(a=t.gts),s=void 0!==e&&""!==e?e+"-"+o:o,r.isArray(a)&&n.push(r.gtsFromJSONList(a,s)),r.isGts(a)&&n.push(r.gtsFromJSON(a,s)),r.isEmbeddedImage(a)&&n.push({image:a,caption:"Image",id:s}),r.isEmbeddedImageObject(a)&&n.push({image:a.image,caption:a.caption,id:s})}),{content:n||[]}}static flatDeep(t){return t.reduce((t,e)=>Array.isArray(e)?t.concat(r.flatDeep(e)):t.concat(e),[])}static flattenGtsIdArray(t,e){let s,n;for(e||(e=[]),n=0;n<t.content.length;n++)(s=t.content[n]).content?r.flattenGtsIdArray(s,e):s.gts&&e.push(s.gts);return e}static serializeGtsMetadata(t){let e=[];Object.keys(t.l).forEach(r=>{e.push(r+"="+t.l[r])});let r=[];return Object.keys(t.a).forEach(e=>{r.push(e+"="+t.a[e])}),t.c+"{"+e.join(",")+(r.length>0?",":"")+r.join(",")+"}"}static gtsToPath(t){let e=[];t.v=t.v.sort(function(t,e){return t[0]-e[0]});for(let r=0;r<t.v.length;r++){let s=t.v[r];s.length,s.length,4===s.length&&e.push({ts:Math.floor(s[0]/1e3),lat:s[1],lon:s[2],val:s[3]}),5===s.length&&e.push({ts:Math.floor(s[0]/1e3),lat:s[1],lon:s[2],elev:s[3],val:s[4]})}return e}static equalMetadata(t,e){if(!(void 0!==t.c&&void 0!==e.c&&void 0!==t.l&&void 0!==e.l&&t.l instanceof Object&&e.l instanceof Object))return console.error("[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed"),!1;if(t.c!==e.c)return!1;for(let r in t.l){if(!e.l.hasOwnProperty(r))return!1;if(t.l[r]!==e.l[r])return!1}for(let r in e.l)if(!t.l.hasOwnProperty(r))return!1;return!0}static isGts(t){return!(!t||null===t||null===t.c||null===t.l||null===t.a||null===t.v||!r.isArray(t.v))}static isGtsToPlot(t){if(!r.isGts(t)||0===t.v.length)return!1;for(let e=0;e<t.v.length;e++)if(null!==t.v[e][t.v[e].length-1]){if("number"==typeof t.v[e][t.v[e].length-1]||void 0!==t.v[e][t.v[e].length-1].constructor.prototype.toFixed)return!0;break}return!1}static isBooleanGts(t){if(!r.isGts(t)||0===t.v.length)return!1;for(let e=0;e<t.v.length;e++)if(null!==t.v[e][t.v[e].length-1]){if("boolean"!=typeof t.v[e][t.v[e].length-1])return!0;break}return!1}static isGtsToAnnotate(t){if(!r.isGts(t)||0===t.v.length)return!1;for(let e=0;e<t.v.length;e++)if(null!==t.v[e][t.v[e].length-1]){if("number"!=typeof t.v[e][t.v[e].length-1]&&t.v[e][t.v[e].length-1].constructor&&"Big"!==t.v[e][t.v[e].length-1].constructor.name&&void 0===t.v[e][t.v[e].length-1].constructor.prototype.toFixed)return!0;break}return!1}static gtsSort(t){t.isSorted||(t.v=t.v.sort(function(t,e){return t[0]-e[0]}),t.isSorted=!0)}static gtsTimeRange(t){return r.gtsSort(t),0===t.v.length?null:[t.v[0][0],t.v[t.v.length-1][0]]}static getData(t){return"string"==typeof t?{data:JSON.parse(t)}:t&&t.hasOwnProperty("data")?t:r.isArray(t)?{data:t}:new e}}class s{static getColor(t){return s.color[t%s.color.length]}static hexToRgb(t){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}static transparentize(t,e){return"rgba("+s.hexToRgb(t).concat(e).join(",")+")"}static generateColors(t){let e=[];for(let r=0;r<t;r++)e.push(s.getColor(r));return e}static generateTransparentColors(t){let e=[];for(let r=0;r<t;r++)e.push(s.transparentize(s.getColor(r),.5));return e}static hsvGradientFromRgbColors(t,e,r){let n=s.rgb2hsv(t.r,t.g,t.b),o=s.rgb2hsv(e.r,e.g,e.b);t.h=n[0],t.s=n[1],t.v=n[2],e.h=o[0],e.s=o[1],e.v=o[2];let a=s.hsvGradient(t,e,r);for(let t in a)a[t]&&(a[t].rgb=s.hsv2rgb(a[t].h,a[t].s,a[t].v),a[t].r=Math.floor(a[t].rgb[0]),a[t].g=Math.floor(a[t].rgb[1]),a[t].b=Math.floor(a[t].rgb[2]));return a}static rgb2hsv(t,e,r){let s,n,o,a=t/255,i=e/255,l=r/255,c=Math.max(a,i,l),u=c-Math.min(a,i,l);if(o=c,0===u)s=0,n=0;else switch(n=u/o,c){case a:s=(i-l+u*(i<l?6:0))/6*u;break;case i:s=(l-a+2*u)/6*u;break;case l:s=(a-i+4*u)/6*u}return[s,n,o]}static hsvGradient(t,e,r){let s=new Array(r),n=t.h>=e.h?t.h-e.h:1+t.h-e.h,o=t.h>=e.h?1+e.h-t.h:e.h-t.h;for(let a=0;a<r;a++){let i=o<=n?t.h+o*a/(r-1):t.h-n*a/(r-1);i<0&&(i=1+i),i>1&&(i-=1);let l=(1-a/(r-1))*t.s+a/(r-1)*e.s,c=(1-a/(r-1))*t.v+a/(r-1)*e.v;s[a]={h:i,s:l,v:c}}return s}static hsv2rgb(t,e,r){let s,n,o,a=Math.floor(6*t),i=6*t-a,l=r*(1-e),c=r*(1-i*e),u=r*(1-(1-i)*e);switch(a%6){case 0:s=r,n=u,o=l;break;case 1:s=c,n=r,o=l;break;case 2:s=l,n=r,o=u;break;case 3:s=l,n=c,o=r;break;case 4:s=u,n=l,o=r;break;case 5:s=r,n=l,o=c}return[255*s,255*n,255*o]}static rgb2hex(t,e,r){function s(t){let e=t.toString(16);return 1===e.length?"0"+e:e}return"#"+s(t)+s(e)+s(r)}}s.color=["#5899DA","#E8743B","#19A979","#ED4A7B","#945ECF","#13A4B4","#525DF4","#BF399E","#6C8893","#EE6868","#2F6497"];class n{constructor(t){this.className=t.name}log(t,e,r){const s=`[${this.className}] ${e.join(" - ")}`;switch(t){case o.DEBUG:break;case o.ERROR:console.error(s,r);break;case o.INFO:console.log(s,r);break;case o.WARN:console.warn(s,r);break;default:console.log(s,r)}}debug(t,e){this.log(o.DEBUG,t,e)}error(t,e){this.log(o.ERROR,t,e)}warn(t,e){this.log(o.WARN,t,e)}info(t,e){this.log(o.INFO,t,e)}}var o;!function(t){t[t.DEBUG=0]="DEBUG",t[t.ERROR=1]="ERROR",t[t.WARN=2]="WARN",t[t.INFO=3]="INFO"}(o||(o={}));export{r as a,s as b,n as c,e as d};