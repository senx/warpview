/*! Built with http://stenciljs.com */
quantumviz.loadBundle("oy8dfsxw",["exports","./chunk-d9eae628.js","./chunk-a824490f.js","./chunk-12ee72ee.js"],function(t,e,i,r){var a=window.quantumviz.h,n=function(){function t(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart"),i=JSON.parse(this.data);if(i){var r=this;new e.Chart(t,{type:"bubble",tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?r.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):r.pointHover.emit({x:-100,y:this._eventPosition.y})}},legend:{display:this.showLegend},data:{datasets:this.parseData(i)},options:{borderWidth:1,scales:{yAxes:[{afterFit:function(t){t.width=100}}]},responsive:this.responsive}})}},t.prototype.parseData=function(t){if(t){for(var e=[],r=function(r){var a=Object.keys(t[r])[0],n=[],s=t[r][a];i.GTSLib.isArray(s)&&s.forEach(function(t){n.push({x:t[0],y:t[1],r:t[2]})}),e.push({data:n,label:a,backgroundColor:i.GTSLib.transparentize(i.GTSLib.getColor(r),.5),borderColor:i.GTSLib.getColor(r),borderWidth:1})},a=0;a<t.length;a++)r(a);return e}},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"quantum-bubble"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".chart-container[data-quantum-bubble]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),s=function(){function t(){this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!1,this.data="[]",this.options="{}",this.width="",this.height="",this.config="{}",this._xSlider={element:null,min:0,max:0},this._ySlider={element:null,min:0,max:0},this._config={rail:{class:""},cursor:{class:""}}}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.changeScale=function(t,e){if(e!==t){var i=JSON.parse(t);"timestamp"===i.time.timeMode?(this._chart.options.scales.xAxes[0].time.stepSize=i.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=i.time.unit,this._chart.options.scales.xAxes[0].time.displayFormats.millisecond=i.time.displayFormats,this._chart.update()):(this._chart.options.scales.xAxes[0].time.stepSize=i.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=i.time.unit,this._chart.update())}},t.prototype.hideData=function(t){var e=this._chart.getDatasetMeta(t);null===e.hidden?e.hidden=!0:e.hidden=null,this._chart.update(),this.didHideOrShowData.emit()},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart");if(JSON.parse(this.data)){var i=this.gtsToData(JSON.parse(this.data)),r=this,a={animation:!1,legend:{display:!1},tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?r.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):r.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{time:{min:e.moment(this.timeMin?this.timeMin:i.ticks[0],"x"),max:e.moment(this.timeMax?this.timeMax:i.ticks[i.ticks.length-1],"x"),unit:"day"},type:"time"}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]},responsive:this.responsive,zoom:{enabled:!0,drag:!1,sensitivity:.5,mode:"x"}};"spline"===this.type&&(a.elements={line:{lineTension:0}}),"area"===this.type&&(a.elements={line:{fill:"start"}}),this._chart=new e.Chart(t,{type:"bar"===this.type?this.type:"line",data:{labels:i.ticks,datasets:i.datasets},options:a});var n=[],s=[];i.datasets.forEach(function(t){var e=Math.max.apply(Math,t.data);e&&e!=1/0&&n.push(e)}),i.datasets.forEach(function(t){var e=Math.min.apply(Math,t.data);(0==e||e&&e!=1/0)&&s.push(e)}),this._ySlider.min=Math.min.apply(Math,s),this._ySlider.max=1.05*Math.max.apply(Math,n),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._xSlider.min=i.ticks[0],this._xSlider.max=i.ticks[i.ticks.length-1]}},t.prototype.xSliderInit=function(){var t=this.el.shadowRoot.querySelector("#xSlider");t.setAttribute("min-value",this._xSlider.min.toString()),t.setAttribute("max-value",this._xSlider.max.toString()),t.setAttribute("width",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width.toString()),this._xSlider.element=t},t.prototype.ySliderInit=function(){var t=this.el.shadowRoot.querySelector("#ySlider");t.setAttribute("min-value",this._ySlider.min.toString()),t.setAttribute("max-value",this._ySlider.max.toString()),t.setAttribute("height",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height.toString()),this._ySlider.element=t},t.prototype.gtsToData=function(t){var e=this,r=[],a=[];if(t)return t.forEach(function(t){t.gts&&(t.gts=i.GTSLib.flatDeep(t.gts),t.gts.forEach(function(n,s){var o=[];if(n.v){n.v.forEach(function(t){a.push(t[0]/1e3),o.push(t[t.length-1])});var h=i.GTSLib.getColor(s);t.params&&t.params[s]&&t.params[s].color&&(h=t.params[s].color);var l=i.GTSLib.serializeGtsMetadata(n);t.params&&t.params[s]&&t.params[s].key&&(l=t.params[s].key);var c={label:l,data:o,pointRadius:1,fill:!1,steppedLine:e.isStepped(),borderColor:h,borderWidth:1,backgroundColor:i.GTSLib.transparentize(h,.5)};if(t.params&&t.params[s]&&t.params[s].interpolate)switch(t.params[s].interpolate){case"line":c.lineTension=0;break;case"spline":break;case"area":c.fill=!0}r.push(c)}}))}),{datasets:r,ticks:i.GTSLib.unique(a)}},t.prototype.isStepped=function(){return!!this.type.startsWith("step")&&this.type.replace("step-","")},t.prototype.xZoomListener=function(t){var i=this._chart.options.scales.xAxes[0].time.min._i,r=this._chart.options.scales.xAxes[0].time.max._i,a=r-i;t.detail.zoomValue.zoomType>0?(i+=.1*a*t.detail.zoomValue.coef,r=(r-=.1*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:r,i=i<this._xSlider.min?this._xSlider.min:i,this._chart.options.scales.xAxes[0].time.min=e.moment(i,"x"),this._chart.options.scales.xAxes[0].time.max=e.moment(r,"x")):(i-=.15*a*t.detail.zoomValue.coef,r=(r+=.15*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:r,i=i<this._xSlider.min?this._xSlider.min:i,this._chart.options.scales.xAxes[0].time.min=e.moment(i,"x"),this._chart.options.scales.xAxes[0].time.max=e.moment(r,"x")),this._chart.update(),this._xSlider.element.setAttribute("max-value",(this._xSlider.max-(r-i)).toString());var n=(r-i)/(this._xSlider.max-this._xSlider.min),s=(i-this._xSlider.min)/(this._xSlider.max-this._xSlider.min);this._xSlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:n,cursorOffset:s})),this.boundsDidChange.emit({bounds:{min:i,max:r}})},t.prototype.yZoomListener=function(t){var e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,r=i-e;t.detail.zoomValue.zoomType>0?(e+=.1*r*(1-t.detail.zoomValue.coef),i=(i-=.1*r*t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i):(e-=.15*r*(1-t.detail.zoomValue.coef),i=(i=i+.15*r*1-t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i),this._chart.update(),this._ySlider.element.setAttribute("max-value",(this._ySlider.max-(i-e)).toString());var a=(i-e)/(this._ySlider.max-this._ySlider.min),n=(this._ySlider.max-i)/(this._ySlider.max-this._ySlider.min);this._ySlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:a,cursorOffset:n}))},t.prototype.xSliderListener=function(t){var i=this._chart.options.scales.xAxes[0].time.min._i,r=this._chart.options.scales.xAxes[0].time.max._i,a=t.detail.sliderValue-i;this._chart.options.scales.xAxes[0].time.min=e.moment(i+a,"x"),this._chart.options.scales.xAxes[0].time.max=e.moment(r+a,"x"),this._chart.update()},t.prototype.ySliderListener=function(t){var e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,r=t.detail.sliderValue-e;this._chart.options.scales.yAxes[0].ticks.min=e+r,this._chart.options.scales.yAxes[0].ticks.max=i+r,this._chart.update()},t.prototype.zoomReset=function(){this._chart.options.scales.xAxes[0].time.min=e.moment(this._xSlider.min,"x"),this._chart.options.scales.xAxes[0].time.max=e.moment(this._xSlider.max,"x"),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._ySlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:1,cursorOffset:0})),this._xSlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:1,cursorOffset:0}))},t.prototype.componentWillLoad=function(){this._config=i.GTSLib.mergeDeep(this._config,JSON.parse(this.config)),console.log("chart :",this._config)},t.prototype.componentDidLoad=function(){this.drawChart(),this.xSliderInit(),this.ySliderInit()},t.prototype.render=function(){var t=this;return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},a("button",{type:"button",onClick:function(){return t.zoomReset()}},"ZooM reset"),a("quantum-vertical-zoom-slider",{id:"ySlider","min-value":"","max-value":"",config:JSON.stringify(this._config)}),this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height}),a("quantum-horizontal-zoom-slider",{id:"xSlider","min-value":"","max-value":"",config:JSON.stringify(this._config)})))},Object.defineProperty(t,"is",{get:function(){return"quantum-chart"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},config:{type:String,attr:"config"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},hiddenData:{type:Number,attr:"hidden-data",watchCallbacks:["hideData"]},options:{type:String,attr:"options",watchCallbacks:["changeScale"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0},{name:"didHideOrShowData",method:"didHideOrShowData",bubbles:!0,cancelable:!0,composed:!0},{name:"boundsDidChange",method:"boundsDidChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"listeners",{get:function(){return[{name:"xZoom",method:"xZoomListener"},{name:"yZoom",method:"yZoomListener"},{name:"xSliderValueChanged",method:"xSliderListener"},{name:"ySliderValueChanged",method:"ySliderListener"}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"quantum-chart[data-quantum-chart]   .chart-container[data-quantum-chart]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),o=function(){function t(){this.unit="",this.type="pie",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.generateColors=function(t){for(var e=[],r=0;r<t;r++)e.push(i.GTSLib.getColor(r));return e},t.prototype.parseData=function(t){var e=[],i=[];return t.forEach(function(t){i.push(t[1]),e.push(t[0])}),{labels:e,data:i}},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart"),i=this.parseData(JSON.parse(this.data));new e.Chart(t,{type:"gauge"===this.type?"doughnut":this.type,legend:{display:this.showLegend},data:{datasets:[{data:i.data,backgroundColor:this.generateColors(i.data.length),label:this.chartTitle}],labels:i.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0},circumference:this.getCirc(),rotation:this.getRotation()}})},t.prototype.getRotation=function(){return"gauge"===this.type?Math.PI:-.5*Math.PI},t.prototype.getCirc=function(){return"gauge"===this.type?Math.PI:2*Math.PI},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"quantum-pie"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"host[data-quantum-pie]   .chart-container[data-quantum-pie]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),h=function(){function t(){this.unit="",this.type="polar",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.generateColors=function(t){for(var e=[],r=0;r<t;r++)e.push(i.GTSLib.transparentize(i.GTSLib.getColor(r),.5));return e},t.prototype.parseData=function(t){var e=[],i=[];return t.forEach(function(t){i.push(t[1]),e.push(t[0])}),{labels:e,datas:i}},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart"),i=this.parseData(JSON.parse(this.data));new e.Chart.PolarArea(t,{type:this.type,legend:{display:this.showLegend},data:{datasets:[{data:i.datas,backgroundColor:this.generateColors(i.datas.length),label:this.chartTitle}],labels:i.labels},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"quantum-polar"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".chart-container[data-quantum-polar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),l=function(){function t(){this.unit="",this.chartTitle="",this.responsive=!0,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.generateColors=function(t){for(var e=[],r=0;r<t;r++)e.push(i.GTSLib.transparentize(i.GTSLib.getColor(r),.5));return e},t.prototype.parseData=function(t){var e=[],i=[];return t.forEach(function(t){i.push(t[1]),e.push(t[0])}),{labels:e,datas:i}},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart");new e.Chart(t,{type:"radar",legend:{display:this.showLegend},data:{labels:["Beer","Rum","Peanut","Crisps"],datasets:[{data:[50,25,10,10],backgroundColor:"#64aa3939"},{data:[35,75,90,5],backgroundColor:"#642d882d"}]},options:{responsive:this.responsive,tooltips:{mode:"index",intersect:!0}}})},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"quantum-radar"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".chart-container[data-quantum-radar]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}(),c=function(){function t(){this.unit="",this.chartTitle="",this.responsive=!1,this.showLegend=!0,this.data="[]",this.options={},this.width="",this.height=""}return t.prototype.redraw=function(t,e){e!==t&&this.drawChart()},t.prototype.drawChart=function(){var t=this.el.shadowRoot.querySelector("#myChart"),i=this.gtsToScatter(JSON.parse(this.data)),r=this;new e.Chart.Scatter(t,{data:{datasets:i},options:{legend:{display:this.showLegend},responsive:this.responsive,tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?r.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):r.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{type:"time",time:{min:this.timeMin,max:this.timeMax}}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]}}})},t.prototype.gtsToScatter=function(t){var e=[];return t.forEach(function(t){for(var r=function(r){var a=t.gts[r],n=[];a.v.forEach(function(t){n.push({x:t[0]/1e3,y:t[t.length-1]})});var s=i.GTSLib.getColor(r);t.params&&t.params[r]&&t.params[r].color&&(s=t.params[r].color);var o=a.c+" - "+JSON.stringify(a.l);t.params&&t.params[r]&&t.params[r].key&&(o=t.params[r].key),e.push({label:o,data:n,pointRadius:2,borderColor:s,backgroundColor:i.GTSLib.transparentize(s,.5)})},a=0;a<t.gts.length;a++)r(a)}),e},t.prototype.componentDidLoad=function(){this.drawChart()},t.prototype.render=function(){return a("div",null,a("h1",null,this.chartTitle),a("div",{class:"chart-container"},this.responsive?a("canvas",{id:"myChart"}):a("canvas",{id:"myChart",width:this.width,height:this.height})))},Object.defineProperty(t,"is",{get:function(){return"quantum-scatter"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{chartTitle:{type:String,attr:"chart-title"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},options:{type:"Any",attr:"options"},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"quantum-scatter[data-quantum-scatter]   .chart-container[data-quantum-scatter]{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"},enumerable:!0,configurable:!0}),t}();t.QuantumBubble=n,t.QuantumChart=s,t.QuantumPie=o,t.QuantumPolar=h,t.QuantumRadar=l,t.QuantumScatter=c,Object.defineProperty(t,"__esModule",{value:!0})});