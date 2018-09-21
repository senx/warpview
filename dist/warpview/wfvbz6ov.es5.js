/*! Built with http://stenciljs.com */
warpview.loadBundle("wfvbz6ov",["exports","./chunk-1074ad0b.js","./chunk-698cd879.js","./chunk-4586562c.js","./chunk-29c10030.js","./chunk-12ee72ee.js"],function(t,e,i,o,n,s){var a=window.warpview.h,r=function(){function t(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+o.ChartLib.guid().split("-").join(""),this._mapIndex={}}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.buildGraph=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options);var t=this.el.shadowRoot.querySelector("#"+this.uuid),i=this.gtsToData(this.data);if(i){var n=this._options.gridLineColor,s={legend:{display:this.showLegend},animation:{duration:0},tooltips:{mode:"index",position:"nearest"},scales:{xAxes:[{type:"time",gridLines:{color:n,zeroLineColor:n},ticks:{fontColor:n}}],yAxes:[{gridLines:{color:n,zeroLineColor:n},ticks:{fontColor:n},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]},responsive:this.responsive};this._chart&&this._chart.destroy(),this._chart=new e.Chart(t,{type:"bar",data:{labels:i.ticks,datasets:i.datasets},options:s})}},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"",this.data&&this.buildGraph()},t.prototype.gtsToData=function(t){var e=this;this.LOG.debug(["gtsToData"],t);var o,n=[],s=[],a=0;if((o=this.data instanceof i.DataModel?t.data:t)&&0!==o.length)return(o=i.GTSLib.flatDeep(o)).forEach(function(t){var o=[];if(t.v){i.GTSLib.gtsSort(t),t.v.forEach(function(t){s.push(Math.floor(parseInt(t[0])/1e3)),o.push(t[t.length-1])});var r=i.ColorLib.getColor(a),h=i.GTSLib.serializeGtsMetadata(t);e._mapIndex[h]=a;var p={label:h,data:o,borderColor:r,borderWidth:1,backgroundColor:i.ColorLib.transparentize(r,.5)};n.push(p),a++}}),this.LOG.debug(["gtsToData","datasets"],n),{datasets:n,ticks:i.GTSLib.unique(s).sort(function(t,e){return t>e?1:t===e?0:-1})}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-bar"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),h=function(){function t(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this._options={gridLineColor:"#8e8e8e"},this.LOG=new i.Logger(t),this.uuid="chart-"+o.ChartLib.guid().split("-").join("")}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";var t=this.el.shadowRoot.querySelector("#"+this.uuid);if(this.data){var n;n=this.data instanceof i.DataModel?this.data.data:this.data;var s=this._options.gridLineColor,a={legend:{display:this.showLegend},layout:{padding:{left:0,right:50,top:50,bottom:50}},borderWidth:1,animation:{duration:0},scales:{xAxes:[{gridLines:{color:s,zeroLineColor:s},ticks:{fontColor:s}}],yAxes:[{gridLines:{color:s,zeroLineColor:s},ticks:{fontColor:s},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]},responsive:this.responsive},r=this.parseData(n);this.LOG.debug(["drawChart"],[a,r]),this._chart&&this._chart.destroy(),this._chart=new e.Chart(t,{type:"bubble",tooltips:{mode:"x",position:"nearest",callbacks:o.ChartLib.getTooltipCallbacks()},data:{datasets:r},options:a})}},t.prototype.parseData=function(t){if(t){for(var e=[],o=function(o){var n=Object.keys(t[o])[0],s=[],a=t[o][n];i.GTSLib.isArray(a)&&a.forEach(function(t){s.push({x:t[0],y:t[1],r:t[2]})}),e.push({data:s,label:n,backgroundColor:i.ColorLib.transparentize(i.ColorLib.getColor(o),.5),borderColor:i.ColorLib.getColor(o),borderWidth:1})},n=0;n<t.length;n++)o(n);return e}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-bubble"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),p=function(){function t(){this.unit="",this.responsive=!1,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options=new n.Param}return t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["onData"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.drawChart=function(){this.LOG.debug(["drawChart"],[this.options,this._options]),this._options=o.ChartLib.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"px",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"px",this.data instanceof i.DataModel?this.toDisplay=i.GTSLib.isArray(this.data.data)?this.data.data[0]:this.data.data:this.toDisplay=i.GTSLib.isArray(this.data)?this.data[0]:this.data,this.LOG.debug(["drawChart"],[this.data,this.toDisplay])},t.prototype.getStyle=function(){if(this.LOG.debug(["getStyle"],this._options),this._options){var t={"background-color":this._options.bgColor||"transparent"};return this._options.fontColor&&(t.color=this._options.fontColor),this.LOG.debug(["getStyle","style"],t),t}return{}},t.prototype.componentDidLoad=function(){this.LOG.debug(["componentDidLoad"],this._options),this.drawChart()},t.prototype.render=function(){return a("div",null,this.toDisplay&&""!==this.toDisplay?a("div",{class:"chart-container",id:"#wrapper"},a("div",{style:this.getStyle()},a("div",{class:"value"},this.toDisplay,a("small",null,this.unit)))):a("warp-view-spinner",null))},Object.defineProperty(t,"is",{get:function(){return"warp-view-display"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative;color:var(--warp-view-font-color,#000)}:host .chart-container div{font-size:10rem;height:100%;width:100%}:host .chart-container div .value{position:relative;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);text-align:center;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content}:host .chart-container div .value small{font-size:3rem}"},enumerable:!0,configurable:!0}),t}(),l=function(){function t(){this.imageTitle="",this.responsive=!1,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options=new n.Param}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["onData"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.drawChart=function(){var t=this;this.LOG.debug(["drawChart"],[this.options,this._options]),this._options=o.ChartLib.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"px",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"px",this.toDisplay=[],this.data instanceof i.DataModel?this.data.data&&this.data.data.length>0&&i.GTSLib.isEmbeddedImage(this.data.data[0])?this.toDisplay.push(this.data.data[0]):this.data.data&&i.GTSLib.isEmbeddedImage(this.data.data)&&this.toDisplay.push(this.data.data):i.GTSLib.isArray(this.data)&&this.data.forEach(function(e){i.GTSLib.isEmbeddedImage(e)&&t.toDisplay.push(e)}),this.LOG.debug(["drawChart"],[this.data,this.toDisplay])},t.prototype.getStyle=function(){if(this.LOG.debug(["getStyle"],this._options),this._options){var t={"background-color":this._options.bgColor||"transparent"};return this._options.fontColor&&(t.color=this._options.fontColor),this.LOG.debug(["getStyle","style"],t),t}return{}},t.prototype.componentDidLoad=function(){this.LOG.debug(["componentDidLoad"],this._options),this.drawChart()},t.prototype.render=function(){var t=this;return a("div",null,this.toDisplay?a("div",{class:"chart-container",id:"#wrapper"},this.toDisplay.map(function(e){return a("div",{style:t.getStyle()},a("img",{src:e,class:"responsive"}))})):a("warp-view-spinner",null))},Object.defineProperty(t,"is",{get:function(){return"warp-view-image"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},imageTitle:{type:String,attr:"image-title"},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative}:host .chart-container div{font-size:10rem;height:100%;width:100%}:host .chart-container div .responsive{width:calc(100% - 10px);height:auto}"},enumerable:!0,configurable:!0}),t}(),d=function(){function t(){this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this.responsive=!1,this.LOG=new i.Logger(t),this._options={type:"pie"},this.uuid="chart-"+o.ChartLib.guid().split("-").join("")}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.parseData=function(t){if(this.LOG.debug(["parseData"],t),t){var e=[],o=[];return(this.data instanceof i.DataModel?this.data.data:this.data).forEach(function(t){o.push(t[1]),e.push(t[0])}),this.LOG.debug(["parseData"],[e,o]),{labels:e,data:o}}},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options);var t=this.el.shadowRoot.querySelector("#"+this.uuid),n=this.parseData(this.data);n&&(this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"",this.LOG.debug(["drawChart"],[this.data,this._options,n]),this._chart&&this._chart.destroy(),this._options.type=this.options.type||this._options.type,this._chart=new e.Chart(t,{type:"gauge"===this._options.type?"doughnut":this._options.type,data:{datasets:[{data:n.data,backgroundColor:i.ColorLib.generateTransparentColors(n.data.length),borderColor:i.ColorLib.generateColors(n.data.length)}],labels:n.labels},options:{legend:{display:this.showLegend},animation:{duration:0},responsive:this.responsive,tooltips:{mode:"index",intersect:!0},circumference:this.getCirc(),rotation:this.getRotation()}}))},t.prototype.getRotation=function(){return"gauge"===this._options.type?Math.PI:-.5*Math.PI},t.prototype.getCirc=function(){return"gauge"===this._options.type?Math.PI:2*Math.PI},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-pie"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{width:calc(var(--warp-view-chart-width,100%));height:calc(var(--warp-view-chart-height,100%) - 10px)}:host .chart-container{position:relative;margin:auto}"},enumerable:!0,configurable:!0}),t}(),u=function(){function t(){this.responsive=!1,this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+o.ChartLib.guid().split("-").join("")}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.parseData=function(t){var e=[],i=[];return t.forEach(function(t){i.push(t[1]),e.push(t[0])}),{labels:e,data:i}},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options);var t=this.el.shadowRoot.querySelector("#"+this.uuid);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";var n=this._options.gridLineColor;if(this.LOG.debug(["color"],n),this.data){var s;s=this.data instanceof i.DataModel?this.data.data:this.data;var a=this.parseData(s);this._chart&&this._chart.destroy(),this._chart=new e.Chart(t,{type:"polarArea",data:{datasets:[{data:a.data,backgroundColor:i.ColorLib.generateTransparentColors(a.data.length),borderColor:i.ColorLib.generateColors(a.data.length)}],labels:a.labels},options:{layout:{padding:{left:0,right:0,top:50,bottom:0}},animation:{duration:0},legend:{display:this.showLegend},responsive:this.responsive,scale:{gridLines:{color:n,zeroLineColor:n},pointLabels:{fontColor:n},ticks:{fontColor:n,backdropColor:"transparent"}},tooltips:{mode:"index",intersect:!0}}})}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-polar"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),c=function(){function t(){this.responsive=!0,this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+o.ChartLib.guid().split("-").join("")}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.parseData=function(t){this.LOG.debug(["gtsToData"],t);var e=[],o={};if(t&&0!==t.length){var n=0;return t.forEach(function(t){Object.keys(t).forEach(function(s){var a={label:s,data:[],backgroundColor:i.ColorLib.transparentize(i.ColorLib.getColor(n),.5),borderColor:i.ColorLib.getColor(n)};t[s].forEach(function(t){var e=Object.keys(t)[0];o[e]=0,a.data.push(t[e])}),e.push(a),n++})}),this.LOG.debug(["gtsToData","datasets"],[e,Object.keys(o)]),{datasets:e,labels:Object.keys(o)}}},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options);var t=this.el.shadowRoot.querySelector("#"+this.uuid);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";var n=this._options.gridLineColor;if(this.data){var s;s=this.data instanceof i.DataModel?this.data.data:this.data;var a=this.parseData(s);a&&(this._chart&&this._chart.destroy(),this._chart=new e.Chart(t,{type:"radar",legend:{display:this.showLegend},data:{labels:a.labels,datasets:a.datasets},options:{layout:{padding:{left:0,right:0,top:50,bottom:0}},animation:{duration:0},legend:{display:this.showLegend},responsive:this.responsive,scale:{gridLines:{color:n,zeroLineColor:n},pointLabels:{fontColor:n},ticks:{fontColor:n,backdropColor:"transparent"}},tooltips:{mode:"index",intersect:!0}}}))}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-radar"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--warp-view-chart-height,100%)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),g=function(){function t(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n.Param,this.width="",this.height="",this.LOG=new i.Logger(t),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+o.ChartLib.guid().split("-").join("")}return t.prototype.onResize=function(){var t=this;clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(function(){t.LOG.debug(["onResize"],t.el.parentElement.clientWidth),t.drawChart()},250)},t.prototype.onData=function(t,e){e!==t&&(this.LOG.debug(["data"],t),this.drawChart())},t.prototype.onOptions=function(t,e){e!==t&&(this.LOG.debug(["options"],t),this.drawChart())},t.prototype.drawChart=function(){this._options=o.ChartLib.mergeDeep(this._options,this.options);var t,n=this.el.shadowRoot.querySelector("#"+this.uuid);t=this.data instanceof i.DataModel?this.data.data:this.data;var s=this.gtsToScatter(t);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";var a=this._options.gridLineColor,r={legend:{display:this.showLegend},responsive:this.responsive,animation:{duration:0},tooltips:{mode:"x",position:"nearest",callbacks:o.ChartLib.getTooltipCallbacks()},scales:{xAxes:[{gridLines:{color:a,zeroLineColor:a},ticks:{fontColor:a}}],yAxes:[{gridLines:{color:a,zeroLineColor:a},ticks:{fontColor:a},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]}};this._chart&&this._chart.destroy(),this._chart=new e.Chart.Scatter(n,{data:{datasets:s},options:r}),this.LOG.debug(["gtsToScatter","chart"],[s,r])},t.prototype.gtsToScatter=function(t){if(t){this.LOG.debug(["gtsToScatter"],t);for(var e=[],o=function(o){var n=t[o],s=[];n.v.forEach(function(t){s.push({x:t[0]/1e3,y:t[t.length-1]})}),e.push({label:i.GTSLib.serializeGtsMetadata(n),data:s,pointRadius:2,borderColor:i.ColorLib.getColor(o),backgroundColor:i.ColorLib.transparentize(i.ColorLib.getColor(o),.5)})},n=0;n<t.length;n++)o(n);return this.LOG.debug(["gtsToScatter","datasets"],e),e}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("div",{class:"chart-container"},a("canvas",{id:this.uuid,width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"warp-view-scatter"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"window:resize",method:"onResize",passive:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host div{height:var(--quantum-chart-height,100%)}:host .chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),b=function(){function t(){this.LOG=new i.Logger(t),this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.url="",this.warpscript="",this.graphs={scatter:["scatter"],chart:["line","spline","step","area"],pie:["pie","doughnut","gauge"],polar:["polar"],radar:["radar"],bar:["bar"]},this.loading=!0}return t.prototype.onOptions=function(t,e){this.LOG.debug(["options"],t),e!==t&&(this.LOG.debug(["options","changed"],t),this.parseGTS())},t.prototype.resize=function(){this.execute()},t.prototype.componentDidLoad=function(){this.execute()},t.prototype.parseGTS=function(){var t=new i.DataModel;if(i.GTSLib.isArray(this.gtsList)&&1===this.gtsList.length){var e=this.gtsList[0];e.hasOwnProperty("data")?(t.data=e.data,t.globalParams=e.globalParams||{},t.globalParams.type=t.globalParams.type||this.type,t.params=e.params):(t.data=e,t.globalParams={type:this.type})}else t.data=this.gtsList,t.globalParams={type:this.type};this.LOG.debug(["parseGTS","data"],t),this.data=t,this._options=o.ChartLib.mergeDeep(this.options||{},t.globalParams),this.LOG.debug(["parseGTS","options"],this._options),this.loading=!1},t.prototype.execute=function(){var t=this;this.loading=!0,this.warpscript=this.wsElement.textContent,this.LOG.debug(["execute","warpscript"],this.warpscript),fetch(this.url,{method:"POST",body:this.warpscript}).then(function(e){e.text().then(function(e){t.LOG.debug(["execute","response"],e),t.gtsList=JSON.parse(e),t.parseGTS(),t.loading=!1},function(e){t.LOG.error(["execute"],[e,t.url,t.warpscript]),t.loading=!1})},function(e){t.LOG.error(["execute"],[e,t.url,t.warpscript]),t.loading=!1})},t.prototype.render=function(){return a("div",{class:"wrapper",id:"wrapper"},a("div",{class:"warpscript"},a("slot",null)),this.graphs.scatter.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle),a("div",{class:"tile"},a("warp-view-scatter",{responsive:this.responsive,unit:this.unit,data:this.data,options:this._options,"show-legend":this.showLegend}))):"",this.graphs.chart.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle),a("div",{class:"tile"},a("warp-view-chart",{type:this.type,responsive:this.responsive,unit:this.unit,data:this.data,options:this._options,"show-legend":this.showLegend}))):"","bubble"==this.type?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-bubble",{showLegend:this.showLegend,responsive:!0,unit:this.unit,data:this.data,options:this._options}))):"","map"==this.type?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-map",{responsive:!0,data:this.data,options:this._options}))):"",this.graphs.pie.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-pie",{responsive:this.responsive,data:this.data,options:this._options,showLegend:this.showLegend}))):"",this.graphs.polar.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-polar",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"",this.graphs.radar.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-radar",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"",this.graphs.bar.indexOf(this.type)>-1?a("div",null,a("h1",null,this.chartTitle),a("div",{class:"tile"},a("warp-view-bar",{responsive:this.responsive,unit:this.unit,data:this.data,showLegend:this.showLegend,options:this._options}))):"","text"==this.type?a("div",null,a("h1",null,this.chartTitle),a("div",{class:"tile"},a("warp-view-display",{responsive:this.responsive,unit:this.unit,data:this.data,options:this._options}))):"","image"==this.type?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-image",{responsive:this.responsive,data:this.data,options:this._options}))):"","plot"==this.type?a("div",null,a("h1",null,this.chartTitle,a("small",null,this.unit)),a("div",{class:"tile"},a("warp-view-plot",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"",this.loading?a("warp-view-spinner",null):"")},Object.defineProperty(t,"is",{get:function(){return"warp-view-tile"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{state:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},resize:{method:!0},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},url:{type:String,attr:"url"},wsElement:{elementRef:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"/*!\n *\n *    Copyright 2016  Cityzen Data\n *\n *    Licensed under the Apache License, Version 2.0 (the \"License\");\n *    you may not use this file except in compliance with the License.\n *    You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n *    Unless required by applicable law or agreed to in writing, software\n *    distributed under the License is distributed on an \"AS IS\" BASIS,\n *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *    See the License for the specific language governing permissions and\n *    limitations under the License.\n *\n */:host{--warp-view-chart-height:100%}:host .warpscript{display:none}:host .wrapper{min-height:var(--warp-view-tile-height,400px);width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden}:host .wrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color,#000)}:host .wrapper h1 small{font-size:10px;margin-left:10px}"},enumerable:!0,configurable:!0}),t}();t.WarpViewBar=r,t.WarpViewBubble=h,t.WarpViewDisplay=p,t.WarpViewImage=l,t.WarpViewPie=d,t.WarpViewPolar=u,t.WarpViewRadar=c,t.WarpViewScatter=g,t.WarpViewTile=b,Object.defineProperty(t,"__esModule",{value:!0})});