import { GTSLib } from "../../gts.lib";
import { Counter } from "./quantum-gts-tree";
export class QuantumTreeView {
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
    static get style() { return "/**style-placeholder:quantum-tree-view:**/"; }
}
