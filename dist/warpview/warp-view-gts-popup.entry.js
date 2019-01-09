const h = window.warpview.h;

import { e as DataModel, b as GTSLib, c as Logger, a as ChartLib, d as Param } from './chunk-714499cf.js';
import { a as ColorLib } from './chunk-53a0d97b.js';

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
class WarpViewGtsPopup {
    constructor() {
        this.gtsList = new DataModel();
        this.maxToShow = 5;
        this.hiddenData = [];
        this.debug = false;
        this.displayed = [];
        this.current = 0;
        this._gts = [];
        this.chips = [];
        this.modalOpenned = false;
    }
    onWarpViewModalOpen(e) {
        this.modalOpenned = true;
    }
    onWarpViewModalClose(e) {
        this.modalOpenned = false;
    }
    onKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', ' '].indexOf(e.key) > -1) {
            e.preventDefault();
            return false;
        }
    }
    onKeyUp(ev) {
        this.LOG.debug(['document:keyup'], ev);
        switch (ev.key) {
            case 's':
                ev.preventDefault();
                this.showPopup();
                break;
            case 'ArrowUp':
            case 'j':
                ev.preventDefault();
                this.showPopup();
                this.current = Math.max(0, this.current - 1);
                this.prepareData();
                break;
            case 'ArrowDown':
            case 'k':
                ev.preventDefault();
                this.showPopup();
                this.current = Math.min(this._gts.length - 1, this.current + 1);
                this.prepareData();
                break;
            case ' ':
                if (this.modalOpenned) {
                    ev.preventDefault();
                    this.warpViewSelectedGTS.emit({
                        gts: this.displayed[this.current],
                        selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                    });
                }
                break;
            default:
                return true;
        }
        return false;
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.prepareData();
        this.colorizeChips();
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.prepareData();
        }
    }
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    prepareData() {
        if (this.gtsList) {
            this._gts = GTSLib.flatDeep([this.gtsList.data]);
            this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    colorizeChips() {
        this.chips.map((chip, index) => {
            if (this.hiddenData.indexOf(this.displayed[index].id) === -1) {
                chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this.displayed[index].id)));
                chip.style.setProperty('border-color', ColorLib.getColor(this.displayed[index].id));
            }
            else {
                chip.style.setProperty('background-color', '#eeeeee');
            }
        });
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewGtsPopup, this.debug);
    }
    componentDidLoad() {
        this.prepareData();
    }
    render() {
        return h("warp-view-modal", { modalTitle: "GTS Selector", ref: (el) => {
                this.modal = el;
            } },
            this.current > 0 ? h("div", { class: "up-arrow" }) : '',
            h("ul", null, this._gts.map((gts, index) => gts
                ? this.displayed.find(g => g.id === gts.id)
                    ? h("li", { class: this.current === index ? 'selected' : '' },
                        h("div", { class: "round", ref: (el) => this.chips[index] = el, style: {
                                'background-color': ColorLib.transparentize(ColorLib.getColor(gts.id)),
                                'border-color': ColorLib.getColor(gts.id)
                            } }),
                        h("span", { innerHTML: GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts)) }))
                    : ''
                : '')),
            this.current < this._gts.length - 1 ? h("div", { class: "down-arrow" }) : '');
    }
    static get is() { return "warp-view-gts-popup"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "current": {
            "state": true
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "displayed": {
            "state": true
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list",
            "watchCallbacks": ["onData"]
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "maxToShow": {
            "type": Number,
            "attr": "max-to-show"
        }
    }; }
    static get events() { return [{
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "warpViewModalOpen",
            "method": "onWarpViewModalOpen"
        }, {
            "name": "warpViewModalClose",
            "method": "onWarpViewModalClose"
        }, {
            "name": "document:keydown",
            "method": "onKeyDown"
        }, {
            "name": "document:keyup",
            "method": "onKeyUp"
        }]; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host ul {\n  list-style: none;\n  position: relative; }\n  :host ul li {\n    line-height: 1.5em;\n    padding-left: 10px;\n    margin-right: 20px; }\n    :host ul li.selected {\n      background-color: var(--warpview-popup-selected-bg-color, #ddd); }\n\n:host .down-arrow {\n  position: absolute;\n  bottom: 2px;\n  left: 2px;\n  width: 35px;\n  height: 35px;\n  background-image: var(--warpview-popup-arrow-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));\n  background-position: center center;\n  background-repeat: no-repeat; }\n\n:host .up-arrow {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 35px;\n  height: 35px;\n  background-image: var(--warpview-popup-arrow-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));\n  -webkit-transform: rotate(180deg);\n  -moz-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  -o-transform: rotate(180deg);\n  transform: rotate(180deg);\n  background-repeat: no-repeat;\n  background-position: center center; }\n\n:host .gts-classname {\n  color: var(--gts-classname-font-color, #0074D9); }\n\n:host .gts-labelname {\n  color: var(--gts-labelname-font-color, #19A979); }\n\n:host .gts-attrname {\n  color: var(--gts-labelname-font-color, #ED4A7B); }\n\n:host .gts-separator {\n  color: var(--gts-separator-font-color, #bbbbbb); }\n\n:host .gts-labelvalue {\n  color: var(--gts-labelvalue-font-color, #AAAAAA);\n  font-style: italic; }\n\n:host .gts-attrvalue {\n  color: var(--gts-labelvalue-font-color, #AAAAAA);\n  font-style: italic; }\n\n:host .round {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  border: 2px solid #454545;\n  margin-top: auto;\n  margin-bottom: auto;\n  vertical-align: middle;\n  margin-right: 5px; }"; }
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
class WarpViewPlot {
    constructor() {
        this.width = "";
        this.height = "";
        this.responsive = false;
        this.showLegend = false;
        this.gtsFilter = '';
        this.debug = false;
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
        this.timeClipValue = '';
        this.graphId = 'container-' + ChartLib.guid();
    }
    componentDidLoad() {
        this.line = this.el.shadowRoot.querySelector('div.bar');
        this.main = this.el.shadowRoot.querySelector('div.maincontainer');
        this.chart = this.el.shadowRoot.querySelector('warp-view-chart');
        this.annotation = this.el.shadowRoot.querySelector('warp-view-annotation');
        this.drawCharts(true);
    }
    async getTimeClip() {
        this.LOG.debug(['getTimeClip'], this.warpViewChart.getTimeClip());
        return this.warpViewChart.getTimeClip();
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawCharts();
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawCharts(true);
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawCharts();
        }
    }
    handleKeyUp(ev) {
        this.LOG.debug(['document:keyup'], ev);
        ev.preventDefault();
        if (ev.key === '/') {
            this.modal.open();
            this.filterInput.focus();
            this.filterInput.select();
        }
        if (ev.key === 't') {
            this.warpViewChart.getTimeClip().then(tc => {
                this.timeClipValue = `${Math.round(tc[0]).toString()} ISO8601 ${Math.round(tc[1]).toString()} ISO8601 TIMECLIP`;
                this.LOG.debug(['handleKeyUp', 't'], this.timeClipValue);
                this.timeClip.open();
            });
        }
        return false;
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
        }) && !event.detail.selected) { //if not in toHide and state false, put id in toHide
            this._toHide.push(event.detail.gts.id);
        }
        else {
            if (event.detail.selected) { //if in toHide and state true, remove it from toHide
                this._toHide = this._toHide.filter(i => {
                    return i !== event.detail.gts.id;
                });
            }
        }
        this.LOG.debug(['warpViewSelectedGTS'], this._toHide);
        this._toHide = this._toHide.slice();
        this.drawCharts();
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
    drawCharts(firstdraw = false) {
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
        this.LOG.debug(["PPts"], "firstdraw " + firstdraw);
        if (firstdraw) { //on the first draw, we can set some default options.
            //automatically switch to timestamp mode
            //when the first tick and last tick of all the series are in the interval [-100ms 100ms]
            let tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            let dataList = this._data.data;
            if (dataList) {
                let gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                let timestampMode = true;
                gtsList.forEach(g => {
                    if (g.v.length > 0) { //if gts not empty
                        timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
                        timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
                    }
                });
                if (timestampMode) {
                    this._options.timeMode = "timestamp";
                }
            }
        }
        this.timeClip.close();
        this.modal.close();
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
    }
    applyFilter() {
        this.gtsFilter = this.filterInput.value;
        this.modal.close();
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewPlot, this.debug);
    }
    render() {
        return h("div", null,
            h("warp-view-modal", { modalTitle: "TimeClip", ref: (el) => this.timeClip = el },
                h("pre", null,
                    h("code", { ref: (el) => this.timeClipElement = el, innerHTML: this.timeClipValue }))),
            h("warp-view-modal", { modalTitle: "GTS Filter", ref: (el) => this.modal = el },
                h("label", null, "Enter a regular expression to filter GTS."),
                h("input", { type: "text", ref: (el) => this.filterInput = el, value: this.gtsFilter }),
                h("button", { type: "button", class: this._options.popupButtonValidateClass, onClick: () => this.applyFilter(), innerHTML: this._options.popupButtonValidateLabel || 'Apply' })),
            this._options.showControls
                ? h("div", { class: "inline" },
                    h("warp-view-toggle", { id: "timeSwitch", "text-1": "Date", "text-2": "Timestamp", checked: this._options.timeMode == "timestamp" }),
                    h("warp-view-toggle", { id: "typeSwitch", "text-1": "Line", "text-2": "Step" }),
                    h("warp-view-toggle", { id: "chartSwitch", "text-1": "Hide chart", "text-2": "Display chart", checked: this.showChart }),
                    h("warp-view-toggle", { id: "mapSwitch", "text-1": "Hide map", "text-2": "Display map", checked: this.showMap }))
                : '',
            this._options.showGTSTree
                ? h("warp-view-gts-tree", { data: this._data, id: "tree", gtsFilter: this.gtsFilter, debug: this.debug, hiddenData: this._toHide, options: this._options })
                : '',
            this.showChart ? h("div", { class: "main-container", onMouseMove: evt => this.handleMouseMove(evt), onMouseLeave: evt => this.handleMouseOut(evt) },
                h("div", { class: "bar" }),
                h("div", { class: "annotation" },
                    h("warp-view-annotation", { data: this._data, responsive: this.responsive, id: "annotation", showLegend: this.showLegend, debug: this.debug, timeMin: this._timeMin, timeMax: this._timeMax, standalone: false, hiddenData: this._toHide, options: this._options })),
                h("div", { style: { width: '100%', height: '768px' }, id: this.graphId },
                    h("warp-view-gts-popup", { maxToShow: 5, hiddenData: this._toHide, gtsList: this._data }),
                    h("warp-view-chart", { id: "chart", responsive: this.responsive, standalone: false, data: this._data, ref: (el) => this.warpViewChart = el, debug: this.debug, hiddenData: this._toHide, type: this.chartType, options: this._options }))) : '',
            this.showMap ? h("div", { class: "map-container" },
                h("warp-view-map", { options: this._options, id: "map", data: this._data, debug: this.debug, responsive: this.responsive, hiddenData: this._toHide })) : '');
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
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "el": {
            "elementRef": true
        },
        "getTimeClip": {
            "method": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "mutable": true,
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
        "timeClipValue": {
            "state": true
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "document:keyup",
            "method": "handleKeyUp"
        }, {
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host {\n  position: relative; }\n  :host .main-container {\n    position: relative; }\n  :host .map-container {\n    height: 768px;\n    width: calc(100% - 25px);\n    margin-top: 20px;\n    margin-right: 20px;\n    position: relative; }\n  :host .bar {\n    width: 1px;\n    left: -100px;\n    position: absolute;\n    background-color: var(--warp-view-bar-color, red);\n    top: 0;\n    bottom: 55px;\n    overflow: hidden;\n    display: none;\n    z-index: 0; }\n  :host .inline {\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -ms-flex-direction: row;\n    flex-direction: row;\n    -ms-flex-wrap: wrap;\n    flex-wrap: wrap;\n    -ms-flex-pack: space-evenly;\n    justify-content: space-evenly;\n    -ms-flex-align: stretch;\n    align-items: stretch;\n    width: 100%; }\n  :host label {\n    display: inline-block; }\n  :host input {\n    display: block;\n    width: calc(100% - 20px);\n    padding: 5px;\n    font-size: 1rem;\n    font-weight: 400;\n    line-height: 1.5; }\n  :host .annotation {\n    max-width: 100%;\n    margin-top: 20px;\n    margin-bottom: 20px; }"; }
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
    onchecked(newValue, oldValue) {
        this.state = newValue;
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
            "attr": "checked",
            "watchCallbacks": ["onchecked"]
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host .switch {\n  position: relative;\n  margin-top: auto;\n  margin-bottom: auto;\n  display: block;\n  width: var(--warp-view-switch-width, 100px);\n  height: var(--warp-view-switch-height, 30px);\n  padding: 3px;\n  border-radius: var(--warp-view-switch-radius, 18px);\n  cursor: pointer; }\n\n:host .switch-input {\n  display: none; }\n\n:host .switch-label {\n  position: relative;\n  display: block;\n  height: inherit;\n  text-transform: uppercase;\n  background: var(--warp-view-switch-inset-color, #eceeef);\n  border-radius: inherit;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15); }\n\n:host .switch-input:checked ~ .switch-label {\n  background: var(--warp-view-switch-inset-checked-color, #00cd00);\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2); }\n\n:host .switch-handle {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  width: calc(var(--warp-view-switch-height, 30px) - 2px);\n  height: calc(var(--warp-view-switch-height, 30px) - 2px);\n  background: var(--warp-view-switch-handle-color, radial-gradient(#FFFFFF 15%, #f0f0f0 100%));\n  border-radius: 100%;\n  -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n:host .switch-input:checked ~ .switch-handle {\n  left: calc(var(--warp-view-switch-width, 100px) - var(--warp-view-switch-height, 30px) + 4px);\n  background: var(--warp-view-switch-handle-checked-color, radial-gradient(#ffffff 15%, #00cd00 100%));\n  -webkit-box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);\n  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2); }\n\n:host .switch-label, :host .switch-handle {\n  -webkit-transition: All .3s ease;\n  transition: All .3s ease;\n  -webkit-transition: All 0.3s ease;\n  -moz-transition: All 0.3s ease;\n  -o-transition: All 0.3s ease; }\n\n:host .container {\n  display: -ms-flexbox;\n  display: flex; }\n\n:host .text {\n  color: var(--warp-view-font-color, #000000);\n  padding: 7px; }"; }
}

export { WarpViewGtsPopup, WarpViewPlot, WarpViewToggle };
