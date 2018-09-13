import { ChartLib } from "../../utils/chart-lib";
import { Param } from "../../model/param";
export class QuantumToggle {
    constructor() {
        this.options = new Param();
        this.checked = false;
        this.text1 = "";
        this.text2 = "";
        this.state = false;
        this._options = new Param();
    }
    componentWillLoad() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.state = this.checked;
    }
    switched() {
        this.state = !this.state;
        this.timeSwitched.emit({ state: this.state });
    }
    render() {
        return (h("div", { class: "container" },
            h("div", { class: "text" }, this.text1),
            h("label", { class: "switch" },
                this.state
                    ? h("input", { type: "checkbox", class: "switch-input", checked: true, onClick: () => this.switched() })
                    : h("input", { type: "checkbox", class: "switch-input", onClick: () => this.switched() }),
                h("span", { class: "switch-label" }),
                h("span", { class: "switch-handle" })),
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
            "type": "Any",
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
