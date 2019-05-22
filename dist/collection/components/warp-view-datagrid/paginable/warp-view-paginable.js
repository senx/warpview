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
import { ChartLib } from "../../../utils/chart-lib";
import { GTSLib } from "../../../utils/gts.lib";
import moment from "moment";
import { Param } from "../../../model/param";
import { Logger } from "../../../utils/logger";
export class WarpViewPaginable {
    constructor() {
        this.options = new Param();
        this.elemsCount = 15;
        this.debug = false;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        this._options = {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.windowed = 5;
    }
    formatDate(date) {
        return this._options.timeMode === 'date' ? moment.utc(date / 1000).toISOString() : date.toString();
    }
    goto(page) {
        this.page = page;
        this.drawGridData();
    }
    next() {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    }
    prev() {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    }
    drawGridData() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this.data)
            return;
        this.pages = [];
        for (let i = 0; i < this.data.values.length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this._data = Object.assign({}, this.data);
        this.displayedValues = this._data.values.slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), this._data.values.length));
        this.LOG.debug(['drawGridData', '_data'], this.data);
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewPaginable, this.debug);
        this.drawGridData();
    }
    render() {
        // noinspection CheckTagEmptyBody
        return h("div", { class: "wrapper" }, this._data ?
            h("div", null,
                h("div", { class: "heading", innerHTML: GTSLib.formatLabel(this._data.name) }),
                h("table", null,
                    h("thead", null, this._data.headers.map((headerName) => h("th", null, headerName))),
                    h("tbody", null, this.displayedValues.map((value, index) => h("tr", { class: index % 2 === 0 ? 'odd' : 'even' }, value.map((v, index) => h("td", null, index === 0 ? this.formatDate(v) : decodeURIComponent(v))))))),
                h("div", { class: "center" },
                    h("div", { class: "pagination" },
                        this.page !== 0 ? h("div", { class: "prev hoverable", onClick: () => this.prev() }, "<") : '',
                        this.page - this.windowed > 0
                            ? h("div", { class: "index disabled" }, "...")
                            : '',
                        this.pages.map(c => c >= this.page - this.windowed && c <= this.page + this.windowed
                            ? h("div", { class: 'index ' + (this.page === c ? 'active' : 'hoverable'), onClick: () => this.goto(c) }, c)
                            : ''),
                        this.page + this.windowed < this.pages.length
                            ? h("div", { class: "index disabled" }, "...")
                            : '',
                        this.page !== this._data.values.length - 1 ?
                            h("div", { class: "next hoverable", onClick: () => this.next() }, ">") : '')))
            : '');
    }
    static get is() { return "warp-view-paginable"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data"
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "elemsCount": {
            "type": Number,
            "attr": "elems-count"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "page": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-paginable:**/"; }
}
