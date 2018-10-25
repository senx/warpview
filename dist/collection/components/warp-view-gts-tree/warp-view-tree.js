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
import { Counter } from "./warp-view-gts-tree";
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewTreeView {
    constructor() {
        this.branch = false;
        this.theme = "light";
        this.hidden = false;
        this.gtsFilter = '';
        this.ref = false;
        this.hide = {};
    }
    /**
     *
     * @param node
     * @returns {number}
     */
    static getIndex(node) {
        Counter.item++;
        node.index = Counter.item;
        return Counter.item;
    }
    /**
     *
     */
    componentWillLoad() {
        WarpViewTreeView.LOG.debug(['componentWillLoad'], Counter.item);
    }
    /**
     *
     * @param {UIEvent} event
     * @param {number} index
     */
    toggleVisibility(event, index) {
        let el;
        if (event.currentTarget.id) {
            el = event.currentTarget;
        }
        else {
            el = event.currentTarget.previousElementSibling;
        }
        if (el.className === 'expanded') {
            el.className = 'collapsed';
            this.hide[index + ''] = true;
        }
        else {
            el.className = 'expanded';
            this.hide[index + ''] = false;
        }
        this.ref = !this.ref;
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.ref = !this.ref;
        }
    }
    /**
     *
     * @param {number} index
     * @returns boolean
     */
    isHidden(index) {
        if (this.hide.hasOwnProperty(index + '')) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    }
    /**
     *
     * @returns {any}
     */
    render() {
        return h("div", { class: "list" }, this.gtsList && this.gtsList.content ? h("ul", null, this.gtsList.content.map((node, index) => (h("li", { hidden: this.hidden }, GTSLib.isGts(node.gts)
            ? h("warp-view-chip", { node: node, index: WarpViewTreeView.getIndex(node), name: node.gts.c, gtsFilter: this.gtsFilter })
            : h("span", null, node.content
                ? h("div", null,
                    this.branch
                        ? h("div", null,
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                h("small", null,
                                    "List of ",
                                    node.content.length,
                                    " item",
                                    node.content.length > 1
                                        ? 's'
                                        : '')))
                        : h("div", { class: "stack-level" },
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                index === 0 ? '[TOP]' : '[' + (index + 1) + ']',
                                "\u00A0",
                                h("small", null,
                                    "List of ",
                                    node.content.length,
                                    " item",
                                    node.content.length > 1
                                        ? 's'
                                        : ''))),
                    h("warp-view-tree-view", { gtsList: node, branch: true, hidden: this.isHidden(index), gtsFilter: this.gtsFilter }))
                : ''))))) : '');
    }
    static get is() { return "warp-view-tree-view"; }
    static get properties() { return {
        "branch": {
            "type": Boolean,
            "attr": "branch"
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list"
        },
        "hidden": {
            "type": Boolean,
            "attr": "hidden"
        },
        "ref": {
            "state": true
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-tree-view:**/"; }
}
WarpViewTreeView.LOG = new Logger(WarpViewTreeView);
