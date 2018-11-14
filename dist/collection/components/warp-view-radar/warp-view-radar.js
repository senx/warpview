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
import Chart from 'chart.js';
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
export class WarpViewRadar {
    constructor() {
        this.responsive = true;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewRadar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
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
    parseData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let labels = {};
        if (!gts || gts.length === 0) {
            return;
        }
        else {
            let i = 0;
            gts.forEach(g => {
                Object.keys(g).forEach(label => {
                    const dataSet = {
                        label: label,
                        data: [],
                        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
                        borderColor: ColorLib.getColor(i)
                    };
                    g[label].forEach(val => {
                        const l = Object.keys(val)[0];
                        labels[l] = 0;
                        dataSet.data.push(val[l]);
                    });
                    datasets.push(dataSet);
                    i++;
                });
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], [datasets, Object.keys(labels)]);
        return { datasets: datasets, labels: Object.keys(labels) };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        let data = this.data;
        if (!data)
            return;
        let dataList;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.parseData(dataList);
        if (!gts) {
            return;
        }
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['gts.data'], gts.datasets);
        if (gts.datasets && gts.datasets.length > 0) {
            this._chart = new Chart(ctx, {
                type: 'radar',
                legend: { display: this.showLegend },
                data: {
                    labels: gts.labels,
                    datasets: gts.datasets
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 50,
                            bottom: 0
                        }
                    },
                    animation: {
                        duration: 0,
                    },
                    legend: { display: this.showLegend },
                    responsive: this.responsive,
                    scale: {
                        gridLines: {
                            color: color,
                            zeroLineColor: color
                        },
                        pointLabels: {
                            fontColor: color,
                        },
                        ticks: {
                            fontColor: color,
                            backdropColor: 'transparent'
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    }
                }
            });
            this.onResize();
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-radar"; }
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
    static get style() { return "/**style-placeholder:warp-view-radar:**/"; }
}
