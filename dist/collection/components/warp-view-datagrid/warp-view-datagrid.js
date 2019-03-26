import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { GTSLib } from "../../utils/gts.lib";
import deepEqual from "deep-equal";
export class WarpViewDatagrid {
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
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us'
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
    static get style() { return "/**style-placeholder:warp-view-datagrid:**/"; }
}
