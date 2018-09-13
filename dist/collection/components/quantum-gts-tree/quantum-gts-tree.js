import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
export class QuantumGtsTree {
    constructor() {
        this.theme = "light";
        this.LOG = new Logger(QuantumGtsTree);
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.gtsList = newValue;
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this.gtsList = GTSLib.gtsFromJSONList(this.data, '');
        this.LOG.debug(['componentWillLoad', 'gtsList'], this.gtsList);
    }
    render() {
        return h("quantum-tree-view", { gtsList: this.gtsList, branch: false, theme: this.theme });
    }
    static get is() { return "quantum-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-gts-tree:**/"; }
}
export class Counter {
    static get is() { return "quantum-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-gts-tree:**/"; }
}
Counter.item = -1;
