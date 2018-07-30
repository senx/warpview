/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as e}from"./chunk-cbb0389a.js";import{a as r}from"./chunk-cadd3091.js";export{a as QuantumChart}from"./chunk-352f9691.js";import"./chunk-ee323282.js";class i{constructor(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),a=JSON.parse(this.data);if(!a)return;const r=this;new e(t,{type:"bubble",tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?r.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):r.pointHover.emit({x:-100,y:this._eventPosition.y})}},legend:{display:this.showLegend},data:{datasets:this.parseData(a)},options:{borderWidth:1,scales:{yAxes:[{afterFit:function(t){t.width=100}}]},responsive:this.responsive}})}parseData(t){if(!t)return;let e=[];for(let a=0;a<t.length;a++){let i=Object.keys(t[a])[0],s=[],n=t[a][i];r.isArray(n)&&n.forEach(t=>{s.push({x:t[0],y:t[1],r:t[2]})}),e.push({data:s,label:i,backgroundColor:r.transparentize(r.getColor(a),.5),borderColor:r.getColor(a),borderWidth:1})}return e}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-bubble"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class s{constructor(){this.unit="",this.type="pie",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let a=0;a<t;a++)e.push(r.getColor(a));return e}parseData(t){let e=[],a=[];return t.forEach(t=>{a.push(t[1]),e.push(t[0])}),{labels:e,data:a}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),a=this.parseData(JSON.parse(this.data));new e(t,{type:"gauge"===this.type?"doughnut":this.type,legend:{display:this.showLegend},data:{datasets:[{data:a.data,backgroundColor:this.generateColors(a.data.length),label:this.chartTitle}],labels:a.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0},circumference:this.getCirc(),rotation:this.getRotation()}})}getRotation(){return"gauge"===this.type?Math.PI:-.5*Math.PI}getCirc(){return"gauge"===this.type?Math.PI:2*Math.PI}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-pie"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return"host .chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class n{constructor(){this.unit="",this.type="polar",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let a=0;a<t;a++)e.push(r.transparentize(r.getColor(a),.5));return e}parseData(t){let e=[],a=[];return t.forEach(t=>{a.push(t[1]),e.push(t[0])}),{labels:e,datas:a}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),a=this.parseData(JSON.parse(this.data));new e.PolarArea(t,{type:this.type,legend:{display:this.showLegend},data:{datasets:[{data:a.datas,backgroundColor:this.generateColors(a.datas.length),label:this.chartTitle}],labels:a.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-polar"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return".chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class h{constructor(){this.unit="",this.chartTitle="",this.responsive=!0,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}generateColors(t){let e=[];for(let a=0;a<t;a++)e.push(r.transparentize(r.getColor(a),.5));return e}parseData(t){let e=[],a=[];return t.forEach(t=>{a.push(t[1]),e.push(t[0])}),{labels:e,datas:a}}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart");new e(t,{type:"radar",legend:{display:this.showLegend},data:{labels:["Beer","Rum","Peanut","Crisps"],datasets:[{data:[50,25,10,10],backgroundColor:"#64aa3939"},{data:[35,75,90,5],backgroundColor:"#642d882d"}]},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-radar"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get style(){return".chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class o{constructor(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}redraw(t,e){e!==t&&this.drawChart()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart"),a=this.gtsToScatter(JSON.parse(this.data));const r=this;new e.Scatter(t,{data:{datasets:a},options:{legend:{display:this.showLegend},responsive:this.responsive,tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?r.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):r.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{type:"time",time:{min:this.timeMin,max:this.timeMax}}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]}}})}gtsToScatter(t){let e=[];return t.forEach(t=>{for(let a=0;a<t.gts.length;a++){let i=t.gts[a],s=[];i.v.forEach(t=>{s.push({x:t[0]/1e3,y:t[t.length-1]})});let n=r.getColor(a);t.params&&t.params[a]&&t.params[a].color&&(n=t.params[a].color);let h=`${i.c} - ${JSON.stringify(i.l)}`;t.params&&t.params[a]&&t.params[a].key&&(h=t.params[a].key),e.push({label:h,data:s,pointRadius:2,borderColor:n,backgroundColor:r.transparentize(n,.5)})}}),e}componentDidLoad(){this.drawChart()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height})))}static get is(){return"quantum-scatter"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"quantum-scatter .chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}export{i as QuantumBubble,s as QuantumPie,n as QuantumPolar,h as QuantumRadar,o as QuantumScatter};