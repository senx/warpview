/*!
 * warpview: Core, es5
 * Built with http://stenciljs.com
 */
function n(n,t){return"sc-"+n.n+(t&&t!==c?"-"+t:"")}function t(n,t){return n+(t?"-h":"-s")}function e(n,t){for(var e,r,i=null,o=!1,u=!1,f=arguments.length;f-- >2;)j.push(arguments[f]);for(;j.length>0;){var c=j.pop();if(c&&void 0!==c.pop)for(f=c.length;f--;)j.push(c[f]);else"boolean"==typeof c&&(c=null),(u="function"!=typeof n)&&(null==c?c="":"number"==typeof c?c=String(c):"string"!=typeof c&&(u=!1)),u&&o?i[i.length-1].vtext+=c:null===i?i=[u?{vtext:c}:c]:i.push(u?{vtext:c}:c),o=u}if(null!=t){if(t.className&&(t.class=t.className),"object"==typeof t.class){for(f in t.class)t.class[f]&&j.push(f);t.class=j.join(" "),j.length=0}null!=t.key&&(e=t.key),null!=t.name&&(r=t.name)}return"function"==typeof n?n(t,i||[],k):{vtag:n,vchildren:i,vtext:void 0,vattrs:t,vkey:e,vname:r,t:void 0,e:!1}}function r(n,t,e){void 0===e&&(e={});var r=Array.isArray(t)?t:[t],i=n.document,o=e.hydratedCssClass||"hydrated",u=e.exclude;u&&(r=r.filter(function(n){return-1===u.indexOf(n[0])}));var c=r.map(function(n){return n[0]});if(c.length>0){var a=i.createElement("style");a.innerHTML=c.join()+"{visibility:hidden}."+o+"{visibility:inherit}",a.setAttribute("data-styles",""),i.head.insertBefore(a,i.head.firstChild)}var s=e.namespace||"warpview";return D||(D=!0,function l(n,t,e){(n["s-apps"]=n["s-apps"]||[]).push(t),e.componentOnReady||(e.componentOnReady=function t(){function e(t){if(r.nodeName.indexOf("-")>0){for(var e=n["s-apps"],i=0,o=0;o<e.length;o++)if(n[e[o]].componentOnReady){if(n[e[o]].componentOnReady(r,t))return;i++}if(i<e.length)return void(n["s-cr"]=n["s-cr"]||[]).push([r,t])}t(null)}var r=this;return n.Promise?new n.Promise(e):{then:e}})}(n,s,n.HTMLElement.prototype)),applyPolyfills(n).then(function(){function t(){r.forEach(function(t){var e;!function r(n){return/\{\s*\[native code\]\s*\}/.test(""+n)}(n.customElements.define)?(e=function(t){return n.HTMLElement.call(this,t)}).prototype=Object.create(n.HTMLElement.prototype,{constructor:{value:e,configurable:!0}}):e=new Function("w","return class extends w.HTMLElement{}")(n),L[s].r(function i(n){var t=$(n),e=t.i,r=d(n[0]);return t.i=function(n){var t=n.mode,i=n.scoped;return function o(n,t,e){return import(
/* webpackInclude: /\.entry\.js$/ */
/* webpackMode: "lazy" */
"./build/"+n+(t?".sc":"")+".entry.js").then(function(n){return n[e]})}("string"==typeof e?e:e[t],i,r)},t}(t),e)})}if(!L[s]){var u={},c=e.resourcesUrl||"./";f(s,u,n,i,c,o),L[s]=R(s,u,n,i,c,o,r)}if(window.customStyleShim)return L[s].o=window.customStyleShim,L[s].o.initShim().then(t);t()})}this&&this.u;var i=this&&this.f||function(n,t,e,r){return new(e||(e=Promise))(function(i,o){function u(n){try{c(r.c(n))}catch(n){o(n)}}function f(n){try{c(r.throw(n))}catch(n){o(n)}}function c(n){n.a?i(n.value):new e(function(t){t(n.value)}).then(u,f)}c((r=r.apply(n,t||[])).c())})},o=this&&this.s||function(n,t){function e(e){return function(u){return function c(e){if(r)throw new TypeError("Generator is already executing.");for(;f;)try{if(r=1,i&&(o=2&e[0]?i.return:e[0]?i.throw||((o=i.return)&&o.call(i),0):i.c)&&!(o=o.call(i,e[1])).a)return o;switch(i=0,o&&(e=[2&e[0],o.value]),e[0]){case 0:case 1:o=e;break;case 4:return f.l++,{value:e[1],a:!1};case 5:f.l++,i=e[1],e=[0];continue;case 7:e=f.v.pop(),f.p.pop();continue;default:if(!(o=(o=f.p).length>0&&o[o.length-1])&&(6===e[0]||2===e[0])){f=0;continue}if(3===e[0]&&(!o||e[1]>o[0]&&e[1]<o[3])){f.l=e[1];break}if(6===e[0]&&f.l<o[1]){f.l=o[1],o=e;break}if(o&&f.l<o[2]){f.l=o[2],f.v.push(e);break}o[2]&&f.v.pop(),f.p.pop();continue}e=t.call(n,f)}catch(n){e=[6,n],i=0}finally{r=o=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,a:!0}}([e,u])}}var r,i,o,u,f={l:0,d:function(){if(1&o[0])throw o[1];return o[1]},p:[],v:[]};return u={c:e(0),throw:e(1),return:e(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u},u=this,f=function(){};function applyPolyfills(n){n.y=function(){function t(){var n=setTimeout;return function(){return n(e,1)}}function e(){for(var n=0;n<b;n+=2)(0,S[n])(S[n+1]),S[n]=void 0,S[n+1]=void 0;b=0}function r(n,t){var e=this,r=new this.constructor(o);void 0===r[_]&&h(r);var i=e.w;if(i){var u=arguments[i-1];M(function(){return d(i,r,u,e.b)})}else v(e,r,n,t);return r}function i(n){if(n&&"object"==typeof n&&n.constructor===this)return n;var t=new this(o);return c(t,n),t}function o(){}function u(n){try{return n.then}catch(n){return P.error=n,P}}function f(n,t,e){t.constructor===n.constructor&&e===r&&t.constructor.resolve===i?function(n,t){t.w===T?s(n,t.b):t.w===W?l(n,t.b):v(t,void 0,function(t){return c(n,t)},function(t){return l(n,t)})}(n,t):e===P?(l(n,P.error),P.error=null):void 0===e?s(n,t):"function"==typeof e?function(n,t,e){M(function(n){var r=!1,i=function(n,t,e,r){try{n.call(t,e,r)}catch(n){return n}}(e,t,function(e){r||(r=!0,t!==e?c(n,e):s(n,e))},function(t){r||(r=!0,l(n,t))},n.m);!r&&i&&(r=!0,l(n,i))},n)}(n,t,e):s(n,t)}function c(n,t){if(n===t)l(n,new TypeError("cannot resolve promise w/ itself"));else{var e=typeof t;null===t||"object"!==e&&"function"!==e?s(n,t):f(n,t,u(t))}}function a(n){n.g&&n.g(n.b),p(n)}function s(n,t){n.w===x&&(n.b=t,n.w=T,0!==n.M.length&&M(p,n))}function l(n,t){n.w===x&&(n.w=W,n.b=t,M(a,n))}function v(n,t,e,r){var i=n.M,o=i.length;n.g=null,i[o]=t,i[o+T]=e,i[o+W]=r,0===o&&n.w&&M(p,n)}function p(n){var t=n.M,e=n.w;if(0!==t.length){for(var r,i,o=n.b,u=0;u<t.length;u+=3)r=t[u],i=t[u+e],r?d(e,r,i,o):i(o);n.M.length=0}}function d(n,t,e,r){var i="function"==typeof e,o=void 0,u=void 0,f=void 0,a=void 0;if(i){try{o=e(r)}catch(n){P.error=n,o=P}if(o===P?(a=!0,u=o.error,o.error=null):f=!0,t===o)return void l(t,new TypeError("Cannot return same promise"))}else o=r,f=!0;t.w===x&&(i&&f?c(t,o):a?l(t,u):n===T?s(t,o):n===W&&l(t,o))}function h(n){n[_]=N++,n.w=void 0,n.b=void 0,n.M=[]}var y,w=Array.isArray?Array.isArray:function(n){return"[object Array]"===Object.prototype.toString.call(n)},b=0,m=void 0,g=void 0,M=function(n,t){S[b]=n,S[b+1]=t,2===(b+=2)&&(g?g(e):O())},j=(y=void 0!==n?n:void 0)||{},k=j.j||j.k;j="undefined"==typeof self;var $,A,E,C="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,S=Array(1e3),O=void 0;O=k?($=0,A=new k(e),E=document.createTextNode(""),A.observe(E,{characterData:!0}),function(){E.data=$=++$%2}):C?function(){var n=new MessageChannel;return n.A.onmessage=e,function(){return n.C.postMessage(0)}}():void 0===y&&"function"==typeof require?function(){try{var n=Function("return this")().S("vertx");return void 0!==(m=n.O||n._)?function(){m(e)}:t()}catch(n){return t()}}():t();var _=Math.random().toString(36).substring(2),x=void 0,T=1,W=2,P={error:null},N=0,R=function(){function n(n,t){this.x=n,this.T=new n(o),this.T[_]||h(this.T),w(t)?(this.W=this.length=t.length,this.b=Array(this.length),0===this.length?s(this.T,this.b):(this.length=this.length||0,this.P(t),0===this.W&&s(this.T,this.b))):l(this.T,Error("Array Methods must be provided an Array"))}return n.prototype.P=function(n){for(var t=0;this.w===x&&t<n.length;t++)this.N(n[t],t)},n.prototype.N=function(n,t){var e=this.x,c=e.resolve;c===i?(c=u(n))===r&&n.w!==x?this.R(n.w,t,n.b):"function"!=typeof c?(this.W--,this.b[t]=n):e===L?(f(e=new e(o),n,c),this.L(e,t)):this.L(new e(function(t){return t(n)}),t):this.L(c(n),t)},n.prototype.R=function(n,t,e){var r=this.T;r.w===x&&(this.W--,n===W?l(r,e):this.b[t]=e),0===this.W&&s(r,this.b)},n.prototype.L=function(n,t){var e=this;v(n,void 0,function(n){return e.R(T,t,n)},function(n){return e.R(W,t,n)})},n}(),L=function(){function n(t){if(this[_]=N++,this.b=this.w=void 0,this.M=[],o!==t){if("function"!=typeof t)throw new TypeError("Must pass a resolver fn as 1st arg");if(!(this instanceof n))throw new TypeError("Failed to construct 'Promise': Use the 'new' operator.");!function(n,t){try{t(function(t){c(n,t)},function(t){l(n,t)})}catch(t){l(n,t)}}(this,t)}}return n.prototype.catch=function(n){return this.then(null,n)},n.prototype.finally=function(n){var t=this.constructor;return this.then(function(e){return t.resolve(n()).then(function(){return e})},function(e){return t.resolve(n()).then(function(){throw e})})},n}();return L.prototype.then=r,L.all=function(n){return new R(this,n).T},L.race=function(n){var t=this;return w(n)?new t(function(e,r){for(var i=n.length,o=0;o<i;o++)t.resolve(n[o]).then(e,r)}):new t(function(n,t){return t(new TypeError("Must pass array to race"))})},L.resolve=i,L.reject=function(n){var t=new this(o);return l(t,n),t},L.D=function(n){g=n},L.F=function(n){M=n},L.H=M,L.q=function(){var n=void 0;if("undefined"!=typeof global)n=global;else if("undefined"!=typeof self)n=self;else try{n=Function("return this")()}catch(n){throw Error("polyfill failed")}var t=n.Promise;if(t){var e=null;try{e=Object.prototype.toString.call(t.resolve())}catch(n){}if("[object Promise]"===e&&!t.U)return}n.Promise=L},L.Promise=L,L.q(),L}();var t=[];return n.customElements&&(!n.Element||n.Element.prototype.closest&&n.Element.prototype.matches&&n.Element.prototype.remove)||t.push(import("./polyfills/dom.js")),"function"==typeof Object.assign&&Object.entries||t.push(import("./polyfills/object.js")),Array.prototype.find&&Array.prototype.includes||t.push(import("./polyfills/array.js")),String.prototype.startsWith&&String.prototype.endsWith||t.push(import("./polyfills/string.js")),n.fetch||t.push(import("./polyfills/fetch.js")),"undefined"!=typeof WeakMap&&n.CSS&&n.CSS.supports&&n.CSS.supports("color","var(--c)")||t.push(import("./polyfills/css-shim.js")),function e(){try{var n=new URL("b","http://a");return n.pathname="c%20d","http://a/c%20d"===n.href&&n.B}catch(n){return!1}}||t.push(import("./polyfills/url.js")),Promise.all(t).then(function(t){t.forEach(function(t){try{t.applyPolyfill(n,n.document)}catch(n){console.error(n)}})})}var c="$",a={},s={enter:13,escape:27,space:32,tab:9,left:37,up:38,right:39,down:40},l=function(t,e,r,i){var o=r.n+c,u=r[o];if((2===r.I||1===r.I&&!t.Q.G)&&(i["s-sc"]=u?n(r,i.mode):n(r)),u){var f=e.Y.head;if(e.G)if(1===r.I)f=i.shadowRoot;else{var a=i.getRootNode();a.host&&(f=a)}var s=t.Z.get(f);if(s||t.Z.set(f,s={}),!s[o]){var l=void 0;if(t.o?l=t.o.createHostStyle(i,o,u):((l=e.z("style")).innerHTML=u,s[o]=!0),l){var v=f.querySelectorAll("[data-styles]");e.J(f,l,v.length&&v[v.length-1].nextSibling||f.firstChild)}}}},v=function(n){return null!=n},p=function(n){return n.toLowerCase()},d=function(n){return p(n).split("-").map(function(n){return n.charAt(0).toUpperCase()+n.slice(1)}).join("")},h=function(){},y=function(n,t,e,r,i,o){if("class"!==e||o)if("style"===e){for(var u in r)i&&null!=i[u]||(/-/.test(u)?t.style.removeProperty(u):t.style[u]="");for(var u in i)r&&i[u]===r[u]||(/-/.test(u)?t.style.setProperty(u,i[u]):t.style[u]=i[u])}else if("o"!==e[0]||"n"!==e[1]||!/[A-Z]/.test(e[2])||e in t)if("list"!==e&&"type"!==e&&!o&&(e in t||-1!==["object","function"].indexOf(typeof i)&&null!==i)){var f=n.K(t);f&&f.V&&f.V[e]?b(t,e,i):"ref"!==e&&(b(t,e,null==i?"":i),null!=i&&!1!==i||n.Q.X(t,e))}else null!=i&&"key"!==e?function(n,t,e,r,i){void 0===r&&(r="boolean"==typeof e),i=t!==(t=t.replace(/^xlink\:?/,"")),null==e||r&&(!e||"false"===e)?i?n.removeAttributeNS("http://www.w3.org/1999/xlink",p(t)):n.removeAttribute(t):"function"!=typeof e&&(e=r?"":e.toString(),i?n.setAttributeNS("http://www.w3.org/1999/xlink",p(t),e):n.setAttribute(t,e))}(t,e,i):(o||n.Q.nn(t,e)&&(null==i||!1===i))&&n.Q.X(t,e);else e=p(e)in t?p(e.substring(2)):p(e[2])+e.substring(3),i?i!==r&&n.Q.tn(t,e,i):n.Q.en(t,e);else if(r!==i){var c=w(r),a=w(i),s=c.filter(function(n){return!a.includes(n)}),l=w(t.className).filter(function(n){return!s.includes(n)}),v=a.filter(function(n){return!c.includes(n)&&!l.includes(n)});l.push.apply(l,v),t.className=l.join(" ")}},w=function(n){return null==n||""===n?[]:n.trim().split(/\s+/)},b=function(n,t,e){try{n[t]=e}catch(n){}},m=function(n,t,e,r,i){var o=11===e.t.nodeType&&e.t.host?e.t.host:e.t,u=t&&t.vattrs||a,f=e.vattrs||a;for(i in u)f&&null!=f[i]||null==u[i]||y(n,o,i,u[i],void 0,r,e.e);for(i in f)i in u&&f[i]===("value"===i||"checked"===i?o[i]:u[i])||y(n,o,i,u[i],f[i],r,e.e)},g=!1,M=function(n,t){n&&(n.vattrs&&n.vattrs.ref&&n.vattrs.ref(t?null:n.t),n.vchildren&&n.vchildren.forEach(function(n){M(n,t)}))},j=[],k={forEach:function(n,t){return n.forEach(t)},map:function(n,t){return n.map(t)}},$=function(n,t,e){var r=n[0],i=n[1],o=n[3],u=n[4],f=n[5],c={color:{rn:"color"}};if(o)for(t=0;t<o.length;t++)c[(e=o[t])[0]]={in:e[1],on:!!e[2],rn:"string"==typeof e[3]?e[3]:e[3]?e[0]:0,un:e[4]};return{n:r,i:i,V:Object.assign({},c),I:u,fn:f?f.map(A):void 0}},A=function(n){return{cn:n[0],an:n[1],sn:!!n[2],ln:!!n[3],vn:!!n[4]}},E=function(n,t){return v(t)&&"object"!=typeof t&&"function"!=typeof t?n===Boolean||4===n?"false"!==t&&(""===t||!!t):n===Number||8===n?parseFloat(t):n===String||2===n?t.toString():t:t},C=function(n,t,e){n.pn.add(t),n.dn.has(t)||(n.dn.set(t,!0),n.hn?n.queue.write(function(){return S(n,t,e)}):n.queue.tick(function(){return S(n,t,e)}))},S=function(n,r,f,c,a,s){return i(u,void 0,void 0,function(){var i,u;return o(this,function(o){switch(o.l){case 0:if(n.dn.delete(r),n.yn.has(r))return[3,12];if(a=n.wn.get(r))return[3,6];if((s=n.bn.get(r))&&!s["s-rn"])return(s["s-rc"]=s["s-rc"]||[]).push(function(){S(n,r,f)}),[2];if(!(a=W(n,r,n.mn.get(r),f)))return[3,5];o.l=1;case 1:return o.p.push([1,4,,5]),a.componentWillLoad?[4,a.componentWillLoad()]:[3,3];case 2:o.d(),o.l=3;case 3:return[3,5];case 4:return i=o.d(),n.gn(i,3,r),[3,5];case 5:case 6:return[3,11];case 7:return o.p.push([7,10,,11]),a.componentWillUpdate?[4,a.componentWillUpdate()]:[3,9];case 8:o.d(),o.l=9;case 9:return[3,11];case 10:return u=o.d(),n.gn(u,5,r),[3,11];case 11:(function(n,r,i,o){try{var u=r.Mn.host,f=r.Mn.encapsulation,c="shadow"===f&&n.Q.G,a=i;if(c&&(a=i.shadowRoot),!i["s-rn"]){n.jn(n,n.Q,r,i);var s=i["s-sc"];s&&(n.Q.kn(i,t(s,!0)),"scoped"===f&&n.Q.kn(i,t(s)))}if(o.render||o.hostData||u){n.$n=!0;var l=o.render&&o.render();n.$n=!1;var v=e(null,void 0,l),p=n.An.get(i)||{};p.t=a,n.An.set(i,n.render(i,p,v,c,f))}n.o&&n.o.updateHost(i),i["s-rn"]=!0,i["s-rc"]&&(i["s-rc"].forEach(function(n){return n()}),i["s-rc"]=null)}catch(t){n.$n=!1,n.gn(t,8,i,!0)}})(n,n.K(r),r,a),r["s-init"](),o.l=12;case 12:return[2]}})})},O=function(n,t,e,r,i,o,u){(u=n.En.get(t))||n.En.set(t,u={});var f=u[e];if(r!==f&&(u[e]=r,o=n.wn.get(t))){var c=u[T+e];if(c)for(var a=0;a<c.length;a++)try{o[c[a]].call(o,r,f,e)}catch(n){console.error(n)}!n.$n&&t["s-rn"]&&C(n,t,i)}},_=function(n,t,e){Object.defineProperty(n,t,{configurable:!0,value:e})},x=function(n,t,e,r){Object.defineProperty(n,t,{configurable:!0,get:e,set:r})},T="wc-",W=function(n,t,e,r,i,o,u,f){try{i=new(o=n.K(t).Mn),function(n,t,e,r,i,o){n.Cn.set(r,e),n.En.has(e)||n.En.set(e,{}),Object.entries(Object.assign({color:{type:String}},t.properties,{mode:{type:String}})).forEach(function(t){var u=t[0],f=t[1];(function(n,t,e,r,i,o,u,f,c){if(t.type||t.state){var a=n.En.get(e);t.state||(!t.attr||void 0!==a[i]&&""!==a[i]||(f=o&&o.Sn)&&v(c=f[t.attr])&&(a[i]=E(t.type,c)),e.hasOwnProperty(i)&&(void 0===a[i]&&(a[i]=E(t.type,e[i])),"mode"!==i&&delete e[i])),r.hasOwnProperty(i)&&void 0===a[i]&&(a[i]=r[i]),t.watchCallbacks&&(a[T+i]=t.watchCallbacks.slice()),x(r,i,function s(t){return(t=n.En.get(n.Cn.get(this)))&&t[i]},function l(e,r){(r=n.Cn.get(this))&&(t.state||t.mutable)&&O(n,r,i,e,u)})}else t.elementRef?_(r,i,e):t.method&&_(e,i,r[i].bind(r))})(n,f,e,r,u,i,o)})}(n,o,t,i,e,r),function c(n,t,e){if(t){var r=n.Cn.get(e);t.forEach(function(t){e[t.method]={emit:function(e){return n.On(r,t.name,{bubbles:t.bubbles,composed:t.composed,cancelable:t.cancelable,detail:e})}}})}}(n,o.events,i);try{if(u=n._n.get(t)){for(f=0;f<u.length;f+=2)i[u[f]](u[f+1]);n._n.delete(t)}}catch(e){n.gn(e,2,t)}}catch(e){i={},n.gn(e,7,t,!0)}return n.wn.set(t,i),i},P=function(n,t){for(var e=0;e<t.childNodes.length;e++){var r=t.childNodes[e];if(1===r.nodeType){if(n.K(r)&&!n.xn.has(r))return!1;if(!P(n,r))return!1}}return!0},N=function(n,t,e,r,i,o){if(n.pn.delete(t),(i=n.bn.get(t))&&((r=i["s-ld"])&&((e=r.indexOf(t))>-1&&r.splice(e,1),r.length||i["s-init"]&&i["s-init"]()),n.bn.delete(t)),n.Tn.length&&!n.pn.size)for(;o=n.Tn.shift();)o()},R=function(n,t,r,i,o,u){var f=r.performance,a={html:{}},d=r[n]=r[n]||{},y=function(n,t,e){var r=new WeakMap,i={Y:e,G:!!e.documentElement.attachShadow,Wn:!1,Pn:function(n){return n.nodeType},z:function(n){return e.createElement(n)},Nn:function(n,t){return e.createElementNS(n,t)},Rn:function(n){return e.createTextNode(n)},Ln:function(n){return e.createComment(n)},J:function(n,t,e){return n.insertBefore(t,e)},Dn:function(n){return n.remove()},Fn:function(n,t){return n.appendChild(t)},kn:function(n,t){if(n.classList)n.classList.add(t);else if("svg"===n.nodeName.toLowerCase()){var e=n.getAttribute("class")||"";e.split(" ").includes(t)||(e+=" "+t),n.setAttribute("class",e.trim())}},Hn:function(n){return n.childNodes},qn:function(n){return n.parentNode},Un:function(n){return n.nextSibling},Bn:function(n){return n.previousSibling},In:function(n){return p(n.nodeName)},Gn:function(n){return n.textContent},Qn:function(n,t){return n.textContent=t},Yn:function(n,t){return n.getAttribute(t)},Zn:function(n,t,e){return n.setAttribute(t,e)},X:function(n,t){return n.removeAttribute(t)},nn:function(n,t){return n.hasAttribute(t)},zn:function(t){return t.getAttribute("mode")||(n.Context||{}).mode},Jn:function(n,r){return"child"===r?n.firstElementChild:"parent"===r?i.Kn(n):"body"===r?e.body:"document"===r?e:"window"===r?t:n},tn:function(t,e,o,u,f,c,a,l,v){var p=t,d=o,h=r.get(t);v=e,h&&h[v]&&h[v](),"string"==typeof c?p=i.Jn(t,c):"object"==typeof c?p=c:(l=e.split(":")).length>1&&(p=i.Jn(t,l[0]),e=l[1]),p&&((l=e.split(".")).length>1&&(e=l[0],d=function(n){n.keyCode===s[l[1]]&&o(n)}),a=i.Wn?{capture:!!u,passive:!!f}:!!u,n.ael(p,e,d,a),h||r.set(t,h={}),h[v]=function(){p&&n.rel(p,e,d,a),h[v]=null})},en:function(n,t,e){(e=r.get(n))&&(t?e[t]&&e[t]():Object.keys(e).forEach(function(n){e[n]&&e[n]()}))},Vn:function(n,e,r,i){return i=new t.CustomEvent(e,r),n&&n.dispatchEvent(i),i},Kn:function(n,t){return(t=i.qn(n))&&11===i.Pn(t)?t.host:t},Xn:function(n,t,e,r){return n.setAttributeNS(t,e,r)},nt:function(n,t){return n.attachShadow(t)}};"function"!=typeof t.CustomEvent&&(t.CustomEvent=function(n,t,r){return t=t||{},(r=e.createEvent("CustomEvent")).initCustomEvent(n,t.bubbles,t.cancelable,t.detail),r},t.CustomEvent.prototype=t.Event.prototype),n.ael||(n.ael=function(n,t,e,r){return n.addEventListener(t,e,r)},n.rel=function(n,t,e,r){return n.removeEventListener(t,e,r)});try{t.addEventListener("e",null,Object.defineProperty({},"passive",{get:function(){return i.Wn=!0}}))}catch(n){}return i}(d,r,i),w=y.Y.documentElement,b=r["s-defined"]=r["s-defined"]||{},j={Q:y,r:function(n,t){r.customElements.get(n.n)||(function(n,t,e,r,i){if(e.connectedCallback=function(){(function(n,t,e){n.tt.has(e)||(n.tt.set(e,!0),function r(n,t){var e=n.K(t);e.fn&&e.fn.forEach(function(e){e.sn||n.Q.tn(t,e.cn,function r(n,t,e,i){return function(r){(i=n.wn.get(t))?i[e](r):((i=n._n.get(t)||[]).push(e,r),n._n.set(t,i))}}(n,t,e.an),e.vn,e.ln)})}(n,e)),n.yn.delete(e),n.xn.has(e)||(n.et=!0,n.pn.add(e),n.xn.set(e,!0),function(n,t,e){for(e=t;e=n.Q.Kn(e);)if(n.rt(e)){n.it.has(t)||(n.bn.set(t,e),(e["s-ld"]=e["s-ld"]||[]).push(t));break}}(n,e),n.queue.tick(function(){n.mn.set(e,function(n,t,e,r,i){return e.mode||(e.mode=n.zn(e)),e["s-cr"]||n.Yn(e,"ssrv")||n.G&&1===t.I||(e["s-cr"]=n.Rn(""),e["s-cr"]["s-cn"]=!0,n.J(e,e["s-cr"],n.Hn(e)[0])),n.G||1!==t.I||!window.HTMLElement||"shadowRoot"in window.HTMLElement.prototype||(e.shadowRoot=e),1===t.I&&n.G&&!e.shadowRoot&&n.nt(e,{mode:"open"}),r={Sn:{}},t.V&&Object.keys(t.V).forEach(function(o){(i=t.V[o].rn)&&(r.Sn[i]=n.Yn(e,i))}),r}(n.Q,t,e)),n.ot(t,e)}))})(n,t,this)},e.disconnectedCallback=function(){(function(n,t){!n.ut&&function(n,t){for(;t;){if(!n.qn(t))return 9!==n.Pn(t);t=n.qn(t)}}(n.Q,t)&&(n.yn.set(t,!0),N(n,t),M(n.An.get(t),!0),n.Q.en(t),n.tt.delete(t),n.o&&n.o.removeHost(t),[n.bn,n.ft,n.mn].forEach(function(n){return n.delete(t)}))})(n,this)},e["s-init"]=function(){(function(n,t,e,r,i,o,u){if(P(n,t)&&(i=n.wn.get(t))&&!n.yn.has(t)&&(!t["s-ld"]||!t["s-ld"].length)){n.it.set(t,!0),(u=n.ct.has(t))||(n.ct.set(t,!0),t["s-ld"]=void 0,n.Q.kn(t,e));try{M(n.An.get(t)),(o=n.ft.get(t))&&(o.forEach(function(n){return n(t)}),n.ft.delete(t)),!u&&i.componentDidLoad&&i.componentDidLoad()}catch(e){n.gn(e,4,t)}N(n,t)}})(n,this,r)},e.forceUpdate=function(){C(n,this,i)},t.V){var o=Object.entries(t.V),u={};o.forEach(function(n){var t=n[0],e=n[1].rn;e&&(u[e]=t)}),u=Object.assign({},u),e.attributeChangedCallback=function(n,t,e){(function r(n,t,e,i){var o=n[p(e)];o&&(t[o]=i)})(u,this,n,e)},function(n,t,e,r){o.forEach(function(t){var i=t[0],o=t[1],u=o.in;3&u?x(e,i,function t(){return(n.En.get(this)||{})[i]},function t(e){O(n,this,i,E(o.un,e),r)}):32===u&&_(e,i,h)})}(n,0,e,i)}}(j,a[n.n]=n,t.prototype,u,f),t.observedAttributes=Object.values(n.V).map(function(n){return n.rn}).filter(function(n){return!!n}),r.customElements.define(n.n,t))},K:function(n){return a[y.In(n)]},at:function(n){return t[n]},isClient:!0,rt:function(n){return!(!b[y.In(n)]&&!j.K(n))},gn:function(n,t,e){return console.error(n,t,e&&e.tagName)},queue:t.queue=function(n,t){var e=0,r=!1,i=function(){return t.performance.now()},o=!1!==n.asyncQueue,u=Promise.resolve(),f=[],c=[],a=[],s=[],l=function(t){return function(e){t.push(e),r||(r=!0,n.raf(d))}},v=function(n){for(var t=0;t<n.length;t++)try{n[t](i())}catch(n){console.error(n)}n.length=0},p=function(n,t){for(var e,r=0;r<n.length&&(e=i())<t;)try{n[r++](e)}catch(n){console.error(n)}r===n.length?n.length=0:0!==r&&n.splice(0,r)},d=function(){e++,v(c);var t=o?i()+7*Math.ceil(e*(1/22)):Infinity;p(a,t),p(s,t),a.length>0&&(s.push.apply(s,a),a.length=0),(r=c.length+a.length+s.length>0)?n.raf(d):e=0};return n.raf||(n.raf=t.requestAnimationFrame.bind(t)),{tick:function(n){f.push(n),1===f.length&&u.then(function(){return v(f)})},read:l(c),write:l(a)}}(d,r),ot:function(n,t){var e=!y.G,r={mode:t.mode,scoped:e};n.i(r).then(function(e){try{n.Mn=e,function r(n,t,e,i,o){if(i){var u=t.n+(o||c);t[u]||(t[u]=i)}}(0,n,n.I,e.style,e.styleMode)}catch(t){console.error(t),n.Mn=function i(){}}C(j,t,f)})},$n:!1,hn:!1,ut:!1,jn:l,bn:new WeakMap,Z:new WeakMap,xn:new WeakMap,tt:new WeakMap,ct:new WeakMap,it:new WeakMap,Cn:new WeakMap,mn:new WeakMap,wn:new WeakMap,yn:new WeakMap,dn:new WeakMap,ft:new WeakMap,_n:new WeakMap,An:new WeakMap,En:new WeakMap,pn:new Set,Tn:[]};return t.isServer=t.isPrerender=!(t.isClient=!0),t.window=r,t.location=r.location,t.document=i,t.resourcesUrl=t.publicPath=o,t.enableListener=function(n,t,e,r,i){return function o(n,t,e,r,i,u){if(t){var f=n.Cn.get(t),c=n.K(f);if(c&&c.fn)if(r){var a=c.fn.find(function(n){return n.cn===e});a&&n.Q.tn(f,e,function(n){return t[a.an](n)},a.vn,void 0===u?a.ln:!!u,i)}else n.Q.en(f,e)}}(j,n,t,e,r,i)},j.On=t.emit=function(n,e,r){return y.Vn(n,t.eventNameFn?t.eventNameFn(e):e,r)},d.h=e,d.Context=t,d.onReady=function(){return new Promise(function(n){return j.queue.write(function(){return j.pn.size?j.Tn.push(n):n()})})},j.render=function(n,t){var e,r,i,o,u,f,c,a=function(i,l,p,d,h,y,w,b,M){if(b=l.vchildren[p],e||(o=!0,"slot"===b.vtag&&(r&&t.kn(d,r+"-s"),b.vchildren?b.st=!0:b.lt=!0)),v(b.vtext))b.t=t.Rn(b.vtext);else if(b.lt)b.t=t.Rn("");else{if(y=b.t=g||"svg"===b.vtag?t.Nn("http://www.w3.org/2000/svg",b.vtag):t.z(b.st?"slot-fb":b.vtag),n.rt(y)&&n.it.delete(c),g="svg"===b.vtag||"foreignObject"!==b.vtag&&g,m(n,null,b,g),v(r)&&y["s-si"]!==r&&t.kn(y,y["s-si"]=r),b.vchildren)for(h=0;h<b.vchildren.length;++h)(w=a(i,b,h,y))&&t.Fn(y,w);"svg"===b.vtag&&(g=!1)}return b.t["s-hn"]=f,(b.st||b.lt)&&(b.t["s-sr"]=!0,b.t["s-cr"]=u,b.t["s-sn"]=b.vname||"",(M=i&&i.vchildren&&i.vchildren[p])&&M.vtag===b.vtag&&i.t&&s(i.t)),b.t},s=function(e,r,i,u){n.ut=!0;var c=t.Hn(e);for(i=c.length-1;i>=0;i--)(u=c[i])["s-hn"]!==f&&u["s-ol"]&&(t.Dn(u),t.J(y(u),u,h(u)),t.Dn(u["s-ol"]),u["s-ol"]=null,o=!0),r&&s(u,r);n.ut=!1},l=function(n,e,r,i,o,u,c,s){var l=n["s-cr"];for((c=l&&t.qn(l)||n).shadowRoot&&t.In(c)===f&&(c=c.shadowRoot);o<=u;++o)i[o]&&(s=v(i[o].vtext)?t.Rn(i[o].vtext):a(null,r,o,n))&&(i[o].t=s,t.J(c,s,h(e)))},p=function(n,e,r,o){for(;e<=r;++e)v(n[e])&&(o=n[e].t,i=!0,o["s-ol"]?t.Dn(o["s-ol"]):s(o,!0),t.Dn(o))},d=function(n,t){return n.vtag===t.vtag&&n.vkey===t.vkey&&("slot"!==n.vtag||n.vname===t.vname)},h=function(n){return n&&n["s-ol"]?n["s-ol"]:n},y=function(n){return t.qn(n["s-ol"]?n["s-ol"]:n)},w=function(e,r,i){var o=r.t=e.t,u=e.vchildren,f=r.vchildren;g=r.t&&v(t.Kn(r.t))&&void 0!==r.t.ownerSVGElement,g="svg"===r.vtag||"foreignObject"!==r.vtag&&g,v(r.vtext)?(i=o["s-cr"])?t.Qn(t.qn(i),r.vtext):e.vtext!==r.vtext&&t.Qn(o,r.vtext):("slot"!==r.vtag&&m(n,e,r,g),v(u)&&v(f)?function(n,e,r,i,o,u,f,c){for(var b=0,m=0,g=e.length-1,M=e[0],j=e[g],k=i.length-1,$=i[0],A=i[k];b<=g&&m<=k;)if(null==M)M=e[++b];else if(null==j)j=e[--g];else if(null==$)$=i[++m];else if(null==A)A=i[--k];else if(d(M,$))w(M,$),M=e[++b],$=i[++m];else if(d(j,A))w(j,A),j=e[--g],A=i[--k];else if(d(M,A))"slot"!==M.vtag&&"slot"!==A.vtag||s(t.qn(M.t)),w(M,A),t.J(n,M.t,t.Un(j.t)),M=e[++b],A=i[--k];else if(d(j,$))"slot"!==M.vtag&&"slot"!==A.vtag||s(t.qn(j.t)),w(j,$),t.J(n,j.t,M.t),j=e[--g],$=i[++m];else{for(o=null,u=b;u<=g;++u)if(e[u]&&v(e[u].vkey)&&e[u].vkey===$.vkey){o=u;break}v(o)?((c=e[o]).vtag!==$.vtag?f=a(e&&e[m],r,o,n):(w(c,$),e[o]=void 0,f=c.t),$=i[++m]):(f=a(e&&e[m],r,m,n),$=i[++m]),f&&t.J(y(M.t),f,h(M.t))}b>g?l(n,null==i[k+1]?null:i[k+1].t,r,i,m,k):m>k&&p(e,b,g)}(o,u,r,f):v(f)?(v(e.vtext)&&t.Qn(o,""),l(o,null,r,f,0,f.length-1)):v(u)&&p(u,0,u.length-1)),g&&"svg"===r.vtag&&(g=!1)},b=function(n,e,r,i,o,u,f,c){for(i=0,o=(r=t.Hn(n)).length;i<o;i++)if(e=r[i],1===t.Pn(e)){if(e["s-sr"])for(f=e["s-sn"],e.hidden=!1,u=0;u<o;u++)if(r[u]["s-hn"]!==e["s-hn"])if(c=t.Pn(r[u]),""!==f){if(1===c&&f===t.Yn(r[u],"slot")){e.hidden=!0;break}}else if(1===c||3===c&&""!==t.Gn(r[u]).trim()){e.hidden=!0;break}b(e)}},M=[],j=function(n,e,r,o,u,f,c,a,s,l){for(u=0,f=(e=t.Hn(n)).length;u<f;u++){if((r=e[u])["s-sr"]&&(o=r["s-cr"]))for(a=t.Hn(t.qn(o)),s=r["s-sn"],c=a.length-1;c>=0;c--)(o=a[c])["s-cn"]||o["s-nr"]||o["s-hn"]===r["s-hn"]||((3===(l=t.Pn(o))||8===l)&&""===s||1===l&&null===t.Yn(o,"slot")&&""===s||1===l&&t.Yn(o,"slot")===s)&&(M.some(function(n){return n.vt===o})||(i=!0,o["s-sn"]=s,M.push({pt:r,vt:o})));1===t.Pn(r)&&j(r)}};return function(a,s,l,v,p,d,h,y,m,g,k,$){if(c=a,f=t.In(c),u=c["s-cr"],e=v,r=c["s-sc"],o=i=!1,w(s,l),o){for(j(l.t),h=0;h<M.length;h++)(y=M[h]).vt["s-ol"]||((m=t.Rn(""))["s-nr"]=y.vt,t.J(t.qn(y.vt),y.vt["s-ol"]=m,y.vt));for(n.ut=!0,h=0;h<M.length;h++){for(y=M[h],k=t.qn(y.pt),$=t.Un(y.pt),m=y.vt["s-ol"];m=t.Bn(m);)if((g=m["s-nr"])&&g&&g["s-sn"]===y.vt["s-sn"]&&k===t.qn(g)&&(g=t.Un(g))&&g&&!g["s-nr"]){$=g;break}(!$&&k!==t.qn(y.vt)||t.Un(y.vt)!==$)&&y.vt!==$&&(t.Dn(y.vt),t.J(k,y.vt,$))}n.ut=!1}return i&&b(l.t),M.length=0,l}}(j,y),w["s-ld"]=[],w["s-rn"]=!0,w["s-init"]=function(){j.it.set(w,d.loaded=j.hn=!0),y.Vn(r,"appload",{detail:{namespace:n}})},function(n,t,e,r,i,o){if(t.componentOnReady=function(t,e){if(!t.nodeName.includes("-"))return e(null),!1;var r=n.K(t);if(r)if(n.it.has(t))e(t);else{var i=n.ft.get(t)||[];i.push(e),n.ft.set(t,i)}return!!r},i){for(o=i.length-1;o>=0;o--)t.componentOnReady(i[o][0],i[o][1])&&i.splice(o,1);for(o=0;o<r.length;o++)if(!e[r[o]].componentOnReady)return;for(o=0;o<i.length;o++)i[o][1](null);i.length=0}}(j,d,r,r["s-apps"],r["s-cr"]),d.initialized=!0,j},L={},D=!1;export{r as defineCustomElement,e as h};