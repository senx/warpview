/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
import { GTSLib } from "../../../utils/gts.lib";
import { Logger } from "../../../utils/logger";
import { ChartLib } from "../../../utils/chart-lib";
export class WarpViewTreeView {
    constructor() {
        this.branch = false;
        this.hidden = false;
        this.gtsFilter = '';
        this.hiddenData = [];
        this.debug = false;
        this.ref = false;
        this.hide = {};
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
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.ref = !this.ref;
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
    componentWillLoad() {
        this.LOG = new Logger(WarpViewTreeView, this.debug);
    }
    /**
     *
     * @returns {any}
     */
    render() {
        return h("div", { class: "list" }, this.gtsList ? h("ul", null, this.gtsList.map((node, index) => (h("li", { hidden: this.hidden }, GTSLib.isGts(node)
            ? h("warp-view-chip", { node: { gts: node }, name: node.c, gtsFilter: this.gtsFilter, debug: this.debug, hiddenData: this.hiddenData })
            : h("span", null, node
                ? h("div", null,
                    this.branch
                        ? h("div", null,
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                h("small", null,
                                    "List of ",
                                    node.length,
                                    " item",
                                    node.length > 1
                                        ? 's'
                                        : '')))
                        : h("div", { class: "stack-level" },
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                index === 0 ? '[TOP]' : '[' + (index + 1) + ']',
                                "\u00A0",
                                h("small", null,
                                    "List of ",
                                    node.length,
                                    " item",
                                    node.length > 1
                                        ? 's'
                                        : ''))),
                    h("warp-view-tree-view", { gtsList: node, branch: true, hidden: this.isHidden(index), debug: this.debug, gtsFilter: this.gtsFilter }))
                : ''))))) : '');
    }
    static get is() { return "warp-view-tree-view"; }
    static get properties() { return {
        "branch": {
            "type": Boolean,
            "attr": "branch"
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
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
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "ref": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-tree-view:**/"; }
}
