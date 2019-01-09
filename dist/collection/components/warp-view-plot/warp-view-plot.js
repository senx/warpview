import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewPlot {
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
        if (firstdraw) {
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
    static get style() { return "/**style-placeholder:warp-view-plot:**/"; }
}
