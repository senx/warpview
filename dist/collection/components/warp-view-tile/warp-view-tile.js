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
import { GTSLib } from '../../utils/gts.lib';
import { DataModel } from "../../model/dataModel";
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewTile {
    constructor() {
        this.LOG = new Logger(WarpViewTile);
        this.unit = '';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = false;
        this.url = '';
        this.warpscript = '';
        this.graphs = {
            'scatter': ['scatter'],
            'chart': ['line', 'spline', 'step', 'area'],
            'pie': ['pie', 'doughnut', 'gauge'],
            'polar': ['polar'],
            'radar': ['radar'],
            'bar': ['bar']
        };
        this.loading = true;
    }
    onOptions(newValue, oldValue) {
        this.LOG.debug(['options'], newValue);
        if (oldValue !== newValue) {
            this.LOG.debug(['options', 'changed'], newValue);
            this.parseGTS();
        }
    }
    resize() {
        this.execute();
    }
    handleKeyDown(ev) {
        if (ev.key === 'r') {
            this.execute();
        }
    }
    componentDidLoad() {
        this.execute();
    }
    parseGTS() {
        let data = new DataModel();
        if (GTSLib.isArray(this.gtsList) && this.gtsList.length === 1) {
            const dataLine = this.gtsList[0];
            if (dataLine.hasOwnProperty('data')) {
                data.data = dataLine.data;
                data.globalParams = dataLine.globalParams || {};
                data.globalParams.type = data.globalParams.type || this.type;
                data.params = dataLine.params;
            }
            else {
                data.data = dataLine;
                data.globalParams = { type: this.type };
            }
        }
        else {
            data.data = this.gtsList;
            data.globalParams = { type: this.type };
        }
        this.LOG.debug(['parseGTS', 'data'], data);
        this.data = data;
        this._options = ChartLib.mergeDeep(this.options || {}, data.globalParams);
        this.LOG.debug(['parseGTS', 'options'], this._options);
        if (this._autoRefresh !== this._options.autoRefresh) {
            this._autoRefresh = this._options.autoRefresh;
            if (this.timer) {
                window.clearInterval(this.timer);
            }
            if (this._autoRefresh && this._autoRefresh > 0) {
                this.timer = window.setInterval(() => this.execute(), this._autoRefresh * 1000);
            }
        }
        this.loading = false;
    }
    execute() {
        this.loading = true;
        this.warpscript = this.wsElement.textContent;
        this.LOG.debug(['execute', 'warpscript'], this.warpscript);
        fetch(this.url, { method: 'POST', body: this.warpscript }).then(response => {
            response.text().then(gtsStr => {
                this.LOG.debug(['execute', 'response'], gtsStr);
                try {
                    this.gtsList = JSON.parse(gtsStr);
                    this.parseGTS();
                }
                catch (e) {
                    this.LOG.error(['execute'], e);
                }
                this.loading = false;
            }, err => {
                this.LOG.error(['execute'], [err, this.url, this.warpscript]);
                this.loading = false;
            });
        }, err => {
            this.LOG.error(['execute'], [err, this.url, this.warpscript]);
            this.loading = false;
        });
    }
    render() {
        return h("div", { class: "wrapper", id: "wrapper" },
            h("div", { class: "warpscript" },
                h("slot", null)),
            this.graphs['scatter'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-scatter", { responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, "show-legend": this.showLegend })))
                :
                    '',
            this.graphs['chart'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-chart", { type: this.type, responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, "show-legend": this.showLegend })))
                :
                    '',
            this.type == 'bubble' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-bubble", { showLegend: this.showLegend, responsive: true, unit: this.unit, data: this.data, options: this._options })))
                : '',
            this.type == 'map' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-map", { responsive: true, data: this.data, options: this._options })))
                : '',
            this.graphs['pie'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-pie", { responsive: this.responsive, data: this.data, options: this._options, showLegend: this.showLegend })))
                : '',
            this.graphs['polar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-polar", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.graphs['radar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-radar", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.graphs['bar'].indexOf(this.type) > -1 ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-bar", { responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.type == 'text' ?
                h("div", null,
                    h("h1", null, this.chartTitle),
                    h("div", { class: "tile" },
                        h("warp-view-display", { responsive: this.responsive, unit: this.unit, data: this.data, options: this._options })))
                : '',
            this.type == 'image' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-image", { responsive: this.responsive, data: this.data, options: this._options })))
                : '',
            this.type == 'plot' ?
                h("div", null,
                    h("h1", null,
                        this.chartTitle,
                        h("small", null, this.unit)),
                    h("div", { class: "tile" },
                        h("warp-view-plot", { responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                : '',
            this.loading ? h("warp-view-spinner", null) : '');
    }
    static get is() { return "warp-view-tile"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "resize": {
            "method": true
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "url": {
            "type": String,
            "attr": "url"
        },
        "wsElement": {
            "elementRef": true
        }
    }; }
    static get listeners() { return [{
            "name": "document:keyup",
            "method": "handleKeyDown"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-tile:**/"; }
}
