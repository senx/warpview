/*! Built with http://stenciljs.com */
quantumviz.loadBundle("0bwh1c90",["exports","./chunk-e262070a.js"],function(e,t){var n=window.quantumviz.h,r=function(){function e(){this._node={selected:!0,gts:{c:"",l:{},a:{},v:[]}}}return e.prototype.gtsColor=function(e){return e?t.GTSLib.getColor(this.index):"#bbbbbb"},e.prototype.componentWillLoad=function(){this._node=Object.assign({},this.node,{selected:!0})},e.prototype.componentDidLoad=function(){this.el.getElementsByClassName("normal")[0].style.setProperty("background-color",this.gtsColor(this._node.selected))},e.prototype._lastIndex=function(e,t){return e===this._toArray(t).length-1},e.prototype._toArray=function(e){return void 0===e?[]:Object.keys(e).map(function(t){return{name:t,value:e[t]}})},e.prototype.switchPlotState=function(e){this._node=Object.assign({},this._node,{selected:!this._node.selected,label:t.GTSLib.serializeGtsMetadata({c:this._node.gts.c,l:this._node.gts.l,a:this._node.gts.a})}),this._node,this.el.getElementsByClassName("normal")[0].style.setProperty("background-color",this.gtsColor(this._node.selected)),this.quantumSelectedGTS.emit(this._node)},e.prototype.render=function(){var e=this;return n("div",null,void 0!==this._node&&void 0!==this._node.gts?n("span",null,n("i",{class:"normal"}),n("span",{class:"gtsInfo",onClick:function(t){return e.switchPlotState(t)}},n("span",{class:"gts-classname"},this._node.gts.c),n("span",{class:"gts-separator",innerHTML:"&lcub; "}),this._toArray(this._node.gts.l).map(function(t,r){return n("span",null,n("span",{class:"gts-labelname"},t.name),n("span",{class:"gts-separator"},"="),n("span",{class:"gts-labelvalue"},t.value),n("span",{hidden:e._lastIndex(r,e._node.gts.l)},", "))}),n("span",{class:"gts-separator",innerHTML:" &rcub;"}))):n("span",null))},Object.defineProperty(e,"is",{get:function(){return"quantum-chip"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{el:{elementRef:!0},index:{type:Number,attr:"index"},name:{type:String,attr:"name"},node:{type:"Any",attr:"node"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"quantumSelectedGTS",method:"quantumSelectedGTS",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"quantum-chip .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:120px;height:12px}"},enumerable:!0,configurable:!0}),e}(),o=function(){function e(){this.data="[]"}return e.prototype.dataChanged=function(e,t){e!==t&&(this.gtsList=JSON.parse(e))},e.prototype.componentWillLoad=function(){var e=JSON.parse(this.data);this.gtsList=t.GTSLib.gtsFromJSONList(e,""),this.gtsList},e.prototype.render=function(){return n("quantum-tree-view",{gtsList:this.gtsList,branch:!1})},Object.defineProperty(e,"is",{get:function(){return"quantum-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["dataChanged"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"selectedGTS",method:"selectedGTS",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return""},enumerable:!0,configurable:!0}),e}(),a=function(){function e(){}return Object.defineProperty(e,"is",{get:function(){return"quantum-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["dataChanged"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"selectedGTS",method:"selectedGTS",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/**style-placeholder:quantum-gts-tree:**/"},enumerable:!0,configurable:!0}),e}();a.item=-1;var s=function(){function e(){this.branch=!1}return e.prototype.getIndex=function(e){return a.item++,e.index=a.item,a.item,a.item},e.prototype.componentWillLoad=function(){a.item},e.prototype.render=function(){var e=this;return n("ul",null,this.gtsList.content.map(function(r,o){return n("li",null,e.branch?"":n("div",{class:"stack-level"},"Stack level ",o),t.GTSLib.isGts(r.gts)?n("quantum-chip",{node:r,index:e.getIndex(r),name:r.gts.c}):n("span",null,r.content?n("div",null,n("span",{class:"expanded"}),"List of ",r.content.length," item",r.content.length>1?"s":"",n("quantum-tree-view",{gtsList:r,branch:!0})):n("span",null)))}))},Object.defineProperty(e,"is",{get:function(){return"quantum-tree-view"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{branch:{type:Boolean,attr:"branch"},gtsList:{type:"Any",attr:"gts-list"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"selected",method:"selected",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"quantum-tree-view ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}quantum-tree-view li{position:relative;padding:0 0 0 20px;line-height:20px}quantum-tree-view li .stack-level{font-size:1.25em;font-weight:700;padding-top:25px;padding-bottom:10px}quantum-tree-view li .stack-level+div{padding-left:25px}quantum-tree-view li .expanded{padding:1px 10px;background:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAKElEQVQ4jWNgGFbgFQMDw38i8UuYJiYkA5hJsIwUtXQEo2EwGgZkAwBP/yN0kY5JiwAAAABJRU5ErkJggg==) no-repeat}quantum-tree-view li .collapsed{padding:1px 10px;background:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAXUlEQVQ4jWNgGCzgJwMDw38S8U8GBgYGJqgBjGRYSo4e3GAfAwMDP5oYIW/9RFb8n4GB4RQDA4MgktgvAgb8QjfgPwMDwyxyvYDNBSR54SADZhiQ5AWKwTBISAMHAKXXR27jzC2pAAAAAElFTkSuQmCC) no-repeat}quantum-tree-view li .gtsInfo{white-space:normal;word-wrap:break-word}quantum-tree-view li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}quantum-tree-view li .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px}quantum-tree-view li i,quantum-tree-view li span{cursor:pointer}quantum-tree-view li .selected{background-color:#adf;font-weight:700;padding:1px 5px}quantum-tree-view .gts-classname{color:#0074d9}quantum-tree-view .gts-labelname{color:#3d9970}quantum-tree-view .gts-separator{color:#bbb}quantum-tree-view .gts-labelvalue{color:#aaa;font-style:italic}"},enumerable:!0,configurable:!0}),e}();e.QuantumChip=r,e.QuantumGtsTree=o,e.QuantumTreeView=s,Object.defineProperty(e,"__esModule",{value:!0})});