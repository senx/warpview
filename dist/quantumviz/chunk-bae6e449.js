/*! Built with http://stenciljs.com */
<<<<<<< HEAD
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-cadd3091.js';

class QuantumToggle {
    constructor() {
        this.option = '{}';
        this.checked = false;
        this.state = false;
        this._option = {
            switchClass: '',
            switchLabelClass: '',
            switchHandleClass: ''
        };
    }
    componentWillLoad() {
        this._option = GTSLib.mergeDeep(this._option, JSON.parse(this.option));
    }
    componentDidLoad() { }
    componentWillUpdate() { }
    componentDidUpdate() { }
    render() {
        return (h("label", { class: 'switch ' + this._option.switchClass },
            this.checked
                ? h("input", { type: "checkbox", class: "switch-input", checked: true, onClick: () => this.switched() })
                : h("input", { type: "checkbox", class: "switch-input", onClick: () => this.switched() }),
            h("span", { class: 'switch-label ' + this._option.switchLabelClass }),
            h("span", { class: 'switch-handle ' + this._option.switchHandleClass })));
    }
    switched() {
        this.state = !this.state;
        this.timeSwitched.emit({ state: this.state });
    }
    switchedListener(event) {
    }
    static get is() { return "quantum-toggle"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "checked": {
            "type": Boolean,
            "attr": "checked"
        },
        "option": {
            "type": String,
            "attr": "option"
        },
        "state": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "timeSwitched",
            "method": "timeSwitched",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "timeSwitched",
            "method": "switchedListener"
        }]; }
    static get style() { return "/**style-placeholder:quantum-toggle:**/"; }
}

export { QuantumToggle as a };
=======
const{h:t}=window.quantumviz;import{a as e}from"./chunk-cadd3091.js";class s{constructor(){this.option="{}",this.checked=!1,this.state=!1,this._option={switchClass:"",switchLabelClass:"",switchHandleClass:""}}componentWillLoad(){this._option=e.mergeDeep(this._option,JSON.parse(this.option))}componentDidLoad(){}componentWillUpdate(){}componentDidUpdate(){}render(){return t("label",{class:"switch "+this._option.switchClass},this.checked?t("input",{type:"checkbox",class:"switch-input",checked:!0,onClick:()=>this.switched()}):t("input",{type:"checkbox",class:"switch-input",onClick:()=>this.switched()}),t("span",{class:"switch-label "+this._option.switchLabelClass}),t("span",{class:"switch-handle "+this._option.switchHandleClass}))}switched(){this.state=!this.state,this.timeSwitched.emit({state:this.state})}switchedListener(t){}static get is(){return"quantum-toggle"}static get encapsulation(){return"shadow"}static get properties(){return{checked:{type:Boolean,attr:"checked"},option:{type:String,attr:"option"},state:{state:!0}}}static get events(){return[{name:"timeSwitched",method:"timeSwitched",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"timeSwitched",method:"switchedListener"}]}static get style(){return"/**style-placeholder:quantum-toggle:**/"}}export{s as a};
>>>>>>> 9050239e52a06d8d1493e39cfe7fef20a0e23b38
