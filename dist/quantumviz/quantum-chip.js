/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-7f4b1b2f.js';
import { a as ColorLib } from './chunk-b534d406.js';
import { a as Logger } from './chunk-c6b875fd.js';

class GTS {
}

class QuantumChip {
    constructor() {
        this._node = {
            selected: true,
            gts: GTS
        };
        this.LOG = new Logger(QuantumChip);
    }
    /**
     *
     * @param {boolean} state
     * @returns {string}
     */
    gtsColor(state) {
        if (state) {
            return ColorLib.getColor(this.index);
        }
        else {
            return '#bbbbbb';
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this._node = Object.assign({}, this.node, { selected: true });
    }
    /**
     *
     */
    componentDidLoad() {
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
    }
    /**
     *
     * @param index
     * @param obj
     * @returns {boolean}
     * @private
     */
    lastIndex(index, obj) {
        let array = this.toArray(obj);
        return (index === array.length - 1);
    }
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map(function (key) {
            return {
                name: key,
                value: obj[key],
            };
        });
    }
    /**
     *
     * @param {UIEvent} event
     */
    switchPlotState(event) {
        this._node = Object.assign({}, this._node, { selected: !this._node.selected, label: GTSLib.serializeGtsMetadata(this._node.gts) });
        this.LOG.debug(['switchPlotState'], [this._node]);
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
        this.quantumSelectedGTS.emit(this._node);
    }
    render() {
        return (h("div", null, this._node && this._node.gts && this._node.gts.l ?
            h("span", null,
                h("i", { class: "normal" }),
                h("span", { class: "gtsInfo", onClick: (event) => this.switchPlotState(event) },
                    h("span", { class: 'gts-classname' }, this._node.gts.c),
                    h("span", { class: 'gts-separator', innerHTML: '&lcub; ' }),
                    this.toArray(this._node.gts.l).map((label, labelIndex) => h("span", null,
                        h("span", { class: 'gts-labelname' }, label.name),
                        h("span", { class: 'gts-separator' }, "="),
                        h("span", { class: 'gts-labelvalue' }, label.value),
                        h("span", { hidden: this.lastIndex(labelIndex, this._node.gts.l) }, ", "))),
                    h("span", { class: 'gts-separator', innerHTML: ' &rcub;' })))
            : ''));
    }
    static get is() { return "quantum-chip"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "index": {
            "type": Number,
            "attr": "index"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "node": {
            "type": "Any",
            "attr": "node"
        }
    }; }
    static get events() { return [{
            "name": "quantumSelectedGTS",
            "method": "quantumSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host .normal {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 120px;\n  height: 12px; }"; }
}

class QuantumGtsTree {
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
    static get style() { return ""; }
}
class Counter {
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

class QuantumTreeView {
    constructor() {
        this.branch = false;
        this.theme = "light";
    }
    /**
     *
     * @param node
     * @returns {number}
     */
    static getIndex(node) {
        Counter.item++;
        node.index = Counter.item;
        this.LOG.debug(['getIndex'], [Counter.item, node]);
        return Counter.item;
    }
    /**
     *
     */
    componentWillLoad() {
        QuantumTreeView.LOG.debug(['componentWillLoad'], Counter.item);
    }
    /**
     *
     * @returns {any}
     */
    render() {
        return (h("div", { class: "list" }, this.gtsList && this.gtsList.content ? (h("ul", null, this.gtsList.content.map((node, index) => (h("li", null,
            this.branch ? ("") : (h("div", { class: "stack-level" },
                "Stack level ",
                index)),
            GTSLib.isGts(node.gts) ? (h("quantum-chip", { node: node, index: QuantumTreeView.getIndex(node), name: node.gts.c })) : (h("span", null, node.content ? (h("div", null,
                h("span", { class: "expanded" }),
                "List of ",
                node.content.length,
                " item",
                node.content.length > 1
                    ? "s"
                    : "",
                h("quantum-tree-view", { gtsList: node, branch: true }))) : (h("span", null))))))))) : ''));
    }
    static get is() { return "quantum-tree-view"; }
    static get properties() { return {
        "branch": {
            "type": Boolean,
            "attr": "branch"
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list"
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "quantum-tree-view {\n  /* .dark {\n    color: #ffffff;\n    .expanded {\n      color: #ffffff;\n      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACASURBVGhD7djRCYAwDEXRLOCHWzqKe7lXawIZILQEQ7wH+hl4D5SUCgAA+IMxxjHnPCsdy+Tx4nTo0eFSLJPHi6NIotUiPf4RAAB26PK5dAndlY5l8nhxdh3Q4VIsk8eL61Skx6cFAMAOXT480GWxTB4vjiKJVovwQAcAAD4h8gJ93ZLCEjQrYQAAAABJRU5ErkJggg==) no-repeat;\n      background-size: cover;\n    }\n  }*/ }\n  quantum-tree-view ul {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n    border: none;\n    overflow: hidden; }\n  quantum-tree-view li {\n    color: var(--gts-stack-font-color, #000000);\n    position: relative;\n    padding: 0 0 0 20px;\n    line-height: 20px; }\n  quantum-tree-view li .stack-level {\n    font-size: 1.25em;\n    font-weight: bold;\n    padding-top: 25px;\n    padding-bottom: 10px; }\n  quantum-tree-view li .stack-level + div {\n    padding-left: 25px; }\n  quantum-tree-view li .expanded {\n    padding: 1px 10px;\n    background: var(--gts-tree-expanded-icon, url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAKElEQVQ4jWNgGFbgFQMDw38i8UuYJiYkA5hJsIwUtXQEo2EwGgZkAwBP/yN0kY5JiwAAAABJRU5ErkJggg==));\n    background-size: cover; }\n  quantum-tree-view li .collapsed {\n    padding: 1px 10px;\n    background: var(--gts-tree-collapsed-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABiSURBVGhD7djRCcAgDEBBF+hHt+wo3auDtWaEKFLRO3j/CSiIBQDYxFE7JytmSntq72TFTGkWGVjTIsvcEQDocdXuyYqZ0ry1Bta0yDJHCwB6+KAb2N5vrWUW8UEHAPyilA9TDlz495u2lwAAAABJRU5ErkJggg==));\n    background-size: cover; }\n  quantum-tree-view li .gtsInfo {\n    white-space: normal;\n    word-wrap: break-word; }\n  quantum-tree-view li .gtsInfo[disabled] {\n    color: #aaaaaa;\n    cursor: not-allowed; }\n  quantum-tree-view li .normal {\n    border-radius: 50%;\n    background-color: #bbbbbb;\n    display: inline-block;\n    width: 12px;\n    height: 12px; }\n  quantum-tree-view li i, quantum-tree-view li span {\n    cursor: pointer; }\n  quantum-tree-view li .selected {\n    background-color: #aaddff;\n    font-weight: bold;\n    padding: 1px 5px; }\n  quantum-tree-view .gts-classname {\n    color: var(--gts-classname-font-color, #0074D9); }\n  quantum-tree-view .gts-labelname {\n    color: var(--gts-labelname-font-color, #3d9970); }\n  quantum-tree-view .gts-separator {\n    color: var(--gts-separator-font-color, #bbbbbb); }\n  quantum-tree-view .gts-labelvalue {\n    color: var(--gts-labelvalue-font-color, #AAAAAA);\n    font-style: italic; }"; }
}
QuantumTreeView.LOG = new Logger(QuantumTreeView);

export { QuantumChip, QuantumGtsTree, QuantumTreeView };
