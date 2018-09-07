/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-e52051aa.js';

class QuantumToggle {
    constructor() {
        this.option = '{}';
        this.checked = false;
        this.state = false;
        this.text1 = "";
        this.text2 = "";
        this._option = {
            switchClass: '',
            switchLabelClass: '',
            switchHandleClass: ''
        };
    }
    componentWillLoad() {
        this._option = GTSLib.mergeDeep(this._option, JSON.parse(this.option));
        this.state = this.checked;
    }
    switched() {
        this.state = !this.state;
        this.timeSwitched.emit({ state: this.state });
    }
    render() {
        return (h("div", { class: "container" },
            h("div", { class: "text" }, this.text1),
            h("label", { class: 'switch ' + this._option.switchClass },
                this.state
                    ? h("input", { type: "checkbox", class: "switch-input", checked: true, onClick: () => this.switched() })
                    : h("input", { type: "checkbox", class: "switch-input", onClick: () => this.switched() }),
                h("span", { class: 'switch-label ' + this._option.switchLabelClass }),
                h("span", { class: 'switch-handle ' + this._option.switchHandleClass })),
            h("div", { class: "text" }, this.text2)));
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
        },
        "text1": {
            "type": String,
            "attr": "text-1"
        },
        "text2": {
            "type": String,
            "attr": "text-2"
        }
    }; }
    static get events() { return [{
            "name": "timeSwitched",
            "method": "timeSwitched",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host .switch {\n  position: relative;\n  display: block;\n  width: 100px;\n  height: 30px;\n  padding: 3px;\n  border-radius: 18px;\n  cursor: pointer; }\n\n:host .switch-input {\n  display: none; }\n\n:host .switch-label {\n  position: relative;\n  display: block;\n  height: inherit;\n  text-transform: uppercase;\n  background: #eceeef;\n  border-radius: inherit;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15); }\n\n:host .switch-input:checked ~ .switch-label {\n  background: #00cd00;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2); }\n\n:host .switch-handle {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: 28px;\n  height: 28px;\n  background: radial-gradient(#FFFFFF 15%, #f0f0f0 100%);\n  border-radius: 100%;\n  -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n:host .switch-input:checked ~ .switch-handle {\n  left: 74px;\n  background: radial-gradient(#ffffff 15%, #00cd00 100%);\n  -webkit-box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n:host .switch-label, :host .switch-handle {\n  -webkit-transition: All .3s ease;\n  transition: All .3s ease;\n  -webkit-transition: All 0.3s ease;\n  -moz-transition: All 0.3s ease;\n  -o-transition: All 0.3s ease; }\n\n:host .container {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n:host .text {\n  padding: 7px; }"; }
}

export { QuantumToggle };