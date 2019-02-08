import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import { ChartLib } from "../../utils/chart-lib";
import deepEqual from "deep-equal";
import moment from "moment-timezone";
export class WarpViewPlot {
    constructor() {
        this.width = "";
        this.height = "";
        this.responsive = false;
        this.showLegend = false;
        this.gtsFilter = 'x';
        this.debug = false;
        this.isAlone = false;
        this.initialChartHeight = "400";
        this.initialMapHeight = "500";
        this._options = {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this._data = new DataModel();
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.chartType = 'line';
        this.timeClipValue = '';
        this.kbdLastKeyPressed = [];
        this.kbdCounter = 0;
        this.gtsFilterCount = 0;
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
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.drawCharts(true);
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawCharts();
        }
    }
    handleLocalKeydown(ev) {
        if (!this.isAlone) {
            this.handleKeyDown(ev).then(() => {
            });
        }
    }
    handleDocKeydown(ev) {
        if (this.isAlone) {
            this.handleKeyDown(ev).then(() => {
            });
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
                this.timeClipValue = `// keep data between ${moment.tz(tc.msmin, this._options.timeZone).toLocaleString()} and ` +
                    `${moment.tz(tc.msmax, this._options.timeZone).toLocaleString()}<br/>` +
                    `${this._options.timeUnit !== 'us' ? '// (for a ' + this._options.timeUnit + ' platform)<br/>' : ''}` +
                    `${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP`;
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
        this.gtsFilterCount++;
        this.gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.value;
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
                let idListClicked = e.path.map(el => (el.id || '').slice(0, 4));
                if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
                    this.mainPlotDiv.focus();
                }
            }, ref: (el) => this.mainPlotDiv = el },
            h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "TimeClip", ref: (el) => this.timeClip = el },
                h("pre", null,
                    h("code", { ref: (el) => this.timeClipElement = el, innerHTML: this.timeClipValue }))),
            h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "GTS Filter", ref: (el) => this.modal = el },
                h("label", null, "Enter a regular expression to filter GTS."),
                h("input", { tabindex: "1", type: "text", onKeyPress: (e) => this.inputTextKeyboardEvents(e), onKeyDown: (e) => this.inputTextKeyboardEvents(e), onKeyUp: (e) => this.inputTextKeyboardEvents(e), ref: el => this.filterInput = el, value: this.gtsFilter.slice(1) }),
                h("button", { tabindex: "2", type: "button", class: this._options.popupButtonValidateClass, onClick: () => this.applyFilter(), innerHTML: this._options.popupButtonValidateLabel || 'Apply' })),
            this._options.showControls ?
                h("div", { class: "inline" },
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
            this.showChart ?
                h("div", { class: "main-container", onMouseMove: evt => this.handleMouseMove(evt), onMouseLeave: evt => this.handleMouseOut(evt), ref: el => this.main = el },
                    h("div", { class: "bar", ref: el => this.line = el }),
                    h("div", { class: "annotation" },
                        h("warp-view-annotation", { data: this._data, responsive: this.responsive, id: "annotation", showLegend: this.showLegend, ref: (el) => this.annotation = el, debug: this.debug, timeMin: this._timeMin, timeMax: this._timeMax, standalone: false, hiddenData: this._toHide, options: this._options })),
                    h("warp-view-resize", { minHeight: "100", initialHeight: this.initialChartHeight },
                        h("warp-view-gts-popup", { maxToShow: 5, hiddenData: this._toHide, gtsList: this._data, kbdLastKeyPressed: this.kbdLastKeyPressed, ref: (el) => this.gtsPopupModal = el }),
                        h("warp-view-chart", { id: "chart", responsive: this.responsive, standalone: false, data: this._data, ref: (el) => this.chart = el, debug: this.debug, hiddenData: this._toHide, type: this.chartType, options: this._options })))
                : '',
            this.showMap ?
                h("warp-view-resize", { minHeight: "100", initialHeight: this.initialMapHeight },
                    h("div", { class: "map-container" },
                        h("warp-view-map", { options: this._options, ref: (el) => this.map = el, data: this._data, debug: this.debug, responsive: this.responsive, hiddenData: this._toHide })))
                : '',
            h("div", { id: "bottomPlaceHolder" }));
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
        "initialChartHeight": {
            "type": String,
            "attr": "initial-chart-height"
        },
        "initialMapHeight": {
            "type": String,
            "attr": "initial-map-height"
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
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS"
        }, {
            "name": "warpViewModalClose",
            "method": "onWarpViewModalClose"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-plot:**/"; }
}
