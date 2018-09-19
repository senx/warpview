/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */
import { GTSLib } from "../../utils/gts.lib";
import { Counter } from "./quantum-gts-tree";
import { Logger } from "../../utils/logger";
export class QuantumTreeView {
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
    static get style() { return "/**style-placeholder:quantum-tree-view:**/"; }
}
QuantumTreeView.LOG = new Logger(QuantumTreeView);
