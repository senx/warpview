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
import { Logger } from "../../utils/logger";
import Chart from 'chart.js';
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
export class WarpViewPie {
    constructor() {
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.responsive = false;
        this.LOG = new Logger(WarpViewPie);
        this._options = {
            type: 'pie'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
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
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    parseData(data) {
        this.LOG.debug(['parseData'], data);
        if (!data) {
            return;
        }
        let labels = [];
        let _data = [];
        let dataList;
        if (this.data instanceof DataModel) {
            dataList = this.data.data;
        }
        else {
            dataList = this.data;
        }
        dataList.forEach(d => {
            _data.push(d[1]);
            labels.push(d[0]);
        });
        this.LOG.debug(['parseData'], [labels, _data]);
        return { labels: labels, data: _data };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector("#" + this.uuid);
        let data = this.parseData(this.data);
        if (!data) {
            return;
        }
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        this.LOG.debug(['drawChart'], [this.data, this._options, data]);
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['data.data'], data.data);
        if (data.data && data.data.length > 0) {
            this._options.type = this.options.type || this._options.type;
            this._chart = new Chart(ctx, {
                type: this._options.type === 'gauge' ? 'doughnut' : this._options.type,
                data: {
                    datasets: [{
                            data: data.data,
                            backgroundColor: ColorLib.generateTransparentColors(data.data.length),
                            borderColor: ColorLib.generateColors(data.data.length)
                        }],
                    labels: data.labels
                },
                options: {
                    legend: {
                        display: this.showLegend
                    },
                    animation: {
                        duration: 0,
                    },
                    responsive: this.responsive,
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    },
                    circumference: this.getCirc(),
                    rotation: this.getRotation(),
                }
            });
            this.onResize();
        }
    }
    getRotation() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return -0.5 * Math.PI;
        }
    }
    getCirc() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return 2 * Math.PI;
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
    static get is() { return "warp-view-pie"; }
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
    static get style() { return "/**style-placeholder:warp-view-pie:**/"; }
}
