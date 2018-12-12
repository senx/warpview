/*! Built with http://stenciljs.com */
const { h } = window.warpview;

import { e as DataModel, c as Param, b as Logger, a as GTSLib, d as ChartLib } from './chunk-a35aff3f.js';

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
class WarpViewPlot {
    constructor() {
        this.width = "";
        this.height = "";
        this.responsive = false;
        this.showLegend = false;
        this.gtsFilter = '';
        this._options = {
            showControls: true,
            showGTSTree: true,
            showDots: true
        };
        this._data = new DataModel();
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.chartType = 'line';
        this.LOG = new Logger(WarpViewPlot);
        this.graphId = 'container-' + ChartLib.guid();
    }
    componentDidLoad() {
        this.line = this.el.shadowRoot.querySelector('div.bar');
        this.main = this.el.shadowRoot.querySelector('div.maincontainer');
        this.chart = this.el.shadowRoot.querySelector('warp-view-chart');
        this.annotation = this.el.shadowRoot.querySelector('warp-view-annotation');
        this.drawCharts();
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawCharts();
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawCharts();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawCharts();
        }
    }
    stateChange(event) {
        this.LOG.debug(['stateChange'], event.detail);
        switch (event.detail.id) {
            case 'timeSwitch':
                if (event.detail.state) {
                    this._options.timeMode = 'timestamp';
                }
                else {
                    this._options.timeMode = 'date';
                }
                this.drawCharts();
                break;
            case 'typeSwitch':
                if (event.detail.state) {
                    this.chartType = 'step';
                }
                else {
                    this.chartType = 'line';
                }
                this.drawCharts();
                break;
            case 'chartSwitch':
                this.showChart = event.detail.state;
                this.drawCharts();
                break;
            case 'mapSwitch':
                this.showMap = event.detail.state;
                if (this.showMap) {
                    window.setTimeout(() => {
                        this.el.shadowRoot.querySelector('#map').resize();
                    }, 500);
                }
                break;
        }
    }
    boundsDidChange(event) {
        this.LOG.debug(['boundsDidChange'], event.detail);
        this._timeMin = event.detail.bounds.min;
        this._timeMax = event.detail.bounds.max;
        this.line.style.left = '-100px';
    }
    handleMouseMove(evt) {
        this.line = this.el.shadowRoot.querySelector('div.bar');
        if (this.mouseOutTimer) {
            window.clearTimeout(this.mouseOutTimer);
            delete this.mouseOutTimer;
        }
        if (!this.mouseOutTimer) {
            this.mouseOutTimer = window.setTimeout(() => {
                this.line.style.display = 'block';
                this.line.style.left = Math.max(evt.offsetX, 100) + 'px';
            }, 1);
        }
    }
    handleMouseOut(evt) {
        this.LOG.debug(['handleMouseOut'], evt);
        this.line.style.left = Math.max(evt.offsetX, 100) + 'px';
        if (this.mouseOutTimer) {
            window.clearTimeout(this.mouseOutTimer);
            delete this.mouseOutTimer;
        }
        if (!this.mouseOutTimer) {
            this.mouseOutTimer = window.setTimeout(() => {
                this.line.style.left = '-100px';
                this.line.style.display = 'none';
            }, 500);
        }
    }
    onResize(event) {
        const div = this.el.shadowRoot.querySelector('#' + this.graphId);
        this.LOG.debug(['warpViewChartResize'], [event.detail, div]);
        if (div) {
            div.style.height = event.detail.h + 'px';
        }
    }
    warpViewSelectedGTS(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event.detail);
        if (!this._toHide.find(i => {
            return i === event.detail.gts.id;
        }) && !event.detail.selected) {
            this._toHide.push(event.detail.gts.id);
        }
        else {
            this._toHide = this._toHide.filter(i => {
                return i !== event.detail.gts.id;
            });
        }
        this.LOG.debug(['warp-viewSelectedGTS'], this._toHide);
        this._toHide = this._toHide.slice();
        this.drawCharts();
    }
    drawCharts() {
        this.LOG.debug(['drawCharts'], [this.data, this.options]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this._data = GTSLib.getData(this.data);
        let opts = new Param();
        if (typeof this.options === 'string') {
            opts = JSON.parse(this.options);
        }
        else {
            opts = this.options;
        }
        this._options = ChartLib.mergeDeep(this._options, opts);
        this.LOG.debug(['drawCharts', 'parsed'], [this._data, this._options]);
    }
    render() {
        return h("div", null,
            this._options.showControls
                ? h("div", { class: "inline" },
                    h("warp-view-toggle", { id: "timeSwitch", "text-1": "Date", "text-2": "Timestamp" }),
                    h("warp-view-toggle", { id: "typeSwitch", "text-1": "Line", "text-2": "Step" }),
                    h("warp-view-toggle", { id: "chartSwitch", "text-1": "Hide chart", "text-2": "Display chart", checked: this.showChart }),
                    h("warp-view-toggle", { id: "mapSwitch", "text-1": "Hide map", "text-2": "Display map", checked: this.showMap }))
                : '',
            this._options.showGTSTree
                ? h("warp-view-gts-tree", { data: this._data, id: "tree", gtsFilter: this.gtsFilter, options: this._options })
                : '',
            this.showChart ? h("div", { class: "maincontainer", onMouseMove: evt => this.handleMouseMove(evt), onMouseLeave: evt => this.handleMouseOut(evt) },
                h("div", { class: "bar" }),
                h("div", { class: "annotation" },
                    h("warp-view-annotation", { data: this._data, responsive: this.responsive, id: "annotation", "show-legend": this.showLegend, timeMin: this._timeMin, timeMax: this._timeMax, standalone: false, hiddenData: this._toHide, options: this._options })),
                h("div", { style: { width: '100%', height: '768px' }, id: this.graphId },
                    h("warp-view-chart", { id: "chart", responsive: this.responsive, standalone: false, data: this._data, hiddenData: this._toHide, type: this.chartType, options: this._options }))) : '',
            this.showMap ? h("div", { style: { width: '100%', height: '768px' } },
                h("warp-view-map", { options: this._options, id: "map", data: this._data, responsive: this.responsive, hiddenData: this._toHide })) : '');
    }
    static get is() { return "warp-view-plot"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "_data": {
            "state": true
        },
        "_options": {
            "state": true
        },
        "_timeMax": {
            "state": true
        },
        "_timeMin": {
            "state": true
        },
        "_toHide": {
            "state": true
        },
        "chartType": {
            "state": true
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
        },
        "options": {
            "type": String,
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showChart": {
            "state": true
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "showMap": {
            "state": true
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "stateChange",
            "method": "stateChange"
        }, {
            "name": "boundsDidChange",
            "method": "boundsDidChange"
        }, {
            "name": "warpViewChartResize",
            "method": "onResize"
        }, {
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS"
        }]; }
    static get style() { return "[data-warp-view-plot-host] {\n  position: relative; }\n  [data-warp-view-plot-host]   .maincontainer[data-warp-view-plot] {\n    position: relative; }\n  [data-warp-view-plot-host]   .bar[data-warp-view-plot] {\n    width: 1px;\n    left: -100px;\n    position: absolute;\n    background-color: var(--warp-view-bar-color, red);\n    top: 0;\n    bottom: 55px;\n    overflow: hidden;\n    display: none;\n    z-index: 0; }\n  [data-warp-view-plot-host]   .inline[data-warp-view-plot] {\n    display: -webkit-inline-box;\n    display: -webkit-inline-flex;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: row;\n    -ms-flex-direction: row;\n    flex-direction: row;\n    -webkit-flex-wrap: wrap;\n    -ms-flex-wrap: wrap;\n    flex-wrap: wrap;\n    -webkit-box-pack: space-evenly;\n    -webkit-justify-content: space-evenly;\n    -ms-flex-pack: space-evenly;\n    justify-content: space-evenly;\n    -webkit-box-align: stretch;\n    -webkit-align-items: stretch;\n    -ms-flex-align: stretch;\n    align-items: stretch;\n    width: 100%; }\n  [data-warp-view-plot-host]   .annotation[data-warp-view-plot] {\n    max-width: 100%; }"; }
}

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
class WarpViewToggle {
    constructor() {
        this.checked = false;
        this.text1 = "";
        this.text2 = "";
        this.state = false;
    }
    componentWillLoad() {
        this.state = this.checked;
    }
    switched() {
        this.state = !this.state;
        this.stateChange.emit({ state: this.state, id: this.el.id });
    }
    render() {
        return h("div", { class: "container" },
            h("div", { class: "text" }, this.text1),
            h("label", { class: "switch" },
                this.state
                    ? h("input", { type: "checkbox", class: "switch-input", checked: true, onClick: () => this.switched() })
                    : h("input", { type: "checkbox", class: "switch-input", onClick: () => this.switched() }),
                h("span", { class: "switch-label" }),
                h("span", { class: "switch-handle" })),
            h("div", { class: "text" }, this.text2));
    }
    static get is() { return "warp-view-toggle"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "checked": {
            "type": Boolean,
            "attr": "checked"
        },
        "el": {
            "elementRef": true
        },
        "state": {
            "state": true
        },
        "text1": {
            "type": String,
            "attr": "text-1"
        },
        "text2": {
            "type": String,
            "attr": "text-2"
        }
    }; }
    static get events() { return [{
            "name": "stateChange",
            "method": "stateChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "[data-warp-view-toggle-host]   .switch[data-warp-view-toggle] {\n  position: relative;\n  margin-top: auto;\n  margin-bottom: auto;\n  display: block;\n  width: var(--warp-view-switch-width, 100px);\n  height: var(--warp-view-switch-height, 30px);\n  padding: 3px;\n  border-radius: var(--warp-view-switch-radius, 18px);\n  cursor: pointer; }\n\n[data-warp-view-toggle-host]   .switch-input[data-warp-view-toggle] {\n  display: none; }\n\n[data-warp-view-toggle-host]   .switch-label[data-warp-view-toggle] {\n  position: relative;\n  display: block;\n  height: inherit;\n  text-transform: uppercase;\n  background: var(--warp-view-switch-inset-color, #eceeef);\n  border-radius: inherit;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15); }\n\n[data-warp-view-toggle-host]   .switch-input[data-warp-view-toggle]:checked    ~ .switch-label[data-warp-view-toggle] {\n  background: var(--warp-view-switch-inset-checked-color, #00cd00);\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2); }\n\n[data-warp-view-toggle-host]   .switch-handle[data-warp-view-toggle] {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: calc(var(--warp-view-switch-height, 30px) - 2px);\n  height: calc(var(--warp-view-switch-height, 30px) - 2px);\n  background: var(--warp-view-switch-handle-color, radial-gradient(#FFFFFF 15%, #f0f0f0 100%));\n  border-radius: 100%;\n  -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n[data-warp-view-toggle-host]   .switch-input[data-warp-view-toggle]:checked    ~ .switch-handle[data-warp-view-toggle] {\n  left: calc(var(--warp-view-switch-width, 100px) - var(--warp-view-switch-height, 30px) + 4px);\n  background: var(--warp-view-switch-handle-checked-color, radial-gradient(#ffffff 15%, #00cd00 100%));\n  -webkit-box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n[data-warp-view-toggle-host]   .switch-label[data-warp-view-toggle], [data-warp-view-toggle-host]   .switch-handle[data-warp-view-toggle] {\n  -webkit-transition: All .3s ease;\n  transition: All .3s ease;\n  -webkit-transition: All 0.3s ease;\n  -moz-transition: All 0.3s ease;\n  -o-transition: All 0.3s ease; }\n\n[data-warp-view-toggle-host]   .container[data-warp-view-toggle] {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n[data-warp-view-toggle-host]   .text[data-warp-view-toggle] {\n  color: var(--warp-view-font-color, #000000);\n  padding: 7px; }"; }
}

export { WarpViewPlot, WarpViewToggle };
