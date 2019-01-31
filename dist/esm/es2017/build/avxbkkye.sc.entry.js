import { h } from '../warpview.core.js';

import { c as DataModel, a as GTSLib, b as Logger } from './chunk-97ee157e.js';
import { b as deepEqual, a as ChartLib, c as Param } from './chunk-d3ecdc47.js';
import { a as moment } from './chunk-8d7a9c7e.js';

class WarpViewGtsPopup {
    constructor() {
        this.gtsList = new DataModel();
        this.maxToShow = 5;
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.displayed = [];
        this.current = 0;
        this._gts = [];
        this.modalOpenned = false;
    }
    onWarpViewModalOpen() {
        this.modalOpenned = true;
    }
    onWarpViewModalClose() {
        this.modalOpenned = false;
    }
    handleKeyDown(key) {
        if (key[0] === 's' && !this.modalOpenned) {
            this.showPopup();
        }
        else if (this.modalOpenned) {
            switch (key[0]) {
                case 'ArrowUp':
                case 'j':
                    this.current = Math.max(0, this.current - 1);
                    this.prepareData();
                    break;
                case 'ArrowDown':
                case 'k':
                    this.current = Math.min(this._gts.length - 1, this.current + 1);
                    this.prepareData();
                    break;
                case ' ':
                    this.warpViewSelectedGTS.emit({
                        gts: this._gts[this.current],
                        selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                    });
                    break;
                default:
                    return true;
            }
        }
    }
    isOpened() {
        return this.modal.isOpened();
    }
    onHideData(newValue, oldValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.prepareData();
    }
    onData(newValue, oldValue) {
        this.LOG.debug(['data'], newValue);
        this.prepareData();
    }
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    prepareData() {
        if (this.gtsList && this.gtsList.data) {
            this._gts = GTSLib.flatDeep([this.gtsList.data]);
            this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewGtsPopup, this.debug);
    }
    componentDidLoad() {
        this.prepareData();
    }
    render() {
        return h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "GTS Selector", ref: (el) => {
                this.modal = el;
            } },
            this.current > 0 ? h("div", { class: "up-arrow" }) : '',
            h("ul", null, this._gts.map((gts, index) => {
                return h("li", { class: this.current == index ? 'selected' : '', style: this.displayed.find(g => g.id === gts.id) ? {} : { 'display': 'none' } },
                    h("warp-view-chip", { node: { gts: gts }, name: gts.c, hiddenData: this.hiddenData }));
            })),
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
        "isOpened": {
            "method": true
        },
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed",
            "watchCallbacks": ["handleKeyDown"]
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
        }]; }
    static get style() { return ".sc-warp-view-gts-popup-h   ul.sc-warp-view-gts-popup{list-style:none;position:relative}.sc-warp-view-gts-popup-h   ul.sc-warp-view-gts-popup   li.sc-warp-view-gts-popup{line-height:1.5em;padding-left:10px;margin-right:20px}.sc-warp-view-gts-popup-h   ul.sc-warp-view-gts-popup   li.selected.sc-warp-view-gts-popup{background-color:var(--warpview-popup-selected-bg-color,#ddd)}.sc-warp-view-gts-popup-h   .down-arrow.sc-warp-view-gts-popup{bottom:2px}.sc-warp-view-gts-popup-h   .down-arrow.sc-warp-view-gts-popup, .sc-warp-view-gts-popup-h   .up-arrow.sc-warp-view-gts-popup{position:absolute;left:2px;width:35px;height:35px;background-image:var(--warpview-popup-arrow-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:50%;background-repeat:no-repeat}.sc-warp-view-gts-popup-h   .up-arrow.sc-warp-view-gts-popup{top:2px;-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);-ms-transform:rotate(180deg);-o-transform:rotate(180deg);transform:rotate(180deg)}.sc-warp-view-gts-popup-h   .gts-classname.sc-warp-view-gts-popup{color:var(--gts-classname-font-color,#0074d9)}.sc-warp-view-gts-popup-h   .gts-labelname.sc-warp-view-gts-popup{color:var(--gts-labelname-font-color,#19a979)}.sc-warp-view-gts-popup-h   .gts-attrname.sc-warp-view-gts-popup{color:var(--gts-labelname-font-color,#ed4a7b)}.sc-warp-view-gts-popup-h   .gts-separator.sc-warp-view-gts-popup{color:var(--gts-separator-font-color,#bbb)}.sc-warp-view-gts-popup-h   .gts-attrvalue.sc-warp-view-gts-popup, .sc-warp-view-gts-popup-h   .gts-labelvalue.sc-warp-view-gts-popup{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}.sc-warp-view-gts-popup-h   .round.sc-warp-view-gts-popup{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;margin-right:5px}"; }
}

class WarpViewPlot {
    constructor() {
        this.width = "";
        this.height = "";
        this.responsive = false;
        this.showLegend = false;
        this.gtsFilter = '';
        this.debug = false;
        this.isAlone = false;
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
        this.kbdLastKeyPressed = [];
        this.kbdCounter = 0;
        this.preventDefaultKeyList = ['Escape', '/'];
        this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
    }
    componentDidLoad() {
        this.drawCharts(true);
    }
    async getTimeClip() {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawCharts();
        }
    }
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['data'], newValue);
            this.drawCharts(true);
        }
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawCharts();
        }
    }
    handleLocalKeydown(ev) {
        if (!this.isAlone) {
            this.handleKeyDown(ev).then(() => { });
        }
    }
    handleDocKeydown(ev) {
        if (this.isAlone) {
            this.handleKeyDown(ev).then(() => { });
        }
    }
    async handleKeyDown(ev) {
        this.LOG.debug(['document:keydown'], ev);
        if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
            ev.preventDefault();
        }
        if (await this.timeClip.isOpened() || await this.modal.isOpened() || await this.gtsPopupModal.isOpened()) {
            if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
                ev.preventDefault();
            }
        }
        if (ev.key === '/') {
            this.modal.open();
            this.filterInput.focus();
            this.filterInput.select();
        }
        else if (ev.key === 't') {
            this.chart.getTimeClip().then(tc => {
                this.timeClipValue = `${Math.round(tc[0]).toString()} ISO8601 ${Math.round(tc[1]).toString()} ISO8601 TIMECLIP`;
                this.LOG.debug(['handleKeyUp', 't'], this.timeClipValue);
                this.timeClip.open();
            });
        }
        else {
            this.pushKbdEvent(ev.key);
        }
    }
    pushKbdEvent(key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
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
                    window.setTimeout(() => this.map.resize(), 500);
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
        this.LOG.debug(['warpViewChartResize'], event.detail);
        if (this.chartContainer) {
            this.chartContainer.style.height = event.detail.h + 'px';
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
            if (event.detail.selected) {
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
        if (this.mouseOutTimer) {
            window.clearTimeout(this.mouseOutTimer);
            delete this.mouseOutTimer;
        }
        if (!this.mouseOutTimer) {
            this.mouseOutTimer = window.setTimeout(() => {
                this.line.style.display = 'block';
                this.line.style.left = Math.max(evt.clientX - this.main.getBoundingClientRect().left, 100) + 'px';
            }, 1);
        }
    }
    handleMouseOut(evt) {
        this.line.style.left = Math.max(evt.clientX - this.main.getBoundingClientRect().left, 100) + 'px';
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
    drawCharts(firstDraw = false) {
        this.LOG.debug(['drawCharts'], [this.data, this.options]);
        this.timeClip.close();
        this.modal.close();
        let options = ChartLib.mergeDeep(this._options, this.options);
        this._data = GTSLib.getData(this.data);
        let opts = new Param();
        if (typeof this.options === 'string') {
            opts = JSON.parse(this.options);
        }
        else {
            opts = this.options;
        }
        options = ChartLib.mergeDeep(options, opts);
        this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
        if (firstDraw) {
            let tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            let dataList = this._data.data;
            if (dataList) {
                let gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                let timestampMode = true;
                gtsList.forEach(g => {
                    if (g.v.length > 0) {
                        timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
                        timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
                    }
                });
                if (timestampMode) {
                    options.timeMode = 'timestamp';
                }
            }
        }
        this._options = Object.assign({}, options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
    }
    applyFilter() {
        this.gtsFilter = this.filterInput.value;
        this.modal.close();
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewPlot, this.debug);
    }
    onWarpViewModalClose() {
        this.mainPlotDiv.focus();
    }
    inputTextKeyboardEvents(e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
        }
    }
    tzSelected() {
        let timeZone = this.tzSelector.value;
        this.LOG.debug(["timezone", "tzselect"], timeZone);
        this._options.timeZone = timeZone;
        this.tzSelector.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawCharts();
    }
    render() {
        return h("div", { id: "focusablePlotDiv", tabindex: "0", onClick: (e) => {
                if (!this.isAlone && e.path[0].nodeName != 'SELECT') {
                    this.mainPlotDiv.focus();
                }
            }, ref: (el) => this.mainPlotDiv = el },
            h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "TimeClip", ref: (el) => this.timeClip = el },
                h("pre", null,
                    h("code", { ref: (el) => this.timeClipElement = el, innerHTML: this.timeClipValue }))),
            h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "GTS Filter", ref: (el) => this.modal = el },
                h("label", null, "Enter a regular expression to filter GTS."),
                h("input", { tabindex: "1", type: "text", onKeyPress: (e) => this.inputTextKeyboardEvents(e), onKeyDown: (e) => this.inputTextKeyboardEvents(e), onKeyUp: (e) => this.inputTextKeyboardEvents(e), ref: el => this.filterInput = el, value: this.gtsFilter }),
                h("button", { tabindex: "2", type: "button", class: this._options.popupButtonValidateClass, onClick: () => this.applyFilter(), innerHTML: this._options.popupButtonValidateLabel || 'Apply' })),
            this._options.showControls
                ? h("div", { class: "inline" },
                    h("warp-view-toggle", { id: "timeSwitch", "text-1": "Date", "text-2": "Timestamp", checked: this._options.timeMode == "timestamp" }),
                    h("warp-view-toggle", { id: "typeSwitch", "text-1": "Line", "text-2": "Step" }),
                    h("warp-view-toggle", { id: "chartSwitch", "text-1": "Hide chart", "text-2": "Display chart", checked: this.showChart }),
                    h("warp-view-toggle", { id: "mapSwitch", "text-1": "Hide map", "text-2": "Display map", checked: this.showMap }),
                    h("div", { class: "tzcontainer" },
                        h("select", { id: "tzSelector", class: "defaulttz", ref: (el) => this.tzSelector = el, onChange: () => this.tzSelected() }, moment.tz.names().map((z) => h("option", { value: z, selected: z === 'UTC', class: z === 'UTC' ? 'defaulttz' : 'customtz' }, z)))))
                : '',
            this._options.showGTSTree
                ? h("warp-view-gts-tree", { data: this._data, id: "tree", gtsFilter: this.gtsFilter, debug: this.debug, hiddenData: this._toHide, options: this._options, kbdLastKeyPressed: this.kbdLastKeyPressed })
                : '',
            this.showChart
                ? h("div", { class: "main-container", onMouseMove: evt => this.handleMouseMove(evt), onMouseLeave: evt => this.handleMouseOut(evt), ref: el => this.main = el },
                    h("div", { class: "bar", ref: el => this.line = el }),
                    h("div", { class: "annotation" },
                        h("warp-view-annotation", { data: this._data, responsive: this.responsive, id: "annotation", showLegend: this.showLegend, ref: (el) => this.annotation = el, debug: this.debug, timeMin: this._timeMin, timeMax: this._timeMax, standalone: false, hiddenData: this._toHide, options: this._options })),
                    h("div", { style: { width: '100%', height: '768px' }, ref: el => this.chartContainer = el },
                        h("warp-view-gts-popup", { maxToShow: 5, hiddenData: this._toHide, gtsList: this._data, kbdLastKeyPressed: this.kbdLastKeyPressed, ref: (el) => this.gtsPopupModal = el }),
                        h("warp-view-chart", { id: "chart", responsive: this.responsive, standalone: false, data: this._data, ref: (el) => this.chart = el, debug: this.debug, hiddenData: this._toHide, type: this.chartType, options: this._options })))
                : '',
            this.showMap
                ? h("div", { class: "map-container" },
                    h("warp-view-map", { options: this._options, ref: (el) => this.map = el, data: this._data, debug: this.debug, responsive: this.responsive, hiddenData: this._toHide }))
                : '');
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
        "isAlone": {
            "type": Boolean,
            "attr": "is-alone"
        },
        "kbdLastKeyPressed": {
            "state": true
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
            "name": "keydown",
            "method": "handleLocalKeydown"
        }, {
            "name": "document:keydown",
            "method": "handleDocKeydown"
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
        }, {
            "name": "warpViewModalClose",
            "method": "onWarpViewModalClose"
        }]; }
    static get style() { return ".sc-warp-view-plot-h, .sc-warp-view-plot-h   .main-container.sc-warp-view-plot{position:relative}.sc-warp-view-plot-h   .map-container.sc-warp-view-plot{height:768px;width:calc(100% - 25px);margin-top:20px;margin-right:20px;position:relative}.sc-warp-view-plot-h   .bar.sc-warp-view-plot{width:1px;left:-100px;position:absolute;background-color:var(--warp-view-bar-color,red);top:0;bottom:55px;overflow:hidden;display:none;z-index:0}.sc-warp-view-plot-h   .inline.sc-warp-view-plot{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:space-evenly;justify-content:space-evenly;-ms-flex-align:stretch;align-items:stretch;width:100%}.sc-warp-view-plot-h   label.sc-warp-view-plot{display:inline-block}.sc-warp-view-plot-h   input.sc-warp-view-plot{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}.sc-warp-view-plot-h   .annotation.sc-warp-view-plot{max-width:100%;margin-top:20px;margin-bottom:20px}.sc-warp-view-plot-h   #focusablePlotDiv.sc-warp-view-plot:focus{outline:none}.sc-warp-view-plot-h   #tzSelector.sc-warp-view-plot{height:var(--warp-view-switch-height,30px);border-radius:var(--warp-view-switch-radius,18px);padding-left:calc(var(--warp-view-switch-radius, 18px) / 2);padding-right:5px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color,#000);border:none;margin:auto}.sc-warp-view-plot-h   .defaulttz.sc-warp-view-plot{background:var(--warp-view-switch-inset-color,#eceeef)}.sc-warp-view-plot-h   .customtz.sc-warp-view-plot{background:var(--warp-view-switch-inset-checked-color,#00cd00)}.sc-warp-view-plot-h   .tzcontainer.sc-warp-view-plot{display:-ms-flexbox;display:flex}"; }
}

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
    onChecked(newValue) {
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
            "watchCallbacks": ["onChecked"]
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
    static get style() { return ".sc-warp-view-toggle-h   .switch.sc-warp-view-toggle{position:relative;margin-top:auto;margin-bottom:auto;display:block;width:var(--warp-view-switch-width,100px);height:var(--warp-view-switch-height,30px);padding:3px;border-radius:var(--warp-view-switch-radius,18px);cursor:pointer}.sc-warp-view-toggle-h   .switch-input.sc-warp-view-toggle{display:none}.sc-warp-view-toggle-h   .switch-label.sc-warp-view-toggle{position:relative;display:block;height:inherit;text-transform:uppercase;background:var(--warp-view-switch-inset-color,#eceeef);border-radius:inherit;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15)}.sc-warp-view-toggle-h   .switch-input.sc-warp-view-toggle:checked ~ .switch-label.sc-warp-view-toggle{background:var(--warp-view-switch-inset-checked-color,#00cd00);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}.sc-warp-view-toggle-h   .switch-handle.sc-warp-view-toggle{position:absolute;top:4px;left:4px;width:calc(var(--warp-view-switch-height, 30px) - 2px);height:calc(var(--warp-view-switch-height, 30px) - 2px);background:var(--warp-view-switch-handle-color,radial-gradient(#fff 15%,#f0f0f0 100%));border-radius:100%;-webkit-box-shadow:1px 1px 5px rgba(0,0,0,.2);box-shadow:1px 1px 5px rgba(0,0,0,.2)}.sc-warp-view-toggle-h   .switch-input.sc-warp-view-toggle:checked ~ .switch-handle.sc-warp-view-toggle{left:calc(var(--warp-view-switch-width, 100px) - var(--warp-view-switch-height, 30px) + 4px);background:var(--warp-view-switch-handle-checked-color,radial-gradient(#fff 15%,#00cd00 100%));-webkit-box-shadow:-1px 1px 5px rgba(0,0,0,.2);box-shadow:-1px 1px 5px rgba(0,0,0,.2)}.sc-warp-view-toggle-h   .switch-handle.sc-warp-view-toggle, .sc-warp-view-toggle-h   .switch-label.sc-warp-view-toggle{transition:All .3s ease;-webkit-transition:All .3s ease;-moz-transition:All .3s ease;-o-transition:All .3s ease}.sc-warp-view-toggle-h   .container.sc-warp-view-toggle{display:-ms-flexbox;display:flex}.sc-warp-view-toggle-h   .text.sc-warp-view-toggle{color:var(--warp-view-font-color,#000);padding:7px}"; }
}

export { WarpViewGtsPopup, WarpViewPlot, WarpViewToggle };
