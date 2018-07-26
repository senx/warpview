/*! Built with http://stenciljs.com */
const{h:t}=window.quantumviz;import{a as e}from"./chunk-faa0a089.js";class s{constructor(){this.option="{}",this.checked=!1,this.state=!1,this._option={switchClass:"",switchLabelClass:"",switchHandleClass:""}}componentWillLoad(){this._option=e.mergeDeep(this._option,JSON.parse(this.option))}componentDidLoad(){}componentWillUpdate(){}componentDidUpdate(){}render(){return t("label",{class:"switch "+this._option.switchClass},this.checked?t("input",{type:"checkbox",class:"switch-input",checked:!0,onClick:()=>this.switched()}):t("input",{type:"checkbox",class:"switch-input",onClick:()=>this.switched()}),t("span",{class:"switch-label "+this._option.switchLabelClass}),t("span",{class:"switch-handle "+this._option.switchHandleClass}))}switched(){this.state=!this.state,this.timeSwitched.emit({state:this.state})}switchedListener(t){}static get is(){return"quantum-toggle"}static get encapsulation(){return"shadow"}static get properties(){return{checked:{type:Boolean,attr:"checked"},option:{type:String,attr:"option"},state:{state:!0}}}static get events(){return[{name:"timeSwitched",method:"timeSwitched",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"timeSwitched",method:"switchedListener"}]}static get style(){return".switch{position:relative;display:block;width:100px;height:30px;padding:3px;margin:0 10px 10px 0;border-radius:18px;cursor:pointer}.switch-input{display:none}.switch-label{position:relative;display:block;height:inherit;font-size:10px;text-transform:uppercase;background:#eceeef;border-radius:inherit;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15)}.switch-input:checked~.switch-label{background:#00cd00;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}.switch-handle{position:absolute;top:4px;left:4px;width:28px;height:28px;background:radial-gradient(#fff 15%,#f0f0f0 100%);border-radius:100%;-webkit-box-shadow:1px 1px 5px rgba(0,0,0,.2);box-shadow:1px 1px 5px rgba(0,0,0,.2)}.switch-input:checked~.switch-handle{left:74px;background:radial-gradient(#fff 15%,#00cd00 100%);-webkit-box-shadow:-1px 1px 5px rgba(0,0,0,.2);box-shadow:-1px 1px 5px rgba(0,0,0,.2)}.switch-handle,.switch-label{-webkit-transition:All .3s ease;transition:All .3s ease;-webkit-transition:All .3s ease;-moz-transition:All .3s ease;-o-transition:All .3s ease}"}}export{s as QuantumToggle};