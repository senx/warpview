import { h } from '../warpview.core.js';

import { a as GTSLib, c as DataModel, b as Logger } from './chunk-1029d1a2.js';
import { c as Param, b as deepEqual, a as ChartLib } from './chunk-64463141.js';
import { a as moment } from './chunk-f20deb19.js';

class WarpViewDatagrid {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.elemsCount = 15;
        this.debug = false;
        this.page = 0;
        this._options = {
            timeMode: 'date'
        };
        this._data = [];
    }
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.drawChart();
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['drawChart', '_options'], this._options);
        this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
        if (!this.data)
            return;
        let data = this.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        let dataList;
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        this._data = this.parseData(GTSLib.flatDeep(dataList));
        this.LOG.debug(['drawChart', '_data'], this._data);
    }
    getHeaderParam(i, j, key, def) {
        return this.data['params'] && this.data['params'][i] && this.data['params'][i][key] && this.data['params'][i][key][j]
            ? this.data['params'][i][key][j]
            : this.data['globalParams'] && this.data['globalParams'][key] && this.data['globalParams'][key][j]
                ? this.data['globalParams'][key][j]
                : def;
    }
    parseData(data) {
        const flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((d, i) => {
            let dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v;
            }
            else {
                this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            flatData.push(dataSet);
        });
        this.LOG.debug(['parseData', 'flatData'], flatData);
        return flatData;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewDatagrid, this.debug);
        this.drawChart();
    }
    render() {
        return h("div", { class: "wrapper" }, this._data.map((data) => h("warp-view-paginable", { data: data, options: this._options, debug: this.debug })));
    }
    static get is() { return "warp-view-datagrid"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "_data": {
            "state": true
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "el": {
            "elementRef": true
        },
        "elemsCount": {
            "type": Number,
            "attr": "elems-count"
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "page": {
            "state": true
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */"; }
}

class WarpViewPaginable {
    constructor() {
        this.options = new Param();
        this.elemsCount = 15;
        this.debug = false;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        this._options = {
            timeMode: 'date'
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
        return h("div", { class: "wrapper" }, this._data ?
            h("div", null,
                h("div", { class: "heading", innerHTML: GTSLib.formatLabel(this._data.name) }),
                h("table", null,
                    h("thead", null, this._data.headers.map((headerName) => h("th", null, headerName))),
                    h("tbody", null, this.displayedValues.map((value, index) => h("tr", { class: index % 2 === 0 ? 'odd' : 'even' }, value.map((v, index) => h("td", null, index === 0 ? this.formatDate(v) : v)))))),
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
    static get style() { return ".sc-warp-view-paginable-h   table.sc-warp-view-paginable{width:100%;color:var(--warp-view-font-color,#000)}.sc-warp-view-paginable-h   table.sc-warp-view-paginable   td.sc-warp-view-paginable, .sc-warp-view-paginable-h   table.sc-warp-view-paginable   th.sc-warp-view-paginable{padding:var(--warp-view-datagrid-cell-padding,5px)}.sc-warp-view-paginable-h   table.sc-warp-view-paginable   .odd.sc-warp-view-paginable{background-color:var(--warp-view-datagrid-odd-bg-color,#fff);color:var(--warp-view-datagrid-odd-color,#000)}.sc-warp-view-paginable-h   table.sc-warp-view-paginable   .even.sc-warp-view-paginable{background-color:var(--warp-view-datagrid-even-bg-color,#ddd);color:var(--warp-view-datagrid-even-color,#000)}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable{text-align:center}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable{display:inline-block}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .index.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .next.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .prev.sc-warp-view-paginable{color:var(--warp-view-font-color,#000);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color,#ddd);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color,#fff)}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .index.active.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .next.active.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .prev.active.sc-warp-view-paginable{background-color:var(--warp-view-pagination-active-bg-color,#4caf50);color:var(--warp-view-pagination-active-color,#fff);border:1px solid var(--warp-view-pagination-active-border-color,#4caf50)}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .index.hoverable.sc-warp-view-paginable:hover, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .next.hoverable.sc-warp-view-paginable:hover, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .prev.hoverable.sc-warp-view-paginable:hover{background-color:var(--warp-view-pagination-hover-bg-color,#ddd);color:var(--warp-view-pagination-hover-color,#000);border:1px solid var(--warp-view-pagination-hover-border-color,#ddd)}.sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .index.disabled.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .next.disabled.sc-warp-view-paginable, .sc-warp-view-paginable-h   .center.sc-warp-view-paginable   .pagination.sc-warp-view-paginable   .prev.disabled.sc-warp-view-paginable{cursor:auto;color:var(--warp-view-pagination-disabled-color,#ddd)}.sc-warp-view-paginable-h   .gts-classname.sc-warp-view-paginable{color:var(--gts-classname-font-color,#0074d9)}.sc-warp-view-paginable-h   .gts-labelname.sc-warp-view-paginable{color:var(--gts-labelname-font-color,#19a979)}.sc-warp-view-paginable-h   .gts-attrname.sc-warp-view-paginable{color:var(--gts-labelname-font-color,#ed4a7b)}.sc-warp-view-paginable-h   .gts-separator.sc-warp-view-paginable{color:var(--gts-separator-font-color,#bbb)}.sc-warp-view-paginable-h   .gts-attrvalue.sc-warp-view-paginable, .sc-warp-view-paginable-h   .gts-labelvalue.sc-warp-view-paginable{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}.sc-warp-view-paginable-h   .round.sc-warp-view-paginable{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}.sc-warp-view-paginable-h   ul.sc-warp-view-paginable{list-style:none}"; }
}

export { WarpViewDatagrid, WarpViewPaginable };
