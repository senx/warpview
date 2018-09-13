import { GTSLib } from '../../utils/gts.lib';
import { DataModel } from "../../model/dataModel";
import { Logger } from "../../utils/logger";
export class QuantumTile {
    constructor() {
        this.LOG = new Logger(QuantumTile);
        this.unit = '';
        this.type = 'line';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
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
    componentDidLoad() {
        this.execute();
    }
    execute() {
        this.loading = true;
        this.warpscript = this.wsElement.textContent;
        this.LOG.debug(['componentDidLoad', 'warpscript'], this.warpscript);
        fetch(this.url, { method: 'POST', body: this.warpscript }).then(response => {
            response.text().then(gtsStr => {
                this.LOG.debug(['componentDidLoad', 'response'], gtsStr);
                let gtsList = JSON.parse(gtsStr);
                let data = new DataModel();
                if (GTSLib.isArray(gtsList) && gtsList.length === 1) {
                    const dataLine = gtsList[0];
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
                    data.data = gtsList;
                    data.globalParams = { type: this.type };
                }
                this.LOG.debug(['componentDidLoad', 'data'], data);
                this.data = data;
                this.options = data.globalParams;
                this.loading = false;
            }, err => {
                this.LOG.error(['componentDidLoad'], err);
                this.loading = false;
            });
        }, err => {
            this.LOG.error(['componentDidLoad'], err);
            this.loading = false;
        });
    }
    render() {
        return h("div", { class: "wrapper", id: "wrapper" },
            h("div", { class: "warpscript" },
                h("slot", null)),
            this.graphs['scatter'].indexOf(this.type) > -1 ?
                h("quantum-scatter", { responsive: this.responsive, unit: this.unit, data: this.data, options: this.options, "show-legend": this.showLegend, chartTitle: this.chartTitle }) : '',
            this.graphs['chart'].indexOf(this.type) > -1 ?
                h("quantum-chart", { type: this.type, responsive: this.responsive, unit: this.unit, data: this.data, options: this.options, "show-legend": this.showLegend, chartTitle: this.chartTitle }) : '',
            this.type == 'bubble' ?
                h("quantum-bubble", { showLegend: this.showLegend, responsive: true, unit: this.unit, data: this.data, options: this.options, chartTitle: this.chartTitle }) : '',
            this.graphs['pie'].indexOf(this.type) > -1 ?
                h("quantum-pie", { responsive: this.responsive, unit: this.unit, data: this.data, options: this.options, showLegend: this.showLegend, chartTitle: this.chartTitle }) : '',
            this.graphs['polar'].indexOf(this.type) > -1 ?
                h("quantum-polar", { responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, chartTitle: this.chartTitle, options: this.options }) : '',
            this.graphs['radar'].indexOf(this.type) > -1 ?
                h("quantum-radar", { responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, chartTitle: this.chartTitle, options: this.options }) : '',
            this.graphs['bar'].indexOf(this.type) > -1 ?
                h("quantum-bar", { responsive: this.responsive, unit: this.unit, data: this.data, showLegend: this.showLegend, chartTitle: this.chartTitle, options: this.options }) : '',
            this.type == 'text' ?
                h("quantum-display", { responsive: this.responsive, unit: this.unit, data: this.data, displayTitle: this.chartTitle, options: this.options }) : '');
    }
    static get is() { return "quantum-tile"; }
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
            "state": true
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
    static get style() { return "/**style-placeholder:quantum-tile:**/"; }
}
