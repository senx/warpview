import { ChartLib } from "../../utils/chart-lib";
export class QuantumToggle {
    constructor() {
        this.options = '{}';
        this.checked = false;
        this.state = false;
        this.text1 = "";
        this.text2 = "";
        this._options = {
            switchClass: '',
            switchLabelClass: '',
            switchHandleClass: ''
        };
    }
    componentWillLoad() {
        this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
        this.state = this.checked;
    }
    switched() {
        this.state = !this.state;
        this.timeSwitched.emit({ state: this.state });
    }
    render() {
        return (h("div", { class: "container" },
            h("div", { class: "text" }, this.text1),
            h("label", { class: 'switch ' + this._options.switchClass },
                this.state
                    ? h("input", { type: "checkbox", class: "switch-input", checked: true, onClick: () => this.switched() })
                    : h("input", { type: "checkbox", class: "switch-input", onClick: () => this.switched() }),
                h("span", { class: 'switch-label ' + this._options.switchLabelClass }),
                h("span", { class: 'switch-handle ' + this._options.switchHandleClass })),
            h("div", { class: "text" }, this.text2)));
    }
    static get is() { return "quantum-toggle"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "checked": {
            "type": Boolean,
            "attr": "checked"
        },
        "options": {
            "type": String,
            "attr": "options"
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
    static get style() { return "/**style-placeholder:quantum-toggle:**/"; }
}
