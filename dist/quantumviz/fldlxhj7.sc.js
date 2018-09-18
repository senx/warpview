/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as i}from"./chunk-8446d02a.js";import{a as s,b as e}from"./chunk-2ae9ec54.js";import{a}from"./chunk-18d8dbd2.js";import{a as o,b as h}from"./chunk-e98321e9.js";import{c as n}from"./chunk-35408407.js";import"./chunk-ee323282.js";class r{constructor(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n,this.width="",this.height="",this.LOG=new o(r),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+a.guid().split("-").join(""),this._mapIndex={}}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}buildGraph(){this._options=a.mergeDeep(this._options,this.options);let t=this.el.shadowRoot.querySelector("#"+this.uuid),s=this.gtsToData(this.data);if(!s)return;const e=this._options.gridLineColor,o={legend:{display:this.showLegend},animation:{duration:0},tooltips:{mode:"index",position:"nearest"},scales:{xAxes:[{type:"time",gridLines:{color:e,zeroLineColor:e},ticks:{fontColor:e}}],yAxes:[{gridLines:{color:e,zeroLineColor:e},ticks:{fontColor:e},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]},responsive:this.responsive};this._chart&&this._chart.destroy(),this._chart=new i(t,{type:"bar",data:{labels:s.ticks,datasets:s.datasets},options:o})}drawChart(){this._options=a.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"",this.data&&this.buildGraph()}gtsToData(t){this.LOG.debug(["gtsToData"],t);let i,a=[],o=[],n=0;if((i=this.data instanceof e?t.data:t)&&0!==i.length)return(i=s.flatDeep(i)).forEach(t=>{let i=[];if(t.v){s.gtsSort(t),t.v.forEach(t=>{o.push(Math.floor(parseInt(t[0])/1e3)),i.push(t[t.length-1])});let e=h.getColor(n),r=s.serializeGtsMetadata(t);this._mapIndex[r]=n;let l={label:r,data:i,borderColor:e,borderWidth:1,backgroundColor:h.transparentize(e,.5)};a.push(l),n++}}),this.LOG.debug(["gtsToData","datasets"],a),{datasets:a,ticks:s.unique(o).sort((t,i)=>t>i?1:t===i?0:-1)}}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-bar"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-bar-host]   div[data-quantum-bar]{height:var(--quantum-chart-height,100%)}[data-quantum-bar-host]   .chart-container[data-quantum-bar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class l{constructor(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n,this.width="",this.height="",this._options={gridLineColor:"#8e8e8e"},this.LOG=new o(l),this.uuid="chart-"+a.guid().split("-").join("")}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}drawChart(){this._options=a.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";let t,s=this.el.shadowRoot.querySelector("#"+this.uuid);if(!this.data)return;t=this.data instanceof e?this.data.data:this.data;const o=this._options.gridLineColor,h={legend:{display:this.showLegend},layout:{padding:{left:0,right:50,top:50,bottom:50}},borderWidth:1,animation:{duration:0},scales:{xAxes:[{gridLines:{color:o,zeroLineColor:o},ticks:{fontColor:o}}],yAxes:[{gridLines:{color:o,zeroLineColor:o},ticks:{fontColor:o},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]},responsive:this.responsive},n=this.parseData(t);this.LOG.debug(["drawChart"],[h,n]),this._chart&&this._chart.destroy(),this._chart=new i(s,{type:"bubble",tooltips:{mode:"x",position:"nearest",callbacks:a.getTooltipCallbacks()},data:{datasets:n},options:h})}parseData(t){if(!t)return;let i=[];for(let e=0;e<t.length;e++){let a=Object.keys(t[e])[0],o=[],n=t[e][a];s.isArray(n)&&n.forEach(t=>{o.push({x:t[0],y:t[1],r:t[2]})}),i.push({data:o,label:a,backgroundColor:h.transparentize(h.getColor(e),.5),borderColor:h.getColor(e),borderWidth:1})}return i}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-bubble"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-bubble-host]   div[data-quantum-bubble]{height:var(--quantum-chart-height,100%)}[data-quantum-bubble-host]   .chart-container[data-quantum-bubble]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class d{constructor(){this.unit="",this.responsive=!1,this.options=new n,this.width="",this.height="",this.LOG=new o(d),this._options=new n}onData(t,i){i!==t&&(this.LOG.debug(["onData"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}drawChart(){this.LOG.debug(["drawChart"],[this.options,this._options]),this._options=a.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"px",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"px",this.data instanceof e?this.toDisplay=s.isArray(this.data.data)?this.data.data[0]:this.data.data:this.toDisplay=s.isArray(this.data)?this.data[0]:this.data,this.LOG.debug(["drawChart"],[this.data,this.toDisplay])}getStyle(){if(this.LOG.debug(["getStyle"],this._options),this._options){const t={"background-color":this._options.bgColor||"transparent"};return this._options.fontColor&&(t.color=this._options.fontColor),this.LOG.debug(["getStyle","style"],t),t}return{}}componentDidLoad(){this.LOG.debug(["componentDidLoad"],this._options),this.drawChart()}render(){return t("div",null,this.toDisplay&&""!==this.toDisplay?t("div",{class:"chart-container",id:"#wrapper"},t("div",{style:this.getStyle()},t("div",{class:"value"},this.toDisplay,t("small",null,this.unit)))):t("quantum-spinner",null))}static get is(){return"quantum-display"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-display-host]   div[data-quantum-display]{height:var(--quantum-chart-height,100%)}[data-quantum-display-host]   .chart-container[data-quantum-display]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative;color:var(--quantum-font-color,#000)}[data-quantum-display-host]   .chart-container[data-quantum-display]   div[data-quantum-display]{font-size:10rem;height:100%;width:100%}[data-quantum-display-host]   .chart-container[data-quantum-display]   div[data-quantum-display]   .value[data-quantum-display]{position:relative;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);text-align:center;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content}[data-quantum-display-host]   .chart-container[data-quantum-display]   div[data-quantum-display]   .value[data-quantum-display]   small[data-quantum-display]{font-size:3rem}"}}class p{constructor(){this.imageTitle="",this.responsive=!1,this.options=new n,this.width="",this.height="",this.LOG=new o(p),this._options=new n}onData(t,i){i!==t&&(this.LOG.debug(["onData"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}drawChart(){this.LOG.debug(["drawChart"],[this.options,this._options]),this._options=a.mergeDeep(this._options,this.options),this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"px",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"px",this.toDisplay=[],this.data instanceof e?this.data.data&&this.data.data.length>0&&s.isEmbeddedImage(this.data.data[0])?this.toDisplay.push(this.data.data[0]):this.data.data&&s.isEmbeddedImage(this.data.data)&&this.toDisplay.push(this.data.data):s.isArray(this.data)&&this.data.forEach(t=>{s.isEmbeddedImage(t)&&this.toDisplay.push(t)}),this.LOG.debug(["drawChart"],[this.data,this.toDisplay])}getStyle(){if(this.LOG.debug(["getStyle"],this._options),this._options){const t={"background-color":this._options.bgColor||"transparent"};return this._options.fontColor&&(t.color=this._options.fontColor),this.LOG.debug(["getStyle","style"],t),t}return{}}componentDidLoad(){this.LOG.debug(["componentDidLoad"],this._options),this.drawChart()}render(){return t("div",null,this.toDisplay?t("div",{class:"chart-container",id:"#wrapper"},this.toDisplay.map(i=>t("div",{style:this.getStyle()},t("img",{src:i,class:"responsive"})))):t("quantum-spinner",null))}static get is(){return"quantum-image"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:String,attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},imageTitle:{type:String,attr:"image-title"},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-image-host]   div[data-quantum-image]{height:var(--quantum-chart-height,100%)}[data-quantum-image-host]   .chart-container[data-quantum-image]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}[data-quantum-image-host]   .chart-container[data-quantum-image]   div[data-quantum-image]{font-size:10rem;height:100%;width:100%}[data-quantum-image-host]   .chart-container[data-quantum-image]   div[data-quantum-image]   .responsive[data-quantum-image]{width:calc(100% - 10px);height:auto}"}}class u{constructor(){this.showLegend=!0,this.options=new n,this.width="",this.height="",this.responsive=!1,this.LOG=new o(u),this._options={type:"pie"},this.uuid="chart-"+a.guid().split("-").join("")}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}parseData(t){if(this.LOG.debug(["parseData"],t),!t)return;let i,s=[],a=[];return(i=this.data instanceof e?this.data.data:this.data).forEach(t=>{a.push(t[1]),s.push(t[0])}),this.LOG.debug(["parseData"],[s,a]),{labels:s,data:a}}drawChart(){this._options=a.mergeDeep(this._options,this.options);let t=this.el.shadowRoot.querySelector("#"+this.uuid),s=this.parseData(this.data);s&&(this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"",this.LOG.debug(["drawChart"],[this.data,this._options,s]),this._chart&&this._chart.destroy(),this._options.type=this.options.type||this._options.type,this._chart=new i(t,{type:"gauge"===this._options.type?"doughnut":this._options.type,data:{datasets:[{data:s.data,backgroundColor:h.generateTransparentColors(s.data.length),borderColor:h.generateColors(s.data.length)}],labels:s.labels},options:{legend:{display:this.showLegend},animation:{duration:0},responsive:this.responsive,tooltips:{mode:"index",intersect:!0},circumference:this.getCirc(),rotation:this.getRotation()}}))}getRotation(){return"gauge"===this._options.type?Math.PI:-.5*Math.PI}getCirc(){return"gauge"===this._options.type?Math.PI:2*Math.PI}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-pie"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-pie-host]   div[data-quantum-pie]{width:calc(var(--quantum-chart-width,100%));height:calc(var(--quantum-chart-height,100%) - 10px)}[data-quantum-pie-host]   .chart-container[data-quantum-pie]{position:relative;margin:auto}"}}class g{constructor(){this.responsive=!1,this.showLegend=!0,this.options=new n,this.width="",this.height="",this.LOG=new o(g),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+a.guid().split("-").join("")}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}parseData(t){let i=[],s=[];return t.forEach(t=>{s.push(t[1]),i.push(t[0])}),{labels:i,data:s}}drawChart(){this._options=a.mergeDeep(this._options,this.options);let t=this.el.shadowRoot.querySelector("#"+this.uuid);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";const s=this._options.gridLineColor;if(this.LOG.debug(["color"],s),!this.data)return;let o;o=this.data instanceof e?this.data.data:this.data;let n=this.parseData(o);this._chart&&this._chart.destroy(),this._chart=new i(t,{type:"polarArea",data:{datasets:[{data:n.data,backgroundColor:h.generateTransparentColors(n.data.length),borderColor:h.generateColors(n.data.length)}],labels:n.labels},options:{layout:{padding:{left:0,right:0,top:50,bottom:0}},animation:{duration:0},legend:{display:this.showLegend},responsive:this.responsive,scale:{gridLines:{color:s,zeroLineColor:s},pointLabels:{fontColor:s},ticks:{fontColor:s,backdropColor:"transparent"}},tooltips:{mode:"index",intersect:!0}}})}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-polar"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-polar-host]   div[data-quantum-polar]{height:var(--quantum-chart-height,100%)}[data-quantum-polar-host]   .chart-container[data-quantum-polar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class c{constructor(){this.responsive=!0,this.showLegend=!0,this.options=new n,this.width="",this.height="",this.LOG=new o(c),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+a.guid().split("-").join("")}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}parseData(t){this.LOG.debug(["gtsToData"],t);let i=[],s={};if(t&&0!==t.length){{let e=0;t.forEach(t=>{Object.keys(t).forEach(a=>{const o={label:a,data:[],backgroundColor:h.transparentize(h.getColor(e),.5),borderColor:h.getColor(e)};t[a].forEach(t=>{const i=Object.keys(t)[0];s[i]=0,o.data.push(t[i])}),i.push(o),e++})})}return this.LOG.debug(["gtsToData","datasets"],[i,Object.keys(s)]),{datasets:i,labels:Object.keys(s)}}}drawChart(){this._options=a.mergeDeep(this._options,this.options);let t=this.el.shadowRoot.querySelector("#"+this.uuid);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";const s=this._options.gridLineColor;if(!this.data)return;let o;o=this.data instanceof e?this.data.data:this.data;let h=this.parseData(o);h&&(this._chart&&this._chart.destroy(),this._chart=new i(t,{type:"radar",legend:{display:this.showLegend},data:{labels:h.labels,datasets:h.datasets},options:{layout:{padding:{left:0,right:0,top:50,bottom:0}},animation:{duration:0},legend:{display:this.showLegend},responsive:this.responsive,scale:{gridLines:{color:s,zeroLineColor:s},pointLabels:{fontColor:s},ticks:{fontColor:s,backdropColor:"transparent"}},tooltips:{mode:"index",intersect:!0}}}))}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-radar"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-radar-host]   div[data-quantum-radar]{height:var(--quantum-chart-height,100%)}[data-quantum-radar-host]   .chart-container[data-quantum-radar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class w{constructor(){this.unit="",this.responsive=!1,this.showLegend=!0,this.options=new n,this.width="",this.height="",this.LOG=new o(w),this._options={gridLineColor:"#8e8e8e"},this.uuid="chart-"+a.guid().split("-").join("")}onData(t,i){i!==t&&(this.LOG.debug(["data"],t),this.drawChart())}onOptions(t,i){i!==t&&(this.LOG.debug(["options"],t),this.drawChart())}drawChart(){this._options=a.mergeDeep(this._options,this.options);let t,s=this.el.shadowRoot.querySelector("#"+this.uuid);t=this.data instanceof e?this.data.data:this.data;let o=this.gtsToScatter(t);this.height=(this.responsive?this.el.parentElement.clientHeight:this.height||600)+"",this.width=(this.responsive?this.el.parentElement.clientWidth:this.width||800)+"";const h=this._options.gridLineColor,n={legend:{display:this.showLegend},responsive:this.responsive,animation:{duration:0},tooltips:{mode:"x",position:"nearest",callbacks:a.getTooltipCallbacks()},scales:{xAxes:[{gridLines:{color:h,zeroLineColor:h},ticks:{fontColor:h}}],yAxes:[{gridLines:{color:h,zeroLineColor:h},ticks:{fontColor:h},scaleLabel:{display:""!==this.unit,labelString:this.unit}}]}};this._chart&&this._chart.destroy(),this._chart=new i.Scatter(s,{data:{datasets:o},options:n}),this.LOG.debug(["gtsToScatter","chart"],[o,n])}gtsToScatter(t){if(!t)return;this.LOG.debug(["gtsToScatter"],t);let i=[];for(let e=0;e<t.length;e++){let a=t[e],o=[];a.v.forEach(t=>{o.push({x:t[0]/1e3,y:t[t.length-1]})}),i.push({label:s.serializeGtsMetadata(a),data:o,pointRadius:2,borderColor:h.getColor(e),backgroundColor:h.transparentize(h.getColor(e),.5)})}return this.LOG.debug(["gtsToScatter","datasets"],i),i}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("div",{class:"chart-container"},t("canvas",{id:this.uuid,width:this.width,height:this.height})))}static get is(){return"quantum-scatter"}static get encapsulation(){return"shadow"}static get properties(){return{data:{type:"Any",attr:"data",watchCallbacks:["onData"]},el:{elementRef:!0},height:{type:String,attr:"height",mutable:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width",mutable:!0}}}static get style(){return"[data-quantum-scatter-host]   div[data-quantum-scatter]{height:var(--quantum-chart-height,100%)}[data-quantum-scatter-host]   .chart-container[data-quantum-scatter]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class y{constructor(){this.LOG=new o(y),this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.url="",this.warpscript="",this.graphs={scatter:["scatter"],chart:["line","spline","step","area"],pie:["pie","doughnut","gauge"],polar:["polar"],radar:["radar"],bar:["bar"]},this.loading=!0}onOptions(t,i){this.LOG.debug(["options"],t),i!==t&&(this.LOG.debug(["options","changed"],t),this.parseGTS())}componentDidLoad(){this.execute()}parseGTS(){let t=new e;if(s.isArray(this.gtsList)&&1===this.gtsList.length){const i=this.gtsList[0];i.hasOwnProperty("data")?(t.data=i.data,t.globalParams=i.globalParams||{},t.globalParams.type=t.globalParams.type||this.type,t.params=i.params):(t.data=i,t.globalParams={type:this.type})}else t.data=this.gtsList,t.globalParams={type:this.type};this.LOG.debug(["parseGTS","data"],t),this.data=t,this._options=a.mergeDeep(this.options||{},t.globalParams),this.LOG.debug(["parseGTS","options"],this._options),this.loading=!1}execute(){this.loading=!0,this.warpscript=this.wsElement.textContent,this.LOG.debug(["componentDidLoad","warpscript"],this.warpscript),fetch(this.url,{method:"POST",body:this.warpscript}).then(t=>{t.text().then(t=>{this.gtsList=JSON.parse(t),this.parseGTS()},t=>{this.LOG.error(["componentDidLoad"],t),this.loading=!1})},t=>{this.LOG.error(["componentDidLoad"],t),this.loading=!1})}render(){return t("div",{class:"wrapper",id:"wrapper"},t("div",{class:"warpscript"},t("slot",null)),this.graphs.scatter.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle),t("div",{class:"tile"},t("quantum-scatter",{responsive:this.responsive,unit:this.unit,data:this.data,options:this._options,"show-legend":this.showLegend}))):"",this.graphs.chart.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle),t("div",{class:"tile"},t("quantum-chart",{type:this.type,responsive:this.responsive,unit:this.unit,data:this.data,options:this._options,"show-legend":this.showLegend}))):"","bubble"==this.type?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-bubble",{showLegend:this.showLegend,responsive:!0,unit:this.unit,data:this.data,options:this._options}))):"","map"==this.type?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-map",{responsive:!0,data:this.data}))):"",this.graphs.pie.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-pie",{responsive:this.responsive,data:this.data,options:this._options,showLegend:this.showLegend}))):"",this.graphs.polar.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-polar",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"",this.graphs.radar.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-radar",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"",this.graphs.bar.indexOf(this.type)>-1?t("div",null,t("h1",null,this.chartTitle),t("div",{class:"tile"},t("quantum-bar",{responsive:this.responsive,unit:this.unit,data:this.data,showLegend:this.showLegend,options:this._options}))):"","text"==this.type?t("div",null,t("h1",null,this.chartTitle),t("div",{class:"tile"},t("quantum-display",{responsive:this.responsive,unit:this.unit,data:this.data,options:this._options}))):"","image"==this.type?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-image",{responsive:this.responsive,data:this.data,options:this._options}))):"","plot"==this.type?t("div",null,t("h1",null,this.chartTitle,t("small",null,this.unit)),t("div",{class:"tile"},t("quantum-plot",{responsive:this.responsive,data:this.data,showLegend:this.showLegend,options:this._options}))):"")}static get is(){return"quantum-tile"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{state:!0},options:{type:"Any",attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},url:{type:String,attr:"url"},wsElement:{elementRef:!0}}}static get style(){return"[data-quantum-tile-host]{--quantum-chart-height:100%}[data-quantum-tile-host]   .warpscript[data-quantum-tile]{display:none}[data-quantum-tile-host]   .wrapper[data-quantum-tile]{min-height:var(--quantum-tile-height,400px);width:var(--quantum-tile-width,100%);height:var(--quantum-tile-height,100%)}[data-quantum-tile-host]   .wrapper[data-quantum-tile]   .tile[data-quantum-tile]{width:100%;height:calc(var(--quantum-tile-height,100%) - 40px);position:absolute;top:0;bottom:0;left:0;right:0;overflow-y:auto;overflow-x:hidden;margin:60px 0 0;padding-bottom:10px}[data-quantum-tile-host]   .wrapper[data-quantum-tile]   h1[data-quantum-tile]{font-size:20px;padding:5px;margin:0;color:var(--quantum-font-color,#000)}[data-quantum-tile-host]   .wrapper[data-quantum-tile]   h1[data-quantum-tile]   small[data-quantum-tile]{font-size:10px;margin-left:10px}"}}export{r as QuantumBar,l as QuantumBubble,d as QuantumDisplay,p as QuantumImage,u as QuantumPie,g as QuantumPolar,c as QuantumRadar,w as QuantumScatter,y as QuantumTile};