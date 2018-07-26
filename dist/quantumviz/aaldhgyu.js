/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as e,b as i}from"./chunk-49509f30.js";import{a as s}from"./chunk-faa0a089.js";import"./chunk-ee323282.js";class a{constructor(){this.unit="",this.type="line",this.chartTitle="",this.responsive=!1,this.showLegend=!1,this.data="[]",this.options="{}",this.width="",this.height="",this.config="{}",this._xSlider={element:null,min:0,max:0},this._ySlider={element:null,min:0,max:0},this._config={rail:{class:""},cursor:{class:""}}}redraw(t,e){e!==t&&this.drawChart()}changeScale(t,e){if(e!==t){const e=JSON.parse(t);"timestamp"===e.time.timeMode?(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.options.scales.xAxes[0].time.displayFormats.millisecond=e.time.displayFormats,this._chart.update()):(this._chart.options.scales.xAxes[0].time.stepSize=e.time.stepSize,this._chart.options.scales.xAxes[0].time.unit=e.time.unit,this._chart.update())}}hideData(t){const e=this._chart.getDatasetMeta(t);null===e.hidden?e.hidden=!0:e.hidden=null,this._chart.update(),this.didHideOrShowData.emit()}drawChart(){let t=this.el.shadowRoot.querySelector("#myChart");if(!JSON.parse(this.data))return;let s=this.gtsToData(JSON.parse(this.data));const a=this,r={animation:!1,legend:{display:!1},tooltips:{mode:"x",position:"nearest",custom:function(t){t.opacity>0?a.pointHover.emit({x:t.dataPoints[0].x+15,y:this._eventPosition.y}):a.pointHover.emit({x:-100,y:this._eventPosition.y})}},scales:{xAxes:[{time:{min:i(this.timeMin?this.timeMin:s.ticks[0],"x"),max:i(this.timeMax?this.timeMax:s.ticks[s.ticks.length-1],"x"),unit:"day"},type:"time"}],yAxes:[{afterFit:function(t){t.width=100},scaleLabel:{display:!0,labelString:this.unit}}]},responsive:this.responsive,zoom:{enabled:!0,drag:!1,sensitivity:.5,mode:"x"}};"spline"===this.type&&(r.elements={line:{lineTension:0}}),"area"===this.type&&(r.elements={line:{fill:"start"}}),this._chart=new e(t,{type:"bar"===this.type?this.type:"line",data:{labels:s.ticks,datasets:s.datasets},options:r});let o=[],l=[];s.datasets.forEach(t=>{let e=Math.max(...t.data);e&&e!=1/0&&o.push(e)}),s.datasets.forEach(t=>{let e=Math.min(...t.data);(0==e||e&&e!=1/0)&&l.push(e)}),this._ySlider.min=Math.min(...l),this._ySlider.max=1.05*Math.max(...o),this._chart.options.scales.yAxes[0].ticks.min=this._ySlider.min,this._chart.options.scales.yAxes[0].ticks.max=this._ySlider.max,this._chart.update(),this._xSlider.min=s.ticks[0],this._xSlider.max=s.ticks[s.ticks.length-1]}xSliderInit(){let t=this.el.shadowRoot.querySelector("#xSlider");t.setAttribute("min-value",this._xSlider.min.toString()),t.setAttribute("max-value",this._xSlider.max.toString()),t.setAttribute("width",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width.toString()),this._xSlider.element=t}ySliderInit(){let t=this.el.shadowRoot.querySelector("#ySlider");t.setAttribute("min-value",this._ySlider.min.toString()),t.setAttribute("max-value",this._ySlider.max.toString()),t.setAttribute("height",this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height.toString()),this._ySlider.element=t}gtsToData(t){let e=[],i=[];if(t)return t.forEach(t=>{t.gts&&(t.gts=s.flatDeep(t.gts),t.gts.forEach((a,r)=>{let o=[];if(a.v){a.v.forEach(t=>{i.push(t[0]/1e3),o.push(t[t.length-1])});let l=s.getColor(r);t.params&&t.params[r]&&t.params[r].color&&(l=t.params[r].color);let n=s.serializeGtsMetadata(a);t.params&&t.params[r]&&t.params[r].key&&(n=t.params[r].key);let h={label:n,data:o,pointRadius:1,fill:!1,steppedLine:this.isStepped(),borderColor:l,borderWidth:1,backgroundColor:s.transparentize(l,.5)};if(t.params&&t.params[r]&&t.params[r].interpolate)switch(t.params[r].interpolate){case"line":h.lineTension=0;break;case"spline":break;case"area":h.fill=!0}e.push(h)}}))}),{datasets:e,ticks:s.unique(i)}}isStepped(){return!!this.type.startsWith("step")&&this.type.replace("step-","")}xZoomListener(t){let e=this._chart.options.scales.xAxes[0].time.min._i,s=this._chart.options.scales.xAxes[0].time.max._i,a=s-e;t.detail.zoomValue.zoomType>0?(e+=.1*a*t.detail.zoomValue.coef,s=(s-=.1*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:s,e=e<this._xSlider.min?this._xSlider.min:e,this._chart.options.scales.xAxes[0].time.min=i(e,"x"),this._chart.options.scales.xAxes[0].time.max=i(s,"x")):(e-=.15*a*t.detail.zoomValue.coef,s=(s+=.15*a*(1-t.detail.zoomValue.coef))>this._xSlider.max?this._xSlider.max:s,e=e<this._xSlider.min?this._xSlider.min:e,this._chart.options.scales.xAxes[0].time.min=i(e,"x"),this._chart.options.scales.xAxes[0].time.max=i(s,"x")),this._chart.update(),this._xSlider.element.setAttribute("max-value",(this._xSlider.max-(s-e)).toString());let r=(s-e)/(this._xSlider.max-this._xSlider.min),o=(e-this._xSlider.min)/(this._xSlider.max-this._xSlider.min);this._xSlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:r,cursorOffset:o})),this.boundsDidChange.emit({bounds:{min:e,max:s}})}yZoomListener(t){let e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,s=i-e;t.detail.zoomValue.zoomType>0?(e+=.1*s*(1-t.detail.zoomValue.coef),i=(i-=.1*s*t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i):(e-=.15*s*(1-t.detail.zoomValue.coef),i=(i=i+.15*s*1-t.detail.zoomValue.coef)>this._ySlider.max?this._ySlider.max:i,e=e<this._ySlider.min?this._ySlider.min:e,this._chart.options.scales.yAxes[0].ticks.min=e,this._chart.options.scales.yAxes[0].ticks.max=i),this._chart.update(),this._ySlider.element.setAttribute("max-value",(this._ySlider.max-(i-e)).toString());let a=(i-e)/(this._ySlider.max-this._ySlider.min),r=(this._ySlider.max-i)/(this._ySlider.max-this._ySlider.min);this._ySlider.element.setAttribute("cursor-size",JSON.stringify({cursorSize:a,cursorOffset:r}))}xSliderListener(t){let e=this._chart.options.scales.xAxes[0].time.min._i,s=this._chart.options.scales.xAxes[0].time.max._i,a=t.detail.sliderValue-e;this._chart.options.scales.xAxes[0].time.min=i(e+a,"x"),this._chart.options.scales.xAxes[0].time.max=i(s+a,"x"),this._chart.update()}ySliderListener(t){let e=this._chart.options.scales.yAxes[0].ticks.min,i=this._chart.options.scales.yAxes[0].ticks.max,s=t.detail.sliderValue-e;this._chart.options.scales.yAxes[0].ticks.min=e+s,this._chart.options.scales.yAxes[0].ticks.max=i+s,this._chart.update()}componentWillLoad(){this._config=s.mergeDeep(this._config,JSON.parse(this.config))}componentDidLoad(){this.drawChart(),this.xSliderInit(),this.ySliderInit()}render(){return t("div",null,t("h1",null,this.chartTitle),t("div",{class:"chart-container"},t("quantum-vertical-zoom-slider",{id:"ySlider","min-value":"","max-value":"",config:JSON.stringify(this._config)}),this.responsive?t("canvas",{id:"myChart"}):t("canvas",{id:"myChart",width:this.width,height:this.height}),t("quantum-horizontal-zoom-slider",{id:"xSlider","min-value":"","max-value":"",config:JSON.stringify(this._config)})))}static get is(){return"quantum-chart"}static get encapsulation(){return"shadow"}static get properties(){return{chartTitle:{type:String,attr:"chart-title"},config:{type:String,attr:"config"},data:{type:String,attr:"data",watchCallbacks:["redraw"]},el:{elementRef:!0},height:{type:String,attr:"height"},hiddenData:{type:Number,attr:"hidden-data",watchCallbacks:["hideData"]},options:{type:String,attr:"options",watchCallbacks:["changeScale"]},responsive:{type:Boolean,attr:"responsive"},showLegend:{type:Boolean,attr:"show-legend"},timeMax:{type:Number,attr:"time-max"},timeMin:{type:Number,attr:"time-min"},type:{type:String,attr:"type"},unit:{type:String,attr:"unit"},width:{type:String,attr:"width"}}}static get events(){return[{name:"pointHover",method:"pointHover",bubbles:!0,cancelable:!0,composed:!0},{name:"didHideOrShowData",method:"didHideOrShowData",bubbles:!0,cancelable:!0,composed:!0},{name:"boundsDidChange",method:"boundsDidChange",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"xZoom",method:"xZoomListener"},{name:"yZoom",method:"yZoomListener"},{name:"xSliderValueChanged",method:"xSliderListener"},{name:"ySliderValueChanged",method:"ySliderListener"}]}static get style(){return"quantum-chart .chart-container{width:var(--quantum-chart-width,100%);height:var(--quantum-chart-height,100%);position:relative}"}}class r{constructor(){this.cursorSize="{}",this.config="{}",this._config={rail:{class:""},cursor:{class:""}},this._cursorMinWidth=30}changeCursorSize(t,e){if(e!==t){let e=JSON.parse(t);e.cursorOffset+e.cursorSize<=100&&(this._cursor.style.left=(100*e.cursorOffset).toString()+"%",e.cursorSize*this._rail.getBoundingClientRect().width<this._cursorMinWidth?this._cursor.style.width=this._cursorMinWidth.toString()+"px":this._cursor.style.width=(100*e.cursorSize).toString()+"%")}}initSize(t,e){e!==t&&(this._rail.style.width=(.94*t).toString()+"px",console.log("width",(.94*t).toString()),console.log(this._rail.getBoundingClientRect()))}componentWillLoad(){this._config=s.mergeDeep(this._config,JSON.parse(this.config))}componentDidLoad(){this._rail=this.el.shadowRoot.querySelector("#rail"),this._cursor=this.el.shadowRoot.querySelector("#cursor")}mouseDown(t){t.preventDefault();let e=this;this.dimsX(t),this._rail.onmousemove=(t=>{e.dragX(t,e)}),this._cursor.onmouseup=(t=>{e.stopDrag(e)}),this._rail.onmouseup=(t=>{e.stopDrag(e)}),this._rail.onmouseout=(t=>{e.stopDrag(e)})}dimsX(t){let e=this._rail.getBoundingClientRect(),i=this._cursor.getBoundingClientRect();this._railMin=e.x,this._railMax=e.width+this._railMin,this._cursorWidth=i.width,this._mouseCursorLeftOffset=t.x-i.x,this._mouseCursorRightOffset=i.width-this._mouseCursorLeftOffset}dragX(t,e){if(t.preventDefault(),t.clientX-e._mouseCursorLeftOffset>=e._railMin&&t.clientX+e._mouseCursorRightOffset<=e._railMax){let i=t.clientX-e._rail.offsetLeft-e._mouseCursorLeftOffset;i=i<0?0:i,e._cursor.style.left=i+"px";let s=i/(this._railMax-this._railMin-this._cursorWidth)*(this.maxValue-this.minValue)+this.minValue;this.xSliderValueChanged.emit({sliderValue:s})}}stopDrag(t){t._rail.onmouseup=null,t._rail.onmousemove=null,t._cursor.onmouseup=null,t._rail.onmouseout=null}xWheel(t){t.preventDefault();let e=this._rail.getBoundingClientRect(),i=(t.pageX-this._rail.offsetLeft)/e.width;this.xZoom.emit({zoomValue:{coef:i,zoomType:-1*t.deltaY}})}yWheel(t){t.preventDefault()}render(){return t("div",{id:"rail",class:"rail "+this._config.rail.class,onWheel:t=>this.xWheel(t)},t("div",{id:"cursor",class:"cursor "+this._config.cursor.class,onMouseDown:t=>this.mouseDown(t)}))}static get is(){return"quantum-horizontal-zoom-slider"}static get encapsulation(){return"shadow"}static get properties(){return{config:{type:String,attr:"config"},cursorSize:{type:String,attr:"cursor-size",watchCallbacks:["changeCursorSize"]},el:{elementRef:!0},maxValue:{type:Number,attr:"max-value"},minValue:{type:Number,attr:"min-value"},width:{type:Number,attr:"width",watchCallbacks:["initSize"]}}}static get events(){return[{name:"xSliderValueChanged",method:"xSliderValueChanged",bubbles:!0,cancelable:!0,composed:!0},{name:"xZoom",method:"xZoom",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".rail{position:relative;background:grey;opacity:.7;float:right;left:0;height:20px;margin:0;border:1px solid #000;border-radius:6px;padding:0 1px 1px 0}.rail:hover{opacity:1}.cursor{background:red;position:relative;cursor:move;width:100%;height:20px;border:1px solid #000;border-radius:6px;left:0;-webkit-transition:left .01s;transition:left .01s}"}}class o{constructor(){this.cursorSize="{}",this.config="{}",this._config={rail:{class:""},cursor:{class:""}},this._cursorMinHeight=30}changeCursorSize(t,e){if(e!==t){let e=JSON.parse(t);e.cursorOffset+e.cursorSize<=100&&(this._cursor.style.top=(100*e.cursorOffset).toString()+"%",e.cursorSize*this._rail.getBoundingClientRect().height<this._cursorMinHeight?this._cursor.style.height=this._cursorMinHeight.toString()+"px":this._cursor.style.height=(100*e.cursorSize).toString()+"%")}}initSize(t,e){e!==t&&(this._rail.style.height=(.97*t).toString()+"px",console.log("width",(.94*t).toString()),console.log(this._rail.getBoundingClientRect()))}componentWillLoad(){this._config=s.mergeDeep(this._config,JSON.parse(this.config))}componentDidLoad(){this._rail=this.el.shadowRoot.querySelector("#rail"),this._cursor=this.el.shadowRoot.querySelector("#cursor")}mouseDown(t){console.log("min et max",this.minValue,this.maxValue),t.preventDefault();let e=this;this.dimsY(t),this._rail.onmousemove=(t=>{e.dragY(t,e)}),this._cursor.onmouseup=(t=>{e.stopDrag(e)}),this._rail.onmouseup=(t=>{e.stopDrag(e)}),this._rail.onmouseout=(t=>{e.stopDrag(e)})}dimsY(t){let e=this._rail.getBoundingClientRect(),i=this._cursor.getBoundingClientRect();this._railMin=this._rail.offsetTop,this._railMax=e.height+this._rail.offsetTop,this._cursorHeight=i.height,this._mouseCursorTopOffset=t.pageY-this._rail.offsetTop-this._cursor.offsetTop,this._mouseCursorBottomOffset=i.height-this._mouseCursorTopOffset}dragY(t,e){if(t.preventDefault(),t.pageY-e._mouseCursorTopOffset>=e._railMin&&t.pageY+e._mouseCursorBottomOffset<=e._railMax){let i=t.pageY-e._rail.offsetTop-e._mouseCursorTopOffset;i=i<0?0:i,e._cursor.style.top=i+"px";let s=i/(this._railMax-this._railMin-this._cursorHeight)*(this.maxValue-this.minValue)+this.minValue;s=this.maxValue-this.minValue-s,this.ySliderValueChanged.emit({sliderValue:s}),console.log("V",i),console.log(s)}}stopDrag(t){t._rail.onmouseup=null,t._rail.onmousemove=null,t._cursor.onmouseup=null,t._rail.onmouseout=null}yWheel(t){t.preventDefault();let e=this._rail.getBoundingClientRect(),i=(t.pageY-this._rail.offsetTop)/e.height;this.yZoom.emit({zoomValue:{coef:i,zoomType:-1*t.deltaY}})}render(){return t("div",{id:"rail",class:"rail "+this._config.rail.class,onWheel:t=>this.yWheel(t)},t("div",{id:"cursor",class:"cursor "+this._config.cursor.class,onMouseDown:t=>this.mouseDown(t)}))}static get is(){return"quantum-vertical-zoom-slider"}static get encapsulation(){return"shadow"}static get properties(){return{config:{type:String,attr:"config"},cursorSize:{type:String,attr:"cursor-size",watchCallbacks:["changeCursorSize"]},el:{elementRef:!0},height:{type:Number,attr:"height",watchCallbacks:["initSize"]},maxValue:{type:Number,attr:"max-value"},minValue:{type:Number,attr:"min-value"}}}static get events(){return[{name:"ySliderValueChanged",method:"ySliderValueChanged",bubbles:!0,cancelable:!0,composed:!0},{name:"yZoom",method:"yZoom",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".rail{position:absolute;background:grey;opacity:.7;width:20px;margin:0 0 20px 0;border:1px solid #000;border-radius:6px;padding:0}.rail:hover{opacity:1}.cursor{background:red;position:relative;cursor:move;width:20px;height:100%;border:1px solid #000;border-radius:6px;-webkit-transition:top .01s;transition:top .01s}"}}export{a as QuantumChart,r as QuantumHorizontalZoomSlider,o as QuantumVerticalZoomSlider};