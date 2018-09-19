/*! Built with http://stenciljs.com */
warpview.loadBundle("xiayjh4z",["exports","./chunk-fead84b2.js","./chunk-9607b381.js"],function(e,t,n){var r=window.warpview.h,i=function(){},o=function(){function e(){this._node={selected:!0,gts:i},this.LOG=new n.Logger(e)}return e.prototype.gtsColor=function(e){return e?n.ColorLib.getColor(this.index):"#bbbbbb"},e.prototype.componentWillLoad=function(){this._node=Object.assign({},this.node,{selected:!0})},e.prototype.componentDidLoad=function(){this.el.getElementsByClassName("normal")[0].style.setProperty("background-color",this.gtsColor(this._node.selected))},e.prototype.lastIndex=function(e,t){return e===this.toArray(t).length-1},e.prototype.toArray=function(e){return void 0===e?[]:Object.keys(e).map(function(t){return{name:t,value:e[t]}})},e.prototype.switchPlotState=function(e){this._node=Object.assign({},this._node,{selected:!this._node.selected,label:t.GTSLib.serializeGtsMetadata(this._node.gts)}),this.LOG.debug(["switchPlotState"],[this._node]),this.el.getElementsByClassName("normal")[0].style.setProperty("background-color",this.gtsColor(this._node.selected)),this.warpViewSelectedGTS.emit(this._node)},e.prototype.render=function(){var e=this;return r("div",null,this._node&&this._node.gts&&this._node.gts.l?r("span",null,r("i",{class:"normal"}),r("span",{class:"gtsInfo",onClick:function(t){return e.switchPlotState(t)}},r("span",{class:"gts-classname"},this._node.gts.c),r("span",{class:"gts-separator",innerHTML:"&lcub; "}),this.toArray(this._node.gts.l).map(function(t,n){return r("span",null,r("span",{class:"gts-labelname"},t.name),r("span",{class:"gts-separator"},"="),r("span",{class:"gts-labelvalue"},t.value),r("span",{hidden:e.lastIndex(n,e._node.gts.l)},", "))}),r("span",{class:"gts-separator",innerHTML:" &rcub;"}))):"")},Object.defineProperty(e,"is",{get:function(){return"warp-view-chip"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{el:{elementRef:!0},index:{type:Number,attr:"index"},name:{type:String,attr:"name"},node:{type:"Any",attr:"node"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"warpViewSelectedGTS",method:"warpViewSelectedGTS",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:120px;height:12px}"},enumerable:!0,configurable:!0}),e}(),s=function(){function e(){this.theme="light",this.gtsList={content:[]},this.LOG=new n.Logger(e)}return e.prototype.onData=function(e,t){e!==t&&this.doRender()},e.prototype.componentWillLoad=function(){this.LOG.debug(["componentWillLoad","data"],this.data),this.data&&this.doRender()},e.prototype.doRender=function(){var e=t.GTSLib.getData(this.data).data;this.gtsList=t.GTSLib.gtsFromJSONList(e,""),this.LOG.debug(["doRender","gtsList"],this.data)},e.prototype.render=function(){return this.gtsList?r("warp-view-tree-view",{gtsList:this.gtsList,branch:!1,theme:this.theme}):""},Object.defineProperty(e,"is",{get:function(){return"warp-view-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},theme:{type:String,attr:"theme"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */"},enumerable:!0,configurable:!0}),e}(),a=function(){function e(){}return Object.defineProperty(e,"is",{get:function(){return"warp-view-gts-tree"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},theme:{type:String,attr:"theme"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/**style-placeholder:warp-view-gts-tree:**/"},enumerable:!0,configurable:!0}),e}();a.item=-1;var l=function(){function e(){this.branch=!1,this.theme="light"}return e.getIndex=function(e){return a.item++,e.index=a.item,this.LOG.debug(["getIndex"],[a.item,e]),a.item},e.prototype.componentWillLoad=function(){e.LOG.debug(["componentWillLoad"],a.item)},e.prototype.render=function(){var n=this;return r("div",{class:"list"},this.gtsList&&this.gtsList.content?r("ul",null,this.gtsList.content.map(function(i,o){return r("li",null,n.branch?"":r("div",{class:"stack-level"},"Stack level ",o),t.GTSLib.isGts(i.gts)?r("warp-view-chip",{node:i,index:e.getIndex(i),name:i.gts.c}):r("span",null,i.content?r("div",null,r("span",{class:"expanded"}),"List of ",i.content.length," item",i.content.length>1?"s":"",r("warp-view-tree-view",{gtsList:i,branch:!0})):r("span",null)))})):"")},Object.defineProperty(e,"is",{get:function(){return"warp-view-tree-view"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{branch:{type:Boolean,attr:"branch"},gtsList:{type:"Any",attr:"gts-list"},theme:{type:String,attr:"theme"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */warp-view-tree-view ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}warp-view-tree-view li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}warp-view-tree-view li .stack-level{font-size:1.25em;font-weight:700;padding-top:25px;padding-bottom:10px}warp-view-tree-view li .stack-level+div{padding-left:25px}warp-view-tree-view li .expanded{padding:1px 10px;background:var(--gts-tree-expanded-icon,url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAKElEQVQ4jWNgGFbgFQMDw38i8UuYJiYkA5hJsIwUtXQEo2EwGgZkAwBP/yN0kY5JiwAAAABJRU5ErkJggg==));background-size:cover}warp-view-tree-view li .collapsed{padding:1px 10px;background:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABiSURBVGhD7djRCcAgDEBBF+hHt+wo3auDtWaEKFLRO3j/CSiIBQDYxFE7JytmSntq72TFTGkWGVjTIsvcEQDocdXuyYqZ0ry1Bta0yDJHCwB6+KAb2N5vrWUW8UEHAPyilA9TDlz495u2lwAAAABJRU5ErkJggg==));background-size:cover}warp-view-tree-view li .gtsInfo{white-space:normal;word-wrap:break-word}warp-view-tree-view li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}warp-view-tree-view li .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px}warp-view-tree-view li i,warp-view-tree-view li span{cursor:pointer}warp-view-tree-view li .selected{background-color:#adf;font-weight:700;padding:1px 5px}warp-view-tree-view .gts-classname{color:var(--gts-classname-font-color,#0074d9)}warp-view-tree-view .gts-labelname{color:var(--gts-labelname-font-color,#3d9970)}warp-view-tree-view .gts-separator{color:var(--gts-separator-font-color,#bbb)}warp-view-tree-view .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}"},enumerable:!0,configurable:!0}),e}();l.LOG=new n.Logger(l),e.WarpViewChip=o,e.WarpViewGtsTree=s,e.WarpViewTreeView=l,Object.defineProperty(e,"__esModule",{value:!0})});