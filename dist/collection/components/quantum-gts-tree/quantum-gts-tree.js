import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
export class QuantumGtsTree {
    constructor() {
        this.theme = "light";
        this.gtsList = { content: [] };
        this.LOG = new Logger(QuantumGtsTree);
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.doRender();
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this.LOG.debug(['componentWillLoad', 'data'], this.data);
        if (this.data) {
            this.doRender();
        }
    }
    doRender() {
        let dataList = GTSLib.getData(this.data).data;
        this.gtsList = GTSLib.gtsFromJSONList(dataList, '');
        this.LOG.debug(['doRender', 'gtsList'], this.data);
    }
    render() {
        return (this.gtsList ? h("quantum-tree-view", { gtsList: this.gtsList, branch: false, theme: this.theme }) : '');
    }
    static get is() { return "quantum-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
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
            "type": String,
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
