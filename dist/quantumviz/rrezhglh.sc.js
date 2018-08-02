/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as e,b as i}from"./chunk-cbb0389a.js";import{a}from"./chunk-cadd3091.js";import"./chunk-ee323282.js";class s{constructor(){this.alone=!0,this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!1,this.data="[]",this.hiddenData="[]",this.options="{}",this.width="",this.height="",this.config="{}",this.xView="{}",this.yView="{}",this._mapIndex={},this._xSlider={element:null,min:0,max:0},this._ySlider={element:null,min:0,max:0},this._config={rail:{class:""},cursor:{class:""}}}toBase64Image(){return this._chart.toBase64Image()}redraw(t,e){e!==t&&this.drawChart()}changeScale(t,e){if(e!==t){const e=JSON.parse(t);"timestamp"===e.time.timeMode?(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.options.scales.xAxes[0].time.displayFormats.millisecond=e.time.displayFormats,this._chart.update()):(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.update())}}hideData(t,e){if(e!==t){const e=a.cleanArray(JSON.parse(t));Object.keys(this._mapIndex).forEach(t=>{this._chart.getDatasetMeta(this._mapIndex[t]).hidden=!!e.find(e=>e===t)}),this._chart.update()}}changeXView(){let t=JSON.parse(this.xView);this._chart.options.scales.xAxes[0].time.min=i(t.min,"x"),this._chart.options.scales.xAxes[0].time.max=i(t.max,"x"),this._chart.update()}changeYView(){let t=JSON.parse(this.yView);this._chart.options.scales.yAxes[0].ticks.min=t.min,this._chart.options.scales.yAxes[0].ticks.max=t.max,this._chart.update()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart");if(!JSON.parse(this.data))return;let a=this.gtsToData(JSON.parse(this.data));const s=this,n={animation:!1,legend:{display:!1},tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?s.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):s.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{time:{min:i(this.timeMin?this.timeMin:a.ticks[0],"x"),max:i(this.timeMax?this.timeMax:a.ticks[a.ticks.length-1],"x"),unit:"day"},type:"time"}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]},responsive:this.responsive,zoom:{enabled:!0,drag:!1,sensitivity:.5,mode:"x"}};"spline"===this.type&&(n.elements={line:{lineTension:0}}),"area"===this.type&&(n.elements={line:{fill:"start"}}),this._chart=new e(t,{type:"bar"===this.type?this.type:"line",data:{labels:a.ticks,datasets:a.datasets},options:n});let h=[],r=[];if(a.datasets.forEach(t=>{let e=Math.max(...t.data);e&&e!=1/0&&h.push(e)}),a.datasets.forEach(t=>{let e=Math.min(...t.data);(0==e||e&&e!=1/0)&&r.push(e)}),this._ySlider.min=Math.min(...r),this._ySlider.max=1.05*Math.max(...h),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._xSlider.min=a.ticks[0],this._xSlider.max=a.ticks[a.ticks.length-1],this.alone)console.log("Not alone");else{console.log("Alone");let t={xMin:a.ticks[0],xMax:a.ticks[a.ticks.length-1],yMin:Math.min(...r),yMax:1.05*Math.max(...h)};this.chartInfos.emit(t)}}gtsToData(t){let e=[],i=[],s=0;if(t)return t.forEach(t=>{t.gts&&(t.gts=a.flatDeep(t.gts),t.gts.forEach((n,h)=>{let r=[];if(n.v){n.v.forEach(t=>{i.push(t[0]/1e3),r.push(t[t.length-1])});let o=a.getColor(h);t.params&&t.params[h]&&t.params[h].color&&(o=t.params[h].color);let l=a.serializeGtsMetadata(n);this._mapIndex[l]=s,t.params&&t.params[h]&&t.params[h].key&&(l=t.params[h].key);let c={label:l,data:r,pointRadius:0,fill:!1,steppedLine:this.isStepped(),borderColor:o,borderWidth:1,backgroundColor:a.transparentize(o,.5)};if(t.params&&t.params[h]&&t.params[h].interpolate)switch(t.params[h].interpolate){case"line":c.lineTension=0;break;case"spline":break;case"area":c.fill=!0}else c.lineTension=0;e.push(c),s++}}))}),{datasets:e,ticks:a.unique(i)}}isStepped(){return!!this.type.startsWith("step")&&this.type.replace("step-","")}componentWillLoad(){this._config=a.mergeDeep(this._config,JSON.parse(this.config))}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-chart"}static get encapsulation(){return"shadow"}static get properties(){return{alone:{type:Boolean,attr:"alone"},chartTitle:{type:String,attr:"chart-title"},config:{type:String,attr:"config"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},hiddenData:{type:String,attr:"hidden-data",watchCallbacks:["hideData"]},options:{type:String,attr:"options",watchCallbacks:["changeScale"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},toBase64Image:{method:!0},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"},xView:{type:String,attr:"x-view",watchCallbacks:["changeXView"]},yView:{type:String,attr:"y-view",watchCallbacks:["changeYView"]}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0},{name:"boundsDidChange",method:"boundsDidChange",bubbles:!0,cancelable:!0,composed:!0},{name:"chartInfos",method:"chartInfos",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"quantum-chart[data-quantum-chart]   .chart-container[data-quantum-chart]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}export{s as QuantumChart};