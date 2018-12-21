/*! Built with http://stenciljs.com */
warpview.loadBundle("r0z5gegn",["exports","./chunk-f60354b6.js","./chunk-643f8373.js","./chunk-7230806e.js"],function(t,e,i,n){var s=window.warpview.h,r=function(){},o=function(){function t(){this.gtsFilter="",this._node={selected:!0,gts:r},this.LOG=new n.Logger(t)}return t.prototype.onGtsFilter=function(t,i){i!==t&&""!==this.gtsFilter&&this.setState(new RegExp(this.gtsFilter,"gi").test(e.GTSLib.serializeGtsMetadata(this._node.gts)))},t.prototype.handleKeyDown=function(t){"a"===t.key&&this.setState(!0),"n"===t.key&&this.setState(!1)},t.prototype.colorizeChip=function(){var t=this.el.getElementsByClassName("normal")[0];this._node.selected?(t.style.setProperty("background-color",i.ColorLib.transparentize(i.ColorLib.getColor(this._node.gts.id))),t.style.setProperty("border-color",i.ColorLib.getColor(this._node.gts.id))):t.style.setProperty("background-color","#eeeeee")},t.prototype.componentWillLoad=function(){this._node=Object.assign({},this.node,{selected:!0})},t.prototype.componentDidLoad=function(){""!==this.gtsFilter&&new RegExp(this.gtsFilter,"gi").test(e.GTSLib.serializeGtsMetadata(this._node.gts))&&this.setState(!1),this.colorizeChip()},t.prototype.lastIndex=function(t,e){return t===this.toArray(e).length-1},t.prototype.toArray=function(t){return void 0===t?[]:Object.keys(t).map(function(e){return{name:e,value:t[e]}})},t.prototype.switchPlotState=function(t){return t.preventDefault(),this.setState(!this._node.selected),!1},t.prototype.setState=function(t){this._node=Object.assign({},this._node,{selected:t,label:e.GTSLib.serializeGtsMetadata(this._node.gts)}),this.LOG.debug(["switchPlotState"],this._node),this.colorizeChip(),this.warpViewSelectedGTS.emit(this._node)},t.prototype.render=function(){var t=this;return s("div",null,this._node&&this._node.gts&&this._node.gts.l?s("span",{onClick:function(e){return t.switchPlotState(e)}},s("i",{class:"normal"}),s("span",{class:"gtsInfo"},s("span",{class:"gts-classname"},"  ",this._node.gts.c),s("span",{class:"gts-separator",innerHTML:"&lcub; "}),this.toArray(this._node.gts.l).map(function(e,i){return s("span",null,s("span",{class:"gts-labelname"},e.name),s("span",{class:"gts-separator"},"="),s("span",{class:"gts-labelvalue"},e.value),s("span",{hidden:t.lastIndex(i,t._node.gts.l)},", "))}),s("span",{class:"gts-separator",innerHTML:" &rcub;"}),this.toArray(this._node.gts.a).length>0?s("span",null,s("span",{class:"gts-separator",innerHTML:"&lcub; "}),this.toArray(this._node.gts.a).map(function(e,i){return s("span",null,s("span",{class:"gts-attrname"},e.name),s("span",{class:"gts-separator"},"="),s("span",{class:"gts-attrvalue"},e.value),s("span",{hidden:t.lastIndex(i,t._node.gts.a)},", "))}),s("span",{class:"gts-separator",innerHTML:" &rcub;"})):"")):"")},Object.defineProperty(t,"is",{get:function(){return"warp-view-chip"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{el:{elementRef:!0},gtsFilter:{type:String,attr:"gts-filter",watchCallbacks:["onGtsFilter"]},name:{type:String,attr:"name"},node:{type:"Any",attr:"node"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"warpViewSelectedGTS",method:"warpViewSelectedGTS",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"document:keyup",method:"handleKeyDown"}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle}"},enumerable:!0,configurable:!0}),t}(),a=function(){function t(){this.gtsFilter="",this.options=new n.Param,this.hide=!1,this.gtsList=[],this._options=new n.Param,this.LOG=new n.Logger(t),this._isFolded=!1}return t.prototype.onData=function(t,e){t!==e&&this.doRender()},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this._isFolded=!!this.options.foldGTSTree,this.doRender())},t.prototype.onGtsFilter=function(t,e){e!==t&&(this.LOG.debug(["gtsFilter"],t),this.doRender(),this._options.foldGTSTree&&!this._isFolded&&this.foldAll())},t.prototype.componentWillLoad=function(){this.LOG.debug(["componentWillLoad","data"],this.data),this.data&&this.doRender()},t.prototype.doRender=function(){if(this._options=n.ChartLib.mergeDeep(this._options,this.options),this.data){this.LOG.debug(["doRender","gtsList"],this.data);var t=e.GTSLib.getData(this.data).data;this.LOG.debug(["doRender","gtsList","dataList"],t),t&&(this.gtsList=e.GTSLib.flattenGtsIdArray(t,0).res,this.LOG.debug(["doRender","gtsList"],[this.gtsList,this._options.foldGTSTree,this._isFolded]),this._options.foldGTSTree&&!this._isFolded&&this.foldAll())}},t.prototype.foldAll=function(){var t=this;this.el?(this.el.querySelector("#root").className="collapsed",this.hide=!0,this._isFolded=!0):window.setTimeout(function(){t.foldAll()},100)},t.prototype.toggleVisibility=function(t){var e=t.currentTarget.firstChild;"expanded"===e.className?(this._isFolded=!0,e.className="collapsed",this.hide=!0):(e.className="expanded",this._isFolded=!1,this.hide=!1)},t.prototype.render=function(){var t=this;return this.gtsList?s("div",null,s("div",{class:"stack-level",onClick:function(e){return t.toggleVisibility(e)}},s("span",{class:"expanded",id:"root"})," Stack"),s("warp-view-tree-view",{gtsList:this.gtsList,branch:!1,hidden:this.hide,gtsFilter:this.gtsFilter})):""},Object.defineProperty(t,"is",{get:function(){return"warp-view-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},gtsFilter:{type:String,attr:"gts-filter",watchCallbacks:["onGtsFilter"]},hide:{state:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color,#000)}:host .stack-level+div{padding-left:25px}:host .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}:host .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}"},enumerable:!0,configurable:!0}),t}(),l=function(){function t(){}return Object.defineProperty(t,"is",{get:function(){return"warp-view-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},gtsFilter:{type:String,attr:"gts-filter",watchCallbacks:["onGtsFilter"]},hide:{state:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/**style-placeholder:warp-view-gts-tree:**/"},enumerable:!0,configurable:!0}),t}();l.item=-1;var d=function(){function t(){this.branch=!1,this.hidden=!1,this.gtsFilter="",this.ref=!1,this.hide={}}return t.prototype.componentWillLoad=function(){t.LOG.debug(["componentWillLoad"],l.item)},t.prototype.toggleVisibility=function(t,e){var i;"expanded"===(i=t.currentTarget.id?t.currentTarget:t.currentTarget.previousElementSibling).className?(i.className="collapsed",this.hide[e+""]=!0):(i.className="expanded",this.hide[e+""]=!1),this.ref=!this.ref},t.prototype.onGtsFilter=function(t,e){e!==t&&(this.ref=!this.ref)},t.prototype.isHidden=function(t){return!!this.hide.hasOwnProperty(t+"")&&this.hide[t+""]},t.prototype.render=function(){var t=this;return s("div",{class:"list"},this.gtsList?s("ul",null,this.gtsList.map(function(i,r){return s("li",{hidden:t.hidden},e.GTSLib.isGts(i)?s("warp-view-chip",{node:{gts:i},name:i.c,gtsFilter:t.gtsFilter}):s("span",null,i?s("div",null,t.branch?s("div",null,s("span",{class:"expanded",onClick:function(e){return t.toggleVisibility(e,r)},id:n.ChartLib.guid()}),s("span",{onClick:function(e){return t.toggleVisibility(e,r)}},s("small",null,"List of ",i.length," item",i.length>1?"s":""))):s("div",{class:"stack-level"},s("span",{class:"expanded",onClick:function(e){return t.toggleVisibility(e,r)},id:n.ChartLib.guid()}),s("span",{onClick:function(e){return t.toggleVisibility(e,r)}},0===r?"[TOP]":"["+(r+1)+"]"," ",s("small",null,"List of ",i.length," item",i.length>1?"s":""))),s("warp-view-tree-view",{gtsList:i,branch:!0,hidden:t.isHidden(r),gtsFilter:t.gtsFilter})):""))})):"")},Object.defineProperty(t,"is",{get:function(){return"warp-view-tree-view"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{branch:{type:Boolean,attr:"branch"},el:{elementRef:!0},gtsFilter:{type:String,attr:"gts-filter",watchCallbacks:["onGtsFilter"]},gtsList:{type:"Any",attr:"gts-list"},hidden:{type:Boolean,attr:"hidden"},ref:{state:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */warp-view-tree-view ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}warp-view-tree-view li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}warp-view-tree-view li .stack-level{font-size:1em;padding-top:5px}warp-view-tree-view li .stack-level+div{padding-left:25px}warp-view-tree-view li .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}warp-view-tree-view li .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}warp-view-tree-view li .gtsInfo{white-space:normal;word-wrap:break-word}warp-view-tree-view li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}warp-view-tree-view li .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px}warp-view-tree-view li i,warp-view-tree-view li span{cursor:pointer}warp-view-tree-view li .selected{background-color:#adf;font-weight:700;padding:1px 5px}warp-view-tree-view .gts-classname{color:var(--gts-classname-font-color,#0074d9)}warp-view-tree-view .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}warp-view-tree-view .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}warp-view-tree-view .gts-separator{color:var(--gts-separator-font-color,#bbb)}warp-view-tree-view .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}warp-view-tree-view .gts-attrvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}"},enumerable:!0,configurable:!0}),t}();d.LOG=new n.Logger(d),t.WarpViewChip=o,t.WarpViewGtsTree=a,t.WarpViewTreeView=d,Object.defineProperty(t,"__esModule",{value:!0})});