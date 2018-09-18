import Chart from 'chart.js';
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
export class QuantumScatter {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(QuantumScatter);
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
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let dataList;
        if (this.data instanceof DataModel) {
            dataList = this.data.data;
        }
        else {
            dataList = this.data;
        }
        let gts = this.gtsToScatter(dataList);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        const options = {
            legend: {
                display: this.showLegend
            },
            responsive: this.responsive,
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'x',
                position: 'nearest',
                callbacks: ChartLib.getTooltipCallbacks()
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }]
            },
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart.Scatter(ctx, { data: { datasets: gts }, options: options });
        this.LOG.debug(['gtsToScatter', 'chart'], [gts, options]);
    }
    gtsToScatter(gts) {
        if (!gts) {
            return;
        }
        this.LOG.debug(['gtsToScatter'], gts);
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let g = gts[i];
            let data = [];
            g.v.forEach(d => {
                data.push({ x: d[0] / 1000, y: d[d.length - 1] });
            });
            datasets.push({
                label: GTSLib.serializeGtsMetadata(g),
                data: data,
                pointRadius: 2,
                borderColor: ColorLib.getColor(i),
                backgroundColor: ColorLib.transparentize(ColorLib.getColor(i), 0.5)
            });
        }
        this.LOG.debug(['gtsToScatter', 'datasets'], datasets);
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "quantum-scatter"; }
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
    static get style() { return "/**style-placeholder:quantum-scatter:**/"; }
}
