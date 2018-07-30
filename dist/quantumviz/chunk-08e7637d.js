/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-357e00db.js';

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
