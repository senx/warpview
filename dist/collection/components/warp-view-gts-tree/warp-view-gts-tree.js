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
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewGtsTree {
    constructor() {
        this.theme = "light";
        this.gtsFilter = '';
        this.options = new Param();
        this.hide = false;
        this.gtsList = { content: [] };
        this._options = new Param();
        this.LOG = new Logger(WarpViewGtsTree);
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.doRender();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.doRender();
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['gtsFilter'], newValue);
            this.doRender();
            if (this._options.foldGTSTree) {
                this.foldAll();
            }
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
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let dataList = GTSLib.getData(this.data).data;
        this.gtsList = GTSLib.gtsFromJSONList(dataList, '');
        this.LOG.debug(['doRender', 'gtsList'], this.data);
        if (this._options.foldGTSTree) {
            this.foldAll();
        }
    }
    foldAll() {
        if (!this.el) {
            window.setTimeout(() => {
                this.foldAll();
            }, 100);
        }
        else {
            let el = this.el.querySelector("#root");
            el.className = 'collapsed';
            this.hide = true;
        }
    }
    toggleVisibility(event) {
        let el = event.currentTarget.firstChild;
        if (el.className === 'expanded') {
            el.className = 'collapsed';
            this.hide = true;
        }
        else {
            el.className = 'expanded';
            this.hide = false;
        }
    }
    render() {
        return this.gtsList
            ? h("div", null,
                h("div", { class: "stack-level", onClick: (event) => this.toggleVisibility(event) },
                    h("span", { class: "expanded", id: "root" }),
                    " Stack"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, theme: this.theme, hidden: this.hide, gtsFilter: this.gtsFilter }))
            : '';
    }
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "hide": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
export class Counter {
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "hide": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "theme": {
            "type": String,
            "attr": "theme"
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
Counter.item = -1;
