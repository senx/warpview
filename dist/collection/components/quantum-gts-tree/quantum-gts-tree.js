import { GTSLib } from "../../gts.lib";
export class QuantumGtsTree {
    dataChanged(newValue, _oldValue) {
        this.gtsList = JSON.parse(newValue);
    }
    /**
     *
     * @param {CustomEvent} event
     */
    onSelected(event) {
        console.debug('[QuantumGtsTree] - onSelected', event);
        this.selected.emit(event);
    }
    /**
     *
     */
    componentWillLoad() {
        console.debug('[QuantumGtsTree] - componentWillLoad', JSON.parse(this.data));
        this.gtsList = GTSLib.gtsFromJSONList(JSON.parse(this.data), undefined);
        console.debug('[QuantumGtsTree] - componentWillLoad - gtsList', this.gtsList);
    }
    render() {
        return (h("quantum-tree-view", { gtsList: this.gtsList, branch: false, onSelected: (event) => this.onSelected(event) }));
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
            "name": "selected",
            "method": "selected",
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
            "name": "selected",
            "method": "selected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-gts-tree:**/"; }
}
Counter.item = -1;
