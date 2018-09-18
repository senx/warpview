import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import { ChartLib } from "../../utils/chart-lib";
export class QuantumPlot {
    constructor() {
        this.width = "";
        this.height = "";
        this.responsive = false;
        this.showLegend = false;
        this._options = new Param();
        this._data = new DataModel();
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.LOG = new Logger(QuantumPlot);
    }
    componentDidLoad() {
        this.line = this.el.shadowRoot.querySelector('div.bar');
        this.main = this.el.shadowRoot.querySelector('div.maincontainer');
        this.chart = this.el.shadowRoot.querySelector('quantum-chart');
        this.annotation = this.el.shadowRoot.querySelector('quantum-annotation');
        this.drawCharts();
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
                    this._options = ChartLib.mergeDeep(this._options, { timeMode: "timestamp" });
                }
                else {
                    this._options = ChartLib.mergeDeep(this._options, { timeMode: "date" });
                }
                this.drawCharts();
                break;
            case 'chartSwitch':
                this.showChart = event.detail.state;
                break;
            case 'mapSwitch':
                this.showMap = event.detail.state;
                break;
        }
    }
    boundsDidChange(event) {
        this.LOG.debug(['boundsDidChange'], event.detail);
        this._timeMin = event.detail.bounds.min;
        this._timeMax = event.detail.bounds.max;
    }
    pointHover(event) {
        this.LOG.debug(['pointHover'], event.detail.x);
        this.line.style.left = (event.detail.x - 15) + 'px';
    }
    quantumSelectedGTS(event) {
        this.LOG.debug(['quantumSelectedGTS'], event.detail);
        if (!this._toHide.find(i => {
            return i === event.detail.label;
        }) && !event.detail.selected) {
            this._toHide.push(event.detail.label);
        }
        else {
            this._toHide = this._toHide.filter(i => {
                return i !== event.detail.label;
            });
        }
        this.LOG.debug(['quantumSelectedGTS'], this._toHide);
        this._toHide = this._toHide.slice();
        this.drawCharts();
    }
    drawCharts() {
        this.LOG.debug(['drawCharts'], [this.data, this.options]);
        this._data = GTSLib.getData(this.data);
        if (typeof this.options === 'string') {
            this._options = JSON.parse(this.options);
        }
        else {
            this._options = this.options;
        }
        this.LOG.debug(['drawCharts', 'parsed'], [this._data, this._options]);
    }
    render() {
        return h("div", null,
            h("div", { class: "inline" },
                h("quantum-toggle", { id: "timeSwitch", "text-1": "Date", "text-2": "Timestamp" }),
                h("quantum-toggle", { id: "chartSwitch", "text-1": "Hide chart", "text-2": "Display chart", checked: this.showChart }),
                h("quantum-toggle", { id: "mapSwitch", "text-1": "Hide map", "text-2": "Display map", checked: this.showMap })),
            h("quantum-gts-tree", { data: this._data, id: "tree" }),
            this.showChart ? h("div", { class: "maincontainer" },
                h("div", { class: "bar" }),
                h("quantum-annotation", { data: this._data, responsive: this.responsive, id: "annotation", "show-legend": this.showLegend, timeMin: this._timeMin, timeMax: this._timeMax, hiddenData: this._toHide, options: this._options }),
                h("div", { style: { width: '100%', height: '768px' } },
                    h("quantum-chart", { id: "chart", responsive: this.responsive, standalone: false, data: this._data, hiddenData: this._toHide, options: this._options }))) : '',
            this.showMap ? h("quantum-map", { width: "100%", startZoom: 10, id: "map", data: this._data, heatRadius: 25, heatBlur: 15, heatOpacity: 0.5, heatControls: false }) : '');
    }
    static get is() { return "quantum-plot"; }
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
            "name": "pointHover",
            "method": "pointHover"
        }, {
            "name": "quantumSelectedGTS",
            "method": "quantumSelectedGTS"
        }]; }
    static get style() { return "/**style-placeholder:quantum-plot:**/"; }
}
