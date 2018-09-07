/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-e52051aa.js';

class QuantumChip {
    constructor() {
        this._node = {
            selected: true,
            gts: {
                c: '', l: {}, a: {}, v: []
            }
        };
    }
    /**
     *
     * @param {boolean} state
     * @returns {string}
     */
    gtsColor(state) {
        if (state) {
            return GTSLib.getColor(this.index);
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
    _lastIndex(index, obj) {
        let array = this._toArray(obj);
        return (index === array.length - 1);
    }
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    _toArray(obj) {
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
        this._node = Object.assign({}, this._node, { selected: !this._node.selected, label: GTSLib.serializeGtsMetadata({ c: this._node.gts.c, l: this._node.gts.l, a: this._node.gts.a }) });
        console.debug('[QuantumChip] - switchPlotState', this._node);
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
                    this._toArray(this._node.gts.l).map((label, labelIndex) => h("span", null,
                        h("span", { class: 'gts-labelname' }, label.name),
                        h("span", { class: 'gts-separator' }, "="),
                        h("span", { class: 'gts-labelvalue' }, label.value),
                        h("span", { hidden: this._lastIndex(labelIndex, this._node.gts.l) }, ", "))),
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
    static get style() { return "quantum-chip .normal {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 120px;\n  height: 12px; }"; }
}

class QuantumGtsTree {
    constructor() {
        this.data = "[]";
    }
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
    static get style() { return ""; }
}
class Counter {
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

class QuantumTreeView {
    constructor() {
        this.branch = false;
    }
    /**
     *
     * @param node
     * @returns {number}
     */
    getIndex(node) {
        Counter.item++;
        node.index = Counter.item;
        console.debug("[QuantumTreeView] - getIndex", Counter.item, node);
        return Counter.item;
    }
    /**
     *
     */
    componentWillLoad() {
        console.debug("[QuantumTreeView] - componentWillLoad", Counter.item);
    }
    /**
     *
     * @returns {any}
     */
    render() {
        return (h("div", null, this.gtsList && this.gtsList.content ? (h("ul", null, this.gtsList.content.map((node, index) => (h("li", null,
            this.branch ? ("") : (h("div", { class: "stack-level" },
                "Stack level ",
                index)),
            GTSLib.isGts(node.gts) ? (h("quantum-chip", { node: node, index: this.getIndex(node), name: node.gts.c })) : (h("span", null, node.content ? (h("div", null,
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
        }
    }; }
    static get events() { return [{
            "name": "selected",
            "method": "selected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "quantum-tree-view ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  border: none;\n  overflow: hidden; }\n\nquantum-tree-view li {\n  position: relative;\n  padding: 0 0 0 20px;\n  line-height: 20px; }\n\nquantum-tree-view li .stack-level {\n  font-size: 1.25em;\n  font-weight: bold;\n  padding-top: 25px;\n  padding-bottom: 10px; }\n\nquantum-tree-view li .stack-level + div {\n  padding-left: 25px; }\n\nquantum-tree-view li .expanded {\n  padding: 1px 10px;\n  background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAKElEQVQ4jWNgGFbgFQMDw38i8UuYJiYkA5hJsIwUtXQEo2EwGgZkAwBP/yN0kY5JiwAAAABJRU5ErkJggg==) no-repeat; }\n\nquantum-tree-view li .collapsed {\n  padding: 1px 10px;\n  background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAXUlEQVQ4jWNgGCzgJwMDw38S8U8GBgYGJqgBjGRYSo4e3GAfAwMDP5oYIW/9RFb8n4GB4RQDA4MgktgvAgb8QjfgPwMDwyxyvYDNBSR54SADZhiQ5AWKwTBISAMHAKXXR27jzC2pAAAAAElFTkSuQmCC) no-repeat; }\n\nquantum-tree-view li .gtsInfo {\n  white-space: normal;\n  word-wrap: break-word; }\n\nquantum-tree-view li .gtsInfo[disabled] {\n  color: #aaaaaa;\n  cursor: not-allowed; }\n\nquantum-tree-view li .normal {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 12px;\n  height: 12px; }\n\nquantum-tree-view li i, quantum-tree-view li span {\n  cursor: pointer; }\n\nquantum-tree-view li .selected {\n  background-color: #aaddff;\n  font-weight: bold;\n  padding: 1px 5px; }\n\nquantum-tree-view .gts-classname {\n  color: #0074D9; }\n\nquantum-tree-view .gts-labelname {\n  color: #3d9970; }\n\nquantum-tree-view .gts-separator {\n  color: #bbbbbb; }\n\nquantum-tree-view .gts-labelvalue {\n  color: #AAAAAA;\n  font-style: italic; }"; }
}

export { QuantumChip, QuantumGtsTree, QuantumTreeView };