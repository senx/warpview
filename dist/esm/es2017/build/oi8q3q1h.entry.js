import { h } from '../warpview.core.js';

import { e as Param, c as deepEqual, a as ChartLib, b as GTSLib, f as DataModel, d as Logger } from './chunk-19843615.js';
import { a as require$$0 } from './chunk-cf29acf2.js';

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
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
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
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
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
        return this._options.timeMode === 'date' ? require$$0.utc(date / 1000).toISOString() : date.toString();
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host table{width:100%;color:var(--warp-view-font-color,#000)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding,5px)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color,#fff);color:var(--warp-view-datagrid-odd-color,#000)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color,#ddd);color:var(--warp-view-datagrid-even-color,#000)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color,#000);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color,#ddd);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color,#fff)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color,#4caf50);color:var(--warp-view-pagination-active-color,#fff);border:1px solid var(--warp-view-pagination-active-border-color,#4caf50)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color,#ddd);color:var(--warp-view-pagination-hover-color,#000);border:1px solid var(--warp-view-pagination-hover-border-color,#ddd)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color,#ddd)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-attrvalue,:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"; }
}

export { WarpViewDatagrid, WarpViewPaginable };
