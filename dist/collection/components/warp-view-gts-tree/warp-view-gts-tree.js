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
import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = '';
        this.options = new Param();
        this.hiddenData = [];
        this.debug = false;
        this.hide = false;
        this.gtsList = [];
        this._options = new Param();
        this._isFolded = false;
        this.initialized = false;
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.doRender();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            // this._isFolded = !!this.options.foldGTSTree;
            this.doRender();
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['gtsFilter'], newValue);
            this.doRender();
            if (!!this._options.foldGTSTree && !this._isFolded) {
                this.foldAll();
            }
        }
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.doRender();
    }
    componentDidLoad() {
        this.LOG = new Logger(WarpViewGtsTree, this.debug);
        this.LOG.debug(['componentWillLoad', 'data'], this.data);
        if (this.data) {
            this.doRender();
        }
    }
    doRender() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        if (!this.data) {
            return;
        }
        this.LOG.debug(['doRender', 'gtsList'], this.data);
        let dataList = GTSLib.getData(this.data).data;
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this._isFolded);
        if (!this.initialized) {
            if (this._options.foldGTSTree !== undefined && !!this._options.foldGTSTree && !this._isFolded) {
                this.LOG.debug(['doRender'], 'About to fold');
                this.foldAll();
            }
            this.initialized = true;
        }
    }
    foldAll() {
        if (!this.root) {
            this.LOG.debug(['doRender'], 'no root');
            window.setTimeout(() => {
                this.foldAll();
            }, 100);
        }
        else {
            this.LOG.debug(['doRender'], 'Ok collapse');
            this.root.className = 'collapsed';
            this.hide = true;
            this._isFolded = true;
        }
    }
    toggleVisibility(event) {
        let el = event.currentTarget.firstChild;
        if (el.className === 'expanded') {
            this._isFolded = true;
            el.className = 'collapsed';
            this.hide = true;
        }
        else {
            el.className = 'expanded';
            this._isFolded = false;
            this.hide = false;
        }
    }
    render() {
        return this.gtsList
            ? h("div", null,
                h("div", { class: "stack-level", onClick: (event) => this.toggleVisibility(event) },
                    h("span", { class: "expanded", ref: el => this.root = el }),
                    " Stack"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, debug: this.debug, hiddenData: this.hiddenData, gtsFilter: this.gtsFilter }))
            : '';
    }
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "hide": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
