import { GTSLib } from '../../utils/gts.lib';
import { DataModel } from "../../model/dataModel";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import deepEqual from "deep-equal";
export class WarpViewTile {
    constructor() {
        this.unit = '';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = false;
        this.url = '';
        this.gtsFilter = '';
        this.debug = false;
        this.warpScript = '';
        this.execUrl = '';
        this.timeUnit = 'us';
        this.graphs = {
            'scatter': ['scatter'],
            'chart': ['line', 'spline', 'step', 'area'],
            'pie': ['pie', 'doughnut', 'gauge'],
            'polar': ['polar'],
            'radar': ['radar'],
            'bar': ['bar'],
            'annotation': ['annotation'],
            'gts-tree': ['gts-tree']
        };
        this.loading = true;
        this.executionErrorText = '';
        this._options = new Param();
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options', 'changed'], newValue);
            this.parseGTS();
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
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
        this.LOG.debug(['parseGTS', 'options'], [this.options, this._options]);
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
    detectWarpScriptSpecialComments() {
        let warpscriptlines = this.warpScript.split('\n');
        for (let l = 1; l < warpscriptlines.length; l++) {
            let currentline = warpscriptlines[l];
            if (currentline == "" || currentline.search("//") >= 0) {
                let extraparamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
                let lineonMatch;
                let re = RegExp(extraparamsPattern);
                while (lineonMatch = re.exec(currentline)) {
                    let parameterName = lineonMatch[1];
                    let parameterValue = lineonMatch[2];
                    switch (parameterName) {
                        case "endpoint":
                            this.execUrl = parameterValue;
                            break;
                        case "timeUnit":
                            this.timeUnit = parameterValue.toLowerCase();
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                break;
            }
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewTile, this.debug);
    }
    execute() {
        this.loading = true;
        this.warpScript = this.wsElement.textContent;
        this.LOG.debug(['execute', 'warpScript'], this.warpScript);
        this.execUrl = this.url;
        this.detectWarpScriptSpecialComments();
        fetch(this.execUrl, { method: 'POST', body: this.warpScript }).then(response => {
            if (response.status == 200) {
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
                    this.LOG.error(['execute'], [err, this.url, this.warpScript]);
                    this.loading = false;
                });
            }
            else {
                this.executionErrorText = "Execution Error : #" + response.headers.get('X-Warp10-Error-Line') + ' ' + response.headers.get('X-Warp10-Error-Message');
            }
        }, err => {
            this.LOG.error(['execute'], [err, this.url, this.warpScript]);
            this.loading = false;
            this.executionErrorText = "Failed to reach execution endpoint " + this.url;
        });
    }
    render() {
        if (this.executionErrorText != '') {
            return h("div", { class: "executionErrorText" },
                " ",
                this.executionErrorText,
                " ");
        }
        else {
            return h("div", { class: "wrapper", id: "wrapper" },
                h("div", { class: "warpscript" },
                    h("slot", null)),
                this.executionErrorText != '' ? h("div", { class: "executionErrorText" },
                    " ",
                    this.executionErrorText,
                    " ") : '',
                this.graphs['scatter'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null, this.chartTitle),
                        h("div", { class: "tile" },
                            h("warp-view-scatter", { debug: this.debug, responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, showLegend: this.showLegend })))
                    :
                        '',
                this.graphs['chart'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null, this.chartTitle),
                        h("div", { class: "tile" },
                            h("warp-view-chart", { debug: this.debug, type: this.type, responsive: this.responsive, unit: this.unit, data: this.data, options: this._options, "show-legend": this.showLegend })))
                    :
                        '',
                this.type == 'bubble' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-bubble", { debug: this.debug, showLegend: this.showLegend, responsive: true, unit: this.unit, data: this.data, options: this._options })))
                    : '',
                this.type == 'map' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-map", { debug: this.debug, responsive: true, data: this.data, options: this._options })))
                    : '',
                this.graphs['pie'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-pie", { debug: this.debug, responsive: this.responsive, data: this.data, options: this._options, showLegend: this.showLegend })))
                    : '',
                this.graphs['polar'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-polar", { debug: this.debug, responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                    : '',
                this.graphs['radar'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-radar", { debug: this.debug, responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                    : '',
                this.graphs['bar'].indexOf(this.type) > -1 ?
                    h("div", null,
                        h("h1", null, this.chartTitle),
                        h("div", { class: "tile" },
                            h("warp-view-bar", { debug: this.debug, responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, options: this._options })))
                    : '',
                this.type == 'text' ?
                    h("div", null,
                        h("h1", null, this.chartTitle),
                        h("div", { class: "tile" },
                            h("warp-view-display", { debug: this.debug, responsive: this.responsive, unit: this.unit, data: this.data, options: this._options })))
                    : '',
                this.type == 'image' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-image", { debug: this.debug, responsive: this.responsive, data: this.data, options: this._options })))
                    : '',
                this.type == 'plot' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-plot", { debug: this.debug, responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options, gtsFilter: this.gtsFilter })))
                    : '',
                this.type == 'annotation' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-annotation", { debug: this.debug, responsive: this.responsive, data: this.data, showLegend: this.showLegend, options: this._options })))
                    : '',
                this.type == 'gts-tree' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-gts-tree", { debug: this.debug, data: this.data, options: this._options })))
                    : '',
                this.type == 'drilldown' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-drilldown", { debug: this.debug, data: this.data, options: this._options })))
                    : '',
                this.type == 'datagrid' ?
                    h("div", null,
                        h("h1", null,
                            this.chartTitle,
                            h("small", null, this.unit)),
                        h("div", { class: "tile" },
                            h("warp-view-datagrid", { debug: this.debug, data: this.data, options: this._options })))
                    : '',
                this.loading ? h("warp-view-spinner", null) : '');
        }
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
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
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
