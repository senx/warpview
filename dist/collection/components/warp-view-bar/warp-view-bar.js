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
import Chart from "chart.js";
import { GTSLib } from "../../utils/gts.lib";
import { ChartLib } from "../../utils/chart-lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
export class WarpViewBar {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewBar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this._mapIndex = {};
    }
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
            this.drawChart();
        }, 250);
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
    buildGraph() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let gts = this.gtsToData(this.data);
        if (!gts) {
            return;
        }
        const color = this._options.gridLineColor;
        const graphOpts = {
            legend: {
                display: this.showLegend
            },
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'index',
                position: 'nearest'
            },
            scales: {
                xAxes: [{
                        type: "time",
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [
                    {
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }
                ]
            },
            responsive: this.responsive
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: gts.ticks,
                datasets: gts.datasets
            },
            options: graphOpts
        });
        this.onResize();
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        if (!this.data)
            return;
        this.buildGraph();
    }
    gtsToData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let ticks = [];
        let pos = 0;
        let dataList;
        if (this.data instanceof DataModel) {
            dataList = gts.data;
        }
        else {
            dataList = gts;
        }
        if (!dataList || dataList.length === 0) {
            return;
        }
        else {
            dataList = GTSLib.flatDeep(dataList);
            let i = 0;
            dataList.forEach(g => {
                let data = [];
                if (g.v) {
                    GTSLib.gtsSort(g);
                    g.v.forEach(d => {
                        ticks.push(Math.floor(parseInt(d[0]) / 1000));
                        data.push(d[d.length - 1]);
                    });
                    let color = ColorLib.getColor(pos);
                    let label = GTSLib.serializeGtsMetadata(g);
                    this._mapIndex[label] = pos;
                    let ds = {
                        label: label,
                        data: data,
                        borderColor: color,
                        borderWidth: 1,
                        backgroundColor: ColorLib.transparentize(color, 0.5)
                    };
                    datasets.push(ds);
                    pos++;
                    i++;
                }
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], datasets);
        return { datasets: datasets, ticks: GTSLib.unique(ticks).sort((a, b) => a > b ? 1 : a === b ? 0 : -1) };
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
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
        "unit": {
            "type": String,
            "attr": "unit"
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
    static get style() { return "/**style-placeholder:warp-view-bar:**/"; }
}
