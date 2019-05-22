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
import deepEqual from "deep-equal";
export class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = 'x';
        this.options = new Param();
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.hide = false;
        this.gtsList = [];
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        this.LOG.debug(['options'], newValue, oldValue);
        this.doRender();
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue, oldValue);
            this.doRender();
            if (!!this._options.foldGTSTree && !this.hide) {
                this.foldAll();
            }
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['gtsFilter'], newValue);
            this.doRender();
        }
    }
    onHideData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['hiddenData'], newValue);
            this.doRender();
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewGtsTree, this.debug);
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad', 'data'], this.data);
        if (this.data) {
            this.doRender();
        }
        if (this._options.foldGTSTree !== undefined && !!this._options.foldGTSTree && !this.hide) {
            this.foldAll();
        }
    }
    doRender() {
        this.LOG.debug(['doRender', 'gtsList'], this.data);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        if (!this.data) {
            return;
        }
        let dataList = GTSLib.getData(this.data).data;
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.hide);
    }
    foldAll() {
        if (!this.root) {
            window.setTimeout(() => {
                this.foldAll();
            }, 100);
        }
        else {
            this.hide = true;
        }
    }
    toggleVisibility() {
        this.hide = !this.hide;
    }
    render() {
        return this.gtsList
            ? h("div", null,
                h("div", { class: "stack-level", onClick: () => this.toggleVisibility() },
                    h("span", { class: { 'expanded': !this.hide, 'collapsed': this.hide }, ref: el => this.root = el }),
                    " Results"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, debug: this.debug, hiddenData: this.hiddenData, gtsFilter: this.gtsFilter, kbdLastKeyPressed: this.kbdLastKeyPressed }))
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
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed"
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
