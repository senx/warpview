const t=window.warpview.h;import{c as e,a as s,b as i}from"./chunk-97ee157e.js";import{b as a,a as h,c as n}from"./chunk-d3ecdc47.js";import{a as o}from"./chunk-8d7a9c7e.js";class d{constructor(){this.gtsList=new e,this.maxToShow=5,this.hiddenData=[],this.debug=!1,this.kbdLastKeyPressed=[],this.displayed=[],this.current=0,this._gts=[],this.modalOpenned=!1}onWarpViewModalOpen(){this.modalOpenned=!0}onWarpViewModalClose(){this.modalOpenned=!1}handleKeyDown(t){if("s"!==t[0]||this.modalOpenned){if(this.modalOpenned)switch(t[0]){case"ArrowUp":case"j":this.current=Math.max(0,this.current-1),this.prepareData();break;case"ArrowDown":case"k":this.current=Math.min(this._gts.length-1,this.current+1),this.prepareData();break;case" ":this.warpViewSelectedGTS.emit({gts:this._gts[this.current],selected:this.hiddenData.indexOf(this._gts[this.current].id)>-1});break;default:return!0}}else this.showPopup()}isOpened(){return this.modal.isOpened()}onHideData(t,e){this.LOG.debug(["hiddenData"],t),this.prepareData()}onData(t,e){this.LOG.debug(["data"],t),this.prepareData()}showPopup(){this.current=0,this.prepareData(),this.modal.open()}prepareData(){this.gtsList&&this.gtsList.data&&(this._gts=s.flatDeep([this.gtsList.data]),this.displayed=this._gts.slice(Math.max(0,Math.min(this.current-this.maxToShow,this._gts.length-2*this.maxToShow)),Math.min(this._gts.length,this.current+this.maxToShow+Math.abs(Math.min(this.current-this.maxToShow,0)))),this.LOG.debug(["prepareData"],this.displayed))}componentWillLoad(){this.LOG=new i(d,this.debug)}componentDidLoad(){this.prepareData()}render(){return t("warp-view-modal",{kbdLastKeyPressed:this.kbdLastKeyPressed,modalTitle:"GTS Selector",ref:t=>{this.modal=t}},this.current>0?t("div",{class:"up-arrow"}):"",t("ul",null,this._gts.map((e,s)=>t("li",{class:this.current==s?"selected":"",style:this.displayed.find(t=>t.id===e.id)?{}:{display:"none"}},t("warp-view-chip",{node:{gts:e},name:e.c,hiddenData:this.hiddenData})))),this.current<this._gts.length-1?t("div",{class:"down-arrow"}):"")}static get is(){return"warp-view-gts-popup"}static get encapsulation(){return"shadow"}static get properties(){return{current:{state:!0},debug:{type:Boolean,attr:"debug"},displayed:{state:!0},gtsList:{type:"Any",attr:"gts-list",watchCallbacks:["onData"]},hiddenData:{type:"Any",attr:"hidden-data",watchCallbacks:["onHideData"]},isOpened:{method:!0},kbdLastKeyPressed:{type:"Any",attr:"kbd-last-key-pressed",watchCallbacks:["handleKeyDown"]},maxToShow:{type:Number,attr:"max-to-show"}}}static get events(){return[{name:"warpViewSelectedGTS",method:"warpViewSelectedGTS",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"warpViewModalOpen",method:"onWarpViewModalOpen"},{name:"warpViewModalClose",method:"onWarpViewModalClose"}]}static get style(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host ul{list-style:none;position:relative}:host ul li{line-height:1.5em;padding-left:10px;margin-right:20px}:host ul li.selected{background-color:var(--warpview-popup-selected-bg-color,#ddd)}:host .down-arrow{bottom:2px}:host .down-arrow,:host .up-arrow{position:absolute;left:2px;width:35px;height:35px;background-image:var(--warpview-popup-arrow-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:50%;background-repeat:no-repeat}:host .up-arrow{top:2px;-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);-ms-transform:rotate(180deg);-o-transform:rotate(180deg);transform:rotate(180deg)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-attrvalue,:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;margin-right:5px}"}}class r{constructor(){this.width="",this.height="",this.responsive=!1,this.showLegend=!1,this.gtsFilter="",this.debug=!1,this.isAlone=!1,this._options={showControls:!0,showGTSTree:!0,showDots:!0},this._data=new e,this._toHide=[],this.showChart=!0,this.showMap=!1,this.chartType="line",this.timeClipValue="",this.kbdLastKeyPressed=[],this.kbdCounter=0,this.preventDefaultKeyList=["Escape","/"],this.preventDefaultKeyListInModals=["Escape","ArrowUp","ArrowDown"," ","/"]}componentDidLoad(){this.drawCharts(!0)}async getTimeClip(){return this.LOG.debug(["getTimeClip"],this.chart.getTimeClip()),this.chart.getTimeClip()}onGtsFilter(t,e){e!==t&&this.drawCharts()}onData(t,e){a(t,e)||(this.LOG.debug(["data"],t),this.drawCharts(!0))}onOptions(t,e){a(t,e)||(this.LOG.debug(["options"],t),this.drawCharts())}handleLocalKeydown(t){this.isAlone||this.handleKeyDown(t).then(()=>{})}handleDocKeydown(t){this.isAlone&&this.handleKeyDown(t).then(()=>{})}async handleKeyDown(t){this.LOG.debug(["document:keydown"],t),this.preventDefaultKeyList.indexOf(t.key)>=0&&t.preventDefault(),(await this.timeClip.isOpened()||await this.modal.isOpened()||await this.gtsPopupModal.isOpened())&&this.preventDefaultKeyListInModals.indexOf(t.key)>=0&&t.preventDefault(),"/"===t.key?(this.modal.open(),this.filterInput.focus(),this.filterInput.select()):"t"===t.key?this.chart.getTimeClip().then(t=>{this.timeClipValue=`${Math.round(t[0]).toString()} ISO8601 ${Math.round(t[1]).toString()} ISO8601 TIMECLIP`,this.LOG.debug(["handleKeyUp","t"],this.timeClipValue),this.timeClip.open()}):this.pushKbdEvent(t.key)}pushKbdEvent(t){this.kbdCounter++,this.kbdLastKeyPressed=[t,this.kbdCounter.toString()]}stateChange(t){switch(this.LOG.debug(["stateChange"],t.detail),t.detail.id){case"timeSwitch":this._options.timeMode=t.detail.state?"timestamp":"date",this.drawCharts();break;case"typeSwitch":this.chartType=t.detail.state?"step":"line",this.drawCharts();break;case"chartSwitch":this.showChart=t.detail.state,this.drawCharts();break;case"mapSwitch":this.showMap=t.detail.state,this.showMap&&window.setTimeout(()=>this.map.resize(),500)}}boundsDidChange(t){this.LOG.debug(["boundsDidChange"],t.detail),this._timeMin=t.detail.bounds.min,this._timeMax=t.detail.bounds.max,this.line.style.left="-100px"}onResize(t){this.LOG.debug(["warpViewChartResize"],t.detail),this.chartContainer&&(this.chartContainer.style.height=t.detail.h+"px")}warpViewSelectedGTS(t){this.LOG.debug(["warpViewSelectedGTS"],t.detail),this._toHide.find(e=>e===t.detail.gts.id)||t.detail.selected?t.detail.selected&&(this._toHide=this._toHide.filter(e=>e!==t.detail.gts.id)):this._toHide.push(t.detail.gts.id),this.LOG.debug(["warpViewSelectedGTS"],this._toHide),this._toHide=this._toHide.slice(),this.drawCharts()}handleMouseMove(t){this.mouseOutTimer&&(window.clearTimeout(this.mouseOutTimer),delete this.mouseOutTimer),this.mouseOutTimer||(this.mouseOutTimer=window.setTimeout(()=>{this.line.style.display="block",this.line.style.left=Math.max(t.clientX-this.main.getBoundingClientRect().left,100)+"px"},1))}handleMouseOut(t){this.line.style.left=Math.max(t.clientX-this.main.getBoundingClientRect().left,100)+"px",this.mouseOutTimer&&(window.clearTimeout(this.mouseOutTimer),delete this.mouseOutTimer),this.mouseOutTimer||(this.mouseOutTimer=window.setTimeout(()=>{this.line.style.left="-100px",this.line.style.display="none"},500))}drawCharts(t=!1){this.LOG.debug(["drawCharts"],[this.data,this.options]),this.timeClip.close(),this.modal.close();let e=h.mergeDeep(this._options,this.options);this._data=s.getData(this.data);let i=new n;if(i="string"==typeof this.options?JSON.parse(this.options):this.options,e=h.mergeDeep(e,i),this.LOG.debug(["PPts"],"firstdraw ",t),t){let t=100*s.getDivider(this._options.timeUnit),i=this._data.data;if(i){let a=s.flattenGtsIdArray(i,0).res;a=s.flatDeep(a);let h=!0;a.forEach(e=>{e.v.length>0&&(h=(h=h&&e.v[0][0]>-t&&e.v[0][0]<t)&&e.v[e.v.length-1][0]>-t&&e.v[e.v.length-1][0]<t)}),h&&(e.timeMode="timestamp")}}this._options=Object.assign({},e),this.LOG.debug(["drawCharts","parsed"],this._data,this._options)}applyFilter(){this.gtsFilter=this.filterInput.value,this.modal.close()}componentWillLoad(){this.LOG=new i(r,this.debug)}onWarpViewModalClose(){this.mainPlotDiv.focus()}inputTextKeyboardEvents(t){t.stopImmediatePropagation(),"Enter"===t.key?this.applyFilter():"Escape"===t.key&&this.pushKbdEvent("Escape")}tzSelected(){let t=this.tzSelector.value;this.LOG.debug(["timezone","tzselect"],t),this._options.timeZone=t,this.tzSelector.setAttribute("class","UTC"===t?"defaulttz":"customtz"),this.drawCharts()}render(){return t("div",{id:"focusablePlotDiv",tabindex:"0",onClick:t=>{this.isAlone||"SELECT"==t.path[0].nodeName||this.mainPlotDiv.focus()},ref:t=>this.mainPlotDiv=t},t("warp-view-modal",{kbdLastKeyPressed:this.kbdLastKeyPressed,modalTitle:"TimeClip",ref:t=>this.timeClip=t},t("pre",null,t("code",{ref:t=>this.timeClipElement=t,innerHTML:this.timeClipValue}))),t("warp-view-modal",{kbdLastKeyPressed:this.kbdLastKeyPressed,modalTitle:"GTS Filter",ref:t=>this.modal=t},t("label",null,"Enter a regular expression to filter GTS."),t("input",{tabindex:"1",type:"text",onKeyPress:t=>this.inputTextKeyboardEvents(t),onKeyDown:t=>this.inputTextKeyboardEvents(t),onKeyUp:t=>this.inputTextKeyboardEvents(t),ref:t=>this.filterInput=t,value:this.gtsFilter}),t("button",{tabindex:"2",type:"button",class:this._options.popupButtonValidateClass,onClick:()=>this.applyFilter(),innerHTML:this._options.popupButtonValidateLabel||"Apply"})),this._options.showControls?t("div",{class:"inline"},t("warp-view-toggle",{id:"timeSwitch","text-1":"Date","text-2":"Timestamp",checked:"timestamp"==this._options.timeMode}),t("warp-view-toggle",{id:"typeSwitch","text-1":"Line","text-2":"Step"}),t("warp-view-toggle",{id:"chartSwitch","text-1":"Hide chart","text-2":"Display chart",checked:this.showChart}),t("warp-view-toggle",{id:"mapSwitch","text-1":"Hide map","text-2":"Display map",checked:this.showMap}),t("div",{class:"tzcontainer"},t("select",{id:"tzSelector",class:"defaulttz",ref:t=>this.tzSelector=t,onChange:()=>this.tzSelected()},o.tz.names().map(e=>t("option",{value:e,selected:"UTC"===e,class:"UTC"===e?"defaulttz":"customtz"},e))))):"",this._options.showGTSTree?t("warp-view-gts-tree",{data:this._data,id:"tree",gtsFilter:this.gtsFilter,debug:this.debug,hiddenData:this._toHide,options:this._options,kbdLastKeyPressed:this.kbdLastKeyPressed}):"",this.showChart?t("div",{class:"main-container",onMouseMove:t=>this.handleMouseMove(t),onMouseLeave:t=>this.handleMouseOut(t),ref:t=>this.main=t},t("div",{class:"bar",ref:t=>this.line=t}),t("div",{class:"annotation"},t("warp-view-annotation",{data:this._data,responsive:this.responsive,id:"annotation",showLegend:this.showLegend,ref:t=>this.annotation=t,debug:this.debug,timeMin:this._timeMin,timeMax:this._timeMax,standalone:!1,hiddenData:this._toHide,options:this._options})),t("div",{style:{width:"100%",height:"768px"},ref:t=>this.chartContainer=t},t("warp-view-gts-popup",{maxToShow:5,hiddenData:this._toHide,gtsList:this._data,kbdLastKeyPressed:this.kbdLastKeyPressed,ref:t=>this.gtsPopupModal=t}),t("warp-view-chart",{id:"chart",responsive:this.responsive,standalone:!1,data:this._data,ref:t=>this.chart=t,debug:this.debug,hiddenData:this._toHide,type:this.chartType,options:this._options}))):"",this.showMap?t("div",{class:"map-container"},t("warp-view-map",{options:this._options,ref:t=>this.map=t,data:this._data,debug:this.debug,responsive:this.responsive,hiddenData:this._toHide})):"")}static get is(){return"warp-view-plot"}static get encapsulation(){return"shadow"}static get properties(){return{_data:{state:!0},_options:{state:!0},_timeMax:{state:!0},_timeMin:{state:!0},_toHide:{state:!0},chartType:{state:!0},data:{type:String,attr:"data",watchCallbacks:["onData"]},debug:{type:Boolean,attr:"debug"},getTimeClip:{method:!0},gtsFilter:{type:String,attr:"gts-filter",mutable:!0,watchCallbacks:["onGtsFilter"]},height:{type:String,attr:"height",mutable:!0},isAlone:{type:Boolean,attr:"is-alone"},kbdLastKeyPressed:{state:!0},options:{type:String,attr:"options",watchCallbacks:["onOptions"]},responsive:{type:Boolean,attr:"responsive"},showChart:{state:!0},showLegend:{type:Boolean,attr:"show-legend"},showMap:{state:!0},timeClipValue:{state:!0},width:{type:String,attr:"width",mutable:!0}}}static get listeners(){return[{name:"keydown",method:"handleLocalKeydown"},{name:"document:keydown",method:"handleDocKeydown"},{name:"stateChange",method:"stateChange"},{name:"boundsDidChange",method:"boundsDidChange"},{name:"warpViewChartResize",method:"onResize"},{name:"warpViewSelectedGTS",method:"warpViewSelectedGTS"},{name:"warpViewModalClose",method:"onWarpViewModalClose"}]}static get style(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host,:host .main-container{position:relative}:host .map-container{height:768px;width:calc(100% - 25px);margin-top:20px;margin-right:20px;position:relative}:host .bar{width:1px;left:-100px;position:absolute;background-color:var(--warp-view-bar-color,red);top:0;bottom:55px;overflow:hidden;display:none;z-index:0}:host .inline{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:space-evenly;justify-content:space-evenly;-ms-flex-align:stretch;align-items:stretch;width:100%}:host label{display:inline-block}:host input{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}:host .annotation{max-width:100%;margin-top:20px;margin-bottom:20px}:host #focusablePlotDiv:focus{outline:none}:host #tzSelector{height:var(--warp-view-switch-height,30px);border-radius:var(--warp-view-switch-radius,18px);padding-left:calc(var(--warp-view-switch-radius, 18px) / 2);padding-right:5px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color,#000);border:none;margin:auto}:host .defaulttz{background:var(--warp-view-switch-inset-color,#eceeef)}:host .customtz{background:var(--warp-view-switch-inset-checked-color,#00cd00)}:host .tzcontainer{display:-ms-flexbox;display:flex}"}}class l{constructor(){this.checked=!1,this.text1="",this.text2="",this.state=!1}componentWillLoad(){this.state=this.checked}onChecked(t){this.state=t}switched(){this.state=!this.state,this.stateChange.emit({state:this.state,id:this.el.id})}render(){return t("div",{class:"container"},t("div",{class:"text"},this.text1),t("label",{class:"switch"},t("input",this.state?{type:"checkbox",class:"switch-input",checked:!0,onClick:()=>this.switched()}:{type:"checkbox",class:"switch-input",onClick:()=>this.switched()}),t("span",{class:"switch-label"}),t("span",{class:"switch-handle"})),t("div",{class:"text"},this.text2))}static get is(){return"warp-view-toggle"}static get encapsulation(){return"shadow"}static get properties(){return{checked:{type:Boolean,attr:"checked",watchCallbacks:["onChecked"]},el:{elementRef:!0},state:{state:!0},text1:{type:String,attr:"text-1"},text2:{type:String,attr:"text-2"}}}static get events(){return[{name:"stateChange",method:"stateChange",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host .switch{position:relative;margin-top:auto;margin-bottom:auto;display:block;width:var(--warp-view-switch-width,100px);height:var(--warp-view-switch-height,30px);padding:3px;border-radius:var(--warp-view-switch-radius,18px);cursor:pointer}:host .switch-input{display:none}:host .switch-label{position:relative;display:block;height:inherit;text-transform:uppercase;background:var(--warp-view-switch-inset-color,#eceeef);border-radius:inherit;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15)}:host .switch-input:checked~.switch-label{background:var(--warp-view-switch-inset-checked-color,#00cd00);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}:host .switch-handle{position:absolute;top:4px;left:4px;width:calc(var(--warp-view-switch-height, 30px) - 2px);height:calc(var(--warp-view-switch-height, 30px) - 2px);background:var(--warp-view-switch-handle-color,radial-gradient(#fff 15%,#f0f0f0 100%));border-radius:100%;-webkit-box-shadow:1px 1px 5px rgba(0,0,0,.2);box-shadow:1px 1px 5px rgba(0,0,0,.2)}:host .switch-input:checked~.switch-handle{left:calc(var(--warp-view-switch-width, 100px) - var(--warp-view-switch-height, 30px) + 4px);background:var(--warp-view-switch-handle-checked-color,radial-gradient(#fff 15%,#00cd00 100%));-webkit-box-shadow:-1px 1px 5px rgba(0,0,0,.2);box-shadow:-1px 1px 5px rgba(0,0,0,.2)}:host .switch-handle,:host .switch-label{transition:All .3s ease;-webkit-transition:All .3s ease;-moz-transition:All .3s ease;-o-transition:All .3s ease}:host .container{display:-ms-flexbox;display:flex}:host .text{color:var(--warp-view-font-color,#000);padding:7px}"}}export{d as WarpViewGtsPopup,r as WarpViewPlot,l as WarpViewToggle};