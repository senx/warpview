import { GTSLib } from "../../gts.lib";
export class QuantumGtsTree {
    dataChanged(newValue, _oldValue) {
        if (newValue !== _oldValue) {
            this.gtsList = JSON.parse(newValue);
        }
    }
    /**
     *
     */
    componentWillLoad() {
        const data = JSON.parse(this.data);
        this.gtsList = GTSLib.gtsFromJSONList(data, "");
        console.debug("[QuantumGtsTree] - componentWillLoad - gtsList", this.gtsList);
    }
    render() {
        return h("quantum-tree-view", { gtsList: this.gtsList, branch: false });
    }
    static get is() { return "quantum-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["dataChanged"]
        }
    }; }
    static get events() { return [{
            "name": "selectedGTS",
            "method": "selectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-gts-tree:**/"; }
}
export class Counter {
    static get is() { return "quantum-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["dataChanged"]
        }
    }; }
    static get events() { return [{
            "name": "selectedGTS",
            "method": "selectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-gts-tree:**/"; }
}
Counter.item = -1;
