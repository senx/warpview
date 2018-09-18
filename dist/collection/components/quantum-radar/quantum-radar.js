import Chart from 'chart.js';
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
export class QuantumRadar {
    constructor() {
        this.responsive = true;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(QuantumRadar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
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
    parseData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let labels = {};
        if (!gts || gts.length === 0) {
            return;
        }
        else {
            let i = 0;
            gts.forEach(g => {
                Object.keys(g).forEach(label => {
                    const dataSet = {
                        label: label,
                        data: [],
                        backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5),
                        borderColor: ColorLib.getColor(i)
                    };
                    g[label].forEach(val => {
                        const l = Object.keys(val)[0];
                        labels[l] = 0;
                        dataSet.data.push(val[l]);
                    });
                    datasets.push(dataSet);
                    i++;
                });
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], [datasets, Object.keys(labels)]);
        return { datasets: datasets, labels: Object.keys(labels) };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        const data = this.data;
        if (!data)
            return;
        let dataList;
        if (this.data instanceof DataModel) {
            dataList = this.data.data;
        }
        else {
            dataList = this.data;
        }
        let gts = this.parseData(dataList);
        if (!gts) {
            return;
        }
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, {
            type: 'radar',
            legend: { display: this.showLegend },
            data: {
                labels: gts.labels,
                datasets: gts.datasets
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 50,
                        bottom: 0
                    }
                },
                animation: {
                    duration: 0,
                },
                legend: { display: this.showLegend },
                responsive: this.responsive,
                scale: {
                    gridLines: {
                        color: color,
                        zeroLineColor: color
                    },
                    pointLabels: {
                        fontColor: color,
                    },
                    ticks: {
                        fontColor: color,
                        backdropColor: 'transparent'
                    }
                },
                tooltips: {
                    mode: 'index',
                    intersect: true,
                }
            }
        });
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "quantum-radar"; }
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
    static get style() { return "/**style-placeholder:quantum-radar:**/"; }
}
