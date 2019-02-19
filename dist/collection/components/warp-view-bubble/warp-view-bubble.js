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
import { GTSLib } from '../../utils/gts.lib';
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
import deepEqual from "deep-equal";
export class WarpViewBubble {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.debug = false;
        this._options = {
            gridLineColor: '#8e8e8e',
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.parentWidth = -1;
        this.parentHeight = -1;
    }
    onResize() {
        if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0 || this.el.parentElement.getBoundingClientRect().height !== this.parentHeight) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
                this.parentHeight = this.el.parentElement.getBoundingClientRect().height;
                if (this.el.parentElement.getBoundingClientRect().width > 0) {
                    this.LOG.debug(['onResize'], this.el.parentElement.getBoundingClientRect().width);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }, 150);
        }
    }
    onData(newValue, oldValue) {
        this.LOG.debug(['onData'], newValue, oldValue);
        this.LOG.debug(['onData'], newValue);
        this.drawChart();
    }
    onOptions(newValue, oldValue) {
        this.LOG.debug(['onOptions'], newValue, oldValue);
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['onOptions'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
        if (!this.data)
            return;
        let dataList;
        let gts = this.data;
        if (typeof gts === 'string') {
            gts = JSON.parse(gts);
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            dataList = gts;
        }
        const color = this._options.gridLineColor;
        const options = {
            legend: {
                display: this.showLegend
            },
            layout: {
                padding: {
                    left: 0,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            },
            borderWidth: 1,
            animation: {
                duration: 0,
            },
            scales: {
                xAxes: [{
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
            responsive: this.responsive,
            maintainAspectRatio: false
        };
        const dataSets = this.parseData(dataList);
        this.LOG.debug(['drawChart'], [options, dataSets]);
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(this.canvas, {
            type: 'bubble',
            tooltips: {
                mode: 'x',
                position: 'nearest',
                callbacks: ChartLib.getTooltipCallbacks()
            },
            data: {
                datasets: dataSets
            },
            options: options
        });
        this.onResize();
        setTimeout(() => {
            this._chart.update();
        }, 250);
    }
    parseData(gts) {
        if (!gts)
            return;
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let label = Object.keys(gts[i])[0];
            let data = [];
            let g = gts[i][label];
            if (GTSLib.isArray(g)) {
                g.forEach(d => {
                    data.push({
                        x: d[0],
                        y: d[1],
                        r: d[2],
                    });
                });
            }
            datasets.push({
                data: data,
                label: label,
                backgroundColor: ColorLib.transparentize(ColorLib.getColor(i)),
                borderColor: ColorLib.getColor(i),
                borderWidth: 1
            });
        }
        return datasets;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewBubble, this.debug);
    }
    componentDidLoad() {
        this.drawChart();
        ChartLib.resizeWatchTimer(this.el, this.onResize.bind(this));
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { ref: (el) => this.canvas = el, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-bubble"; }
    static get encapsulation() { return "shadow"; }
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
    static get style() { return "/**style-placeholder:warp-view-bubble:**/"; }
}
