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
import { ChartLib } from "../../utils/chart-lib";
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import moment from "moment";
/**
 *
 */
export class WarpViewSpectrumParam {
    constructor() {
        this.range = 'd';
        this.granularity = '10 m';
        this.scale = 24;
    }
    static get is() { return "warp-view-spectrum"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
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
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-spectrum:**/"; }
}
export class WarpViewSpectrum {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.uuid = 'spectrum-' + ChartLib.guid().split('-').join('');
        this.LOG = new Logger(WarpViewSpectrum);
        this._options = {
            gridLineColor: '#8e8e8e',
            spectrum: new WarpViewSpectrumParam()
        };
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
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
        this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
        /*
            if(!this._chart) {
              this._chart = new HeatMap({
                yAxis: { labels: this.formatAxis(dataList), isInversed: true },
                xAxis: {
                  increment: 1,
                  interval: this._options.spectrum.interval,
                  minimum: 0,
                  maximum: (this._options.spectrum.scale - 1) * this._options.spectrum.interval,
                  labels: WarpViewSpectrum.buildLabels()
                },
                renderingMode: 'Canvas',
                dataSource: dataList,
                paletteSettings: {
                  emptyPointColor: 'transparent',
                  palette: [
                    { color: 'rgb(255,0,255)' },
                    { color: 'rgb(0,0,255)' },
                    { color: 'rgb(0,255,0)' },
                    { color: 'rgb(255,255,0)' },
                    { color: 'rgb(255,0,0)' },
                  ],
                  type: 'Gradient'
                },
                legendSettings: {
                  visible: true,
                  position: 'Bottom',
                  width: '75%',
                  enableSmartLegend: true
                },
                showTooltip: false,
                cellSettings: {
                  border: {
                    width: 0
                  },
                  showLabel: false,
                },
              });
    
              this._chart.appendTo(ctx);
            } else {
              this._chart.dataSource =dataList;
            }
        */
    }
    static buildLabels() {
        const r = [];
        for (let i = 0; i < 24 * 6; i++) {
            const j = i / 6;
            if (j - Math.floor(j) === 0) {
                if (j < 10) {
                    r.push('0' + j + ':00');
                }
                else {
                    r.push(j + ':00');
                }
            }
            else {
                r.push('');
            }
        }
        return r;
    }
    formatAxis(labels) {
        const formatedLabels = [];
        labels.forEach(timestamp => {
            const ts = Math.floor(parseInt(timestamp) / 1000);
            formatedLabels.push(moment.utc(ts).format("D MMM YYYY"));
        });
        return formatedLabels;
    }
    parseData(dataList) {
        const details = [];
        let values = [];
        const dates = [];
        const data = {};
        const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue);
        this.LOG.debug(['parseData'], dataList);
        dataList.forEach(gts => {
            const name = GTSLib.serializeGtsMetadata(gts);
            gts.v.forEach(v => {
                const refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
                if (!data[refDate]) {
                    data[refDate] = [];
                }
                if (!values[refDate]) {
                    values[refDate] = [];
                }
                dates.push(v[0] / 1000);
                values[refDate].push(v[v.length - 1]);
                data[refDate].push({
                    name: name,
                    date: v[0] / 1000,
                    value: v[v.length - 1]
                });
            });
        });
        Object.keys(data).forEach((d) => {
            details.push({
                date: moment.utc(d),
                total: values[d].reduce(reducer),
                details: data[d],
                summary: []
            });
        });
        return details;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", { class: "wrapper" },
            h("calendar-heatmap", { data: this.heatMapData, overview: 'global' }));
    }
    static get is() { return "warp-view-spectrum"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
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
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-spectrum:**/"; }
}
