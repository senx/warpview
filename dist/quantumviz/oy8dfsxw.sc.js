/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as e,b as i}from"./chunk-cbb0389a.js";import{a as s}from"./chunk-faa0a089.js";import"./chunk-ee323282.js";class a{constructor(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),i=JSON.parse(this.data);if(!i)return;const s=this;new e(t,{type:"bubble",tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?s.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):s.pointHover.emit({x:-100,y:this._eventPosition.y})}},legend:{display:this.showLegend},data:{datasets:this.parseData(i)},options:{borderWidth:1,scales:{yAxes:[{afterFit:function(t){t.width=100}}]},responsive:this.responsive}})}parseData(t){if(!t)return;let e=[];for(let i=0;i<t.length;i++){let a=Object.keys(t[i])[0],r=[],n=t[i][a];s.isArray(n)&&n.forEach(t=>{r.push({x:t[0],y:t[1],r:t[2]})}),e.push({data:r,label:a,backgroundColor:s.transparentize(s.getColor(i),.5),borderColor:s.getColor(i),borderWidth:1})}return e}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-bubble"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".chart-container[data-quantum-bubble]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class r{constructor(){this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!1,this.data="[]",this.options="{}",this.width="",this.height="",this.config="{}",this._xSlider={element:null,min:0,max:0},this._ySlider={element:null,min:0,max:0},this._config={rail:{class:""},cursor:{class:""}}}redraw(t,e){e!==t&&this.drawChart()}changeScale(t,e){if(e!==t){const e=JSON.parse(t);"timestamp"===e.time.timeMode?(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.options.scales.xAxes[0].time.displayFormats.millisecond=e.time.displayFormats,this._chart.update()):(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.update())}}hideData(t){const e=this._chart.getDatasetMeta(t);null===e.hidden?e.hidden=!0:e.hidden=null,this._chart.update(),this.didHideOrShowData.emit()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart");if(!JSON.parse(this.data))return;let s=this.gtsToData(JSON.parse(this.data));const a=this,r={animation:!1,legend:{display:!1},tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?a.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):a.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{time:{min:i(this.timeMin?this.timeMin:s.ticks[0],"x"),max:i(this.timeMax?this.timeMax:s.ticks[s.ticks.length-1],"x"),unit:"day"},type:"time"}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]},responsive:this.responsive,zoom:{enabled:!0,drag:!1,sensitivity:.5,mode:"x"}};"spline"===this.type&&(r.elements={line:{lineTension:0}}),"area"===this.type&&(r.elements={line:{fill:"start"}}),this._chart=new e(t,{type:"bar"===this.type?this.type:"line",data:{labels:s.ticks,datasets:s.datasets},options:r});let n=[],o=[];s.datasets.forEach(t=>{let e=Math.max(...t.data);e&&e!=1/0&&n.push(e)}),s.datasets.forEach(t=>{let e=Math.min(...t.data);(0==e||e&&e!=1/0)&&o.push(e)}),this._ySlider.min=Math.min(...o),this._ySlider.max=1.05*Math.max(...n),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._xSlider.min=s.ticks[0],this._xSlider.max=s.ticks[s.ticks.length-1]}xSliderInit(){let t=this.el.shadowRoot.querySelector("#xSlider");t.setAttribute("min-value",this._xSlider.min.toString()),t.setAttribute("max-value",this._xSlider.max.toString()),t.setAttribute("width",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width.toString()),this._xSlider.element=t}ySliderInit(){let t=this.el.shadowRoot.querySelector("#ySlider");t.setAttribute("min-value",this._ySlider.min.toString()),t.setAttribute("max-value",this._ySlider.max.toString()),t.setAttribute("height",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height.toString()),this._ySlider.element=t}gtsToData(t){let e=[],i=[];if(t)return t.forEach(t=>{t.gts&&(t.gts=s.flatDeep(t.gts),t.gts.forEach((a,r)=>{let n=[];if(a.v){a.v.forEach(t=>{i.push(t[0]/1e3),n.push(t[t.length-1])});let o=s.getColor(r);t.params&&t.params[r]&&t.params[r].color&&(o=t.params[r].color);let h=s.serializeGtsMetadata(a);t.params&&t.params[r]&&t.params[r].key&&(h=t.params[r].key);let l={label:h,data:n,pointRadius:1,fill:!1,steppedLine:this.isStepped(),borderColor:o,borderWidth:1,backgroundColor:s.transparentize(o,.5)};if(t.params&&t.params[r]&&t.params[r].interpolate)switch(t.params[r].interpolate){case"line":l.lineTension=0;break;case"spline":break;case"area":l.fill=!0}e.push(l)}}))}),{datasets:e,ticks:s.unique(i)}}isStepped(){return!!this.type.startsWith("step")&&this.type.replace("step-","")}xZoomListener(t){let e=this._chart.options.scales.xAxes[0].time.min._i,s=this._chart.options.scales.xAxes[0].time.max._i,a=s-e;t.detail.zoomValue.zoomType>0?(e+=.1*a*t.detail.zoomValue.coef,s=(s-=.1*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:s,e=e<this._xSlider.min?this._xSlider.min:e,this._chart.options.scales.xAxes[0].time.min=i(e,"x"),this._chart.options.scales.xAxes[0].time.max=i(s,"x")):(e-=.15*a*t.detail.zoomValue.coef,s=(s+=.15*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:s,e=e<this._xSlider.min?this._xSlider.min:e,this._chart.options.scales.xAxes[0].time.min=i(e,"x"),this._chart.options.scales.xAxes[0].time.max=i(s,"x")),this._chart.update(),this._xSlider.element.setAttribute("max-value",(this._xSlider.max-(s-e)).toString());let r=(s-e)/(this._xSlider.max-this._xSlider.min),n=(e-this._xSlider.min)/(this._xSlider.max-this._xSlider.min);this._xSlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:r,cursorOffset:n})),this.boundsDidChange.emit({bounds:{min:e,max:s}})}yZoomListener(t){let e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,s=i-e;t.detail.zoomValue.zoomType>0?(e+=.1*s*(1-t.detail.zoomValue.coef),i=(i-=.1*s*t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i):(e-=.15*s*(1-t.detail.zoomValue.coef),i=(i=i+.15*s*1-t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i),this._chart.update(),this._ySlider.element.setAttribute("max-value",(this._ySlider.max-(i-e)).toString());let a=(i-e)/(this._ySlider.max-this._ySlider.min),r=(this._ySlider.max-i)/(this._ySlider.max-this._ySlider.min);this._ySlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:a,cursorOffset:r}))}xSliderListener(t){let e=this._chart.options.scales.xAxes[0].time.min._i,s=this._chart.options.scales.xAxes[0].time.max._i,a=t.detail.sliderValue-e;this._chart.options.scales.xAxes[0].time.min=i(e+a,"x"),this._chart.options.scales.xAxes[0].time.max=i(s+a,"x"),this._chart.update()}ySliderListener(t){let e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,s=t.detail.sliderValue-e;this._chart.options.scales.yAxes[0].ticks.min=e+s,this._chart.options.scales.yAxes[0].ticks.max=i+s,this._chart.update()}zoomReset(){this._chart.options.scales.xAxes[0].time.min=i(this._xSlider.min,"x"),this._chart.options.scales.xAxes[0].time.max=i(this._xSlider.max,"x"),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._ySlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:1,cursorOffset:0})),this._xSlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:1,cursorOffset:0}))}componentWillLoad(){this._config=s.mergeDeep(this._config,JSON.parse(this.config)),console.log("chart :",this._config)}componentDidLoad(){this.drawChart(),this.xSliderInit(),this.ySliderInit()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},t("button",{type:"button",onClick:()=>this.zoomReset()},"ZooM reset"),t("quantum-vertical-zoom-slider",{id:"ySlider","min-value":"","max-value":"",config:JSON.stringify(this._config)}),this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height}),t("quantum-horizontal-zoom-slider",{id:"xSlider","min-value":"","max-value":"",config:JSON.stringify(this._config)})))}static get is(){return"quantum-chart"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},config:{type:String,attr:"config"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},hiddenData:{type:Number,attr:"hidden-data",watchCallbacks:["hideData"]},options:{type:String,attr:"options",watchCallbacks:["changeScale"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0},{name:"didHideOrShowData",method:"didHideOrShowData",bubbles:!0,cancelable:!0,composed:!0},{name:"boundsDidChange",method:"boundsDidChange",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"xZoom",method:"xZoomListener"},{name:"yZoom",method:"yZoomListener"},{name:"xSliderValueChanged",method:"xSliderListener"},{name:"ySliderValueChanged",method:"ySliderListener"}]}static get style(){return"quantum-chart[data-quantum-chart]   .chart-container[data-quantum-chart]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class n{constructor(){this.unit="",this.type="pie",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let i=0;i<t;i++)e.push(s.getColor(i));return e}parseData(t){let e=[],i=[];return t.forEach(t=>{i.push(t[1]),e.push(t[0])}),{labels:e,data:i}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),i=this.parseData(JSON.parse(this.data));new e(t,{type:"gauge"===this.type?"doughnut":this.type,legend:{display:this.showLegend},data:{datasets:[{data:i.data,backgroundColor:this.generateColors(i.data.length),label:this.chartTitle}],labels:i.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0},circumference:this.getCirc(),rotation:this.getRotation()}})}getRotation(){return"gauge"===this.type?Math.PI:-.5*Math.PI}getCirc(){return"gauge"===this.type?Math.PI:2*Math.PI}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-pie"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return"host[data-quantum-pie]   .chart-container[data-quantum-pie]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class o{constructor(){this.unit="",this.type="polar",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let i=0;i<t;i++)e.push(s.transparentize(s.getColor(i),.5));return e}parseData(t){let e=[],i=[];return t.forEach(t=>{i.push(t[1]),e.push(t[0])}),{labels:e,datas:i}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),i=this.parseData(JSON.parse(this.data));new e.PolarArea(t,{type:this.type,legend:{display:this.showLegend},data:{datasets:[{data:i.datas,backgroundColor:this.generateColors(i.datas.length),label:this.chartTitle}],labels:i.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-polar"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return".chart-container[data-quantum-polar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class h{constructor(){this.unit="",this.chartTitle="",this.responsive=!0,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let i=0;i<t;i++)e.push(s.transparentize(s.getColor(i),.5));return e}parseData(t){let e=[],i=[];return t.forEach(t=>{i.push(t[1]),e.push(t[0])}),{labels:e,datas:i}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart");new e(t,{type:"radar",legend:{display:this.showLegend},data:{labels:["Beer","Rum","Peanut","Crisps"],datasets:[{data:[50,25,10,10],backgroundColor:"#64aa3939"},{data:[35,75,90,5],backgroundColor:"#642d882d"}]},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-radar"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return".chart-container[data-quantum-radar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class l{constructor(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),i=this.gtsToScatter(JSON.parse(this.data));const s=this;new e.Scatter(t,{data:{datasets:i},options:{legend:{display:this.showLegend},responsive:this.responsive,tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?s.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):s.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{type:"time",time:{min:this.timeMin,max:this.timeMax}}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]}}})}gtsToScatter(t){let e=[];return t.forEach(t=>{for(let i=0;i<t.gts.length;i++){let a=t.gts[i],r=[];a.v.forEach(t=>{r.push({x:t[0]/1e3,y:t[t.length-1]})});let n=s.getColor(i);t.params&&t.params[i]&&t.params[i].color&&(n=t.params[i].color);let o=`${a.c} - ${JSON.stringify(a.l)}`;t.params&&t.params[i]&&t.params[i].key&&(o=t.params[i].key),e.push({label:o,data:r,pointRadius:2,borderColor:n,backgroundColor:s.transparentize(n,.5)})}}),e}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-scatter"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"quantum-scatter[data-quantum-scatter]   .chart-container[data-quantum-scatter]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}export{a as QuantumBubble,r as QuantumChart,n as QuantumPie,o as QuantumPolar,h as QuantumRadar,l as QuantumScatter};