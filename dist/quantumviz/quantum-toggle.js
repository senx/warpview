/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-be650d54.js';

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
    static get style() { return ".switch {\n  position: relative;\n  display: block;\n  width: 100px;\n  height: 30px;\n  padding: 3px;\n  margin: 0 10px 10px 0;\n  border-radius: 18px;\n  cursor: pointer; }\n\n.switch-input {\n  display: none; }\n\n.switch-label {\n  position: relative;\n  display: block;\n  height: inherit;\n  font-size: 10px;\n  text-transform: uppercase;\n  background: #eceeef;\n  border-radius: inherit;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15); }\n\n.switch-input:checked ~ .switch-label {\n  background: #00cd00;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2); }\n\n.switch-handle {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: 28px;\n  height: 28px;\n  background: radial-gradient(#FFFFFF 15%, #f0f0f0 100%);\n  border-radius: 100%;\n  -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n.switch-input:checked ~ .switch-handle {\n  left: 74px;\n  background: radial-gradient(#ffffff 15%, #00cd00 100%);\n  -webkit-box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n.switch-label, .switch-handle {\n  -webkit-transition: All .3s ease;\n  transition: All .3s ease;\n  -webkit-transition: All 0.3s ease;\n  -moz-transition: All 0.3s ease;\n  -o-transition: All 0.3s ease; }"; }
}

export { QuantumToggle };
