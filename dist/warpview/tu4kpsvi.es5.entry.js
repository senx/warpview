warpview.loadBundle("tu4kpsvi",["exports","./chunk-b2964c24.js","./chunk-ba4ea257.js","./chunk-9fb984f8.js"],function(t,e,a,i){var n=window.warpview.h,s=function(){function t(){this.responsive=!1,this.showLegend=!0,this.options=new a.Param,this.width="",this.height="",this.elemsCount=15,this.debug=!1,this.page=0,this._options={timeMode:"date",timeZone:"UTC",timeUnit:"us"},this._data=[]}return t.prototype.onData=function(t){this.LOG.debug(["data"],t),this.drawChart()},t.prototype.onOptions=function(t,e){a.deepEqual(t,e)||(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.drawChart=function(){if(this._options=a.ChartLib.mergeDeep(this._options,this.options),this.LOG.debug(["drawChart","_options"],this._options),this.height=(this.responsive?this.el.parentElement.getBoundingClientRect().height:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.getBoundingClientRect().width:this.width||800)+"",this.data){var t,i=this.data;"string"==typeof i&&(i=JSON.parse(i)),e.GTSLib.isArray(i)&&i[0]&&(i[0]instanceof e.DataModel||i[0].hasOwnProperty("data"))&&(i=i[0]),t=i instanceof e.DataModel||i.hasOwnProperty("data")?i.data:i,this._data=this.parseData(e.GTSLib.flatDeep(t)),this.LOG.debug(["drawChart","_data"],this._data)}},t.prototype.getHeaderParam=function(t,e,a,i){return this.data.params&&this.data.params[t]&&this.data.params[t][a]&&this.data.params[t][a][e]?this.data.params[t][a][e]:this.data.globalParams&&this.data.globalParams[a]&&this.data.globalParams[a][e]?this.data.globalParams[a][e]:i},t.prototype.parseData=function(t){var a=this,i=[];return this.LOG.debug(["parseData"],t),t.forEach(function(t,n){var s={name:"",values:[],headers:[]};e.GTSLib.isGts(t)?(a.LOG.debug(["parseData","isGts"],t),s.name=e.GTSLib.serializeGtsMetadata(t),s.values=t.v):(a.LOG.debug(["parseData","is not a Gts"],t),s.values=e.GTSLib.isArray(t)?t:[t]),s.headers=[a.getHeaderParam(n,0,"headers","Date")],t.v.length>0&&t.v[0].length>2&&s.headers.push(a.getHeaderParam(n,1,"headers","Latitude")),t.v.length>0&&t.v[0].length>3&&s.headers.push(a.getHeaderParam(n,2,"headers","Longitude")),t.v.length>0&&t.v[0].length>4&&s.headers.push(a.getHeaderParam(n,3,"headers","Elevation")),s.headers.push(a.getHeaderParam(n,t.v[0].length-1,"headers","Value")),i.push(s)}),this.LOG.debug(["parseData","flatData"],i),i},t.prototype.componentWillLoad=function(){this.LOG=new e.Logger(t,this.debug),this.drawChart()},t.prototype.render=function(){var t=this;return n("div",{class:"wrapper"},this._data.map(function(e){return n("warp-view-paginable",{data:e,options:t._options,debug:t.debug})}))},Object.defineProperty(t,"is",{get:function(){return"warp-view-datagrid"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{_data:{state:!0},data:{type:String,attr:"data",watchCallbacks:["onData"]},debug:{type:Boolean,attr:"debug"},el:{elementRef:!0},elemsCount:{type:Number,attr:"elems-count"},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},page:{state:!0},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */"},enumerable:!0,configurable:!0}),t}(),r=function(){function t(){this.options=new a.Param,this.elemsCount=15,this.debug=!1,this.page=0,this.pages=[],this.displayedValues=[],this._options={timeMode:"date",timeZone:"UTC",timeUnit:"us"},this.windowed=5}return t.prototype.formatDate=function(t){return"date"===this._options.timeMode?i.moment.utc(t/1e3).toISOString():t.toString()},t.prototype.goto=function(t){this.page=t,this.drawGridData()},t.prototype.next=function(){this.page=Math.min(this.page+1,this._data.values.length-1),this.drawGridData()},t.prototype.prev=function(){this.page=Math.max(this.page-1,0),this.drawGridData()},t.prototype.drawGridData=function(){if(this._options=a.ChartLib.mergeDeep(this._options,this.options),this.LOG.debug(["drawGridData","_options"],this._options),this.data){this.pages=[];for(var t=0;t<this.data.values.length/this.elemsCount;t++)this.pages.push(t);this._data=Object.assign({},this.data),this.displayedValues=this._data.values.slice(Math.max(0,this.elemsCount*this.page),Math.min(this.elemsCount*(this.page+1),this._data.values.length)),this.LOG.debug(["drawGridData","_data"],this.data)}},t.prototype.componentWillLoad=function(){this.LOG=new e.Logger(t,this.debug),this.drawGridData()},t.prototype.render=function(){var t=this;return n("div",{class:"wrapper"},this._data?n("div",null,n("div",{class:"heading",innerHTML:e.GTSLib.formatLabel(this._data.name)}),n("table",null,n("thead",null,this._data.headers.map(function(t){return n("th",null,t)})),n("tbody",null,this.displayedValues.map(function(e,a){return n("tr",{class:a%2==0?"odd":"even"},e.map(function(e,a){return n("td",null,0===a?t.formatDate(e):e)}))}))),n("div",{class:"center"},n("div",{class:"pagination"},0!==this.page?n("div",{class:"prev hoverable",onClick:function(){return t.prev()}},"<"):"",this.page-this.windowed>0?n("div",{class:"index disabled"},"..."):"",this.pages.map(function(e){return e>=t.page-t.windowed&&e<=t.page+t.windowed?n("div",{class:"index "+(t.page===e?"active":"hoverable"),onClick:function(){return t.goto(e)}},e):""}),this.page+this.windowed<this.pages.length?n("div",{class:"index disabled"},"..."):"",this.page!==this._data.values.length-1?n("div",{class:"next hoverable",onClick:function(){return t.next()}},">"):""))):"")},Object.defineProperty(t,"is",{get:function(){return"warp-view-paginable"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data"},debug:{type:Boolean,attr:"debug"},elemsCount:{type:Number,attr:"elems-count"},options:{type:"Any",attr:"options"},page:{state:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host table{width:100%;color:var(--warp-view-font-color,#000)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding,5px)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color,#fff);color:var(--warp-view-datagrid-odd-color,#000)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color,#ddd);color:var(--warp-view-datagrid-even-color,#000)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color,#000);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color,#ddd);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color,#fff)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color,#4caf50);color:var(--warp-view-pagination-active-color,#fff);border:1px solid var(--warp-view-pagination-active-border-color,#4caf50)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color,#ddd);color:var(--warp-view-pagination-hover-color,#000);border:1px solid var(--warp-view-pagination-hover-border-color,#ddd)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color,#ddd)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-attrvalue,:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"},enumerable:!0,configurable:!0}),t}();t.WarpViewDatagrid=s,t.WarpViewPaginable=r,Object.defineProperty(t,"__esModule",{value:!0})});