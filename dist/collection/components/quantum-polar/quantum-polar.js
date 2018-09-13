import Chart from 'chart.js';
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
export class QuantumPolar {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(QuantumPolar);
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
        let labels = [];
        let data = [];
        gts.forEach(d => {
            data.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, data: data };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        if (!this.data)
            return;
        let dataList;
        if (this.data instanceof DataModel) {
            dataList = this.data.data;
        }
        else {
            dataList = this.data;
        }
        let gts = this.parseData(dataList);
        new Chart.PolarArea(ctx, {
            type: 'polar',
            data: {
                datasets: [{
                        data: gts.data,
                        backgroundColor: ColorLib.generateTransparentColors(gts.data.length),
                        borderColor: ColorLib.generateColors(gts.data.length),
                        label: this.chartTitle
                    }],
                labels: gts.labels
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
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [
                    {
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }
                ],
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
            h("h1", null,
                this.chartTitle,
                h("small", null, this.unit)),
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "quantum-polar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
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
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-polar:**/"; }
}
