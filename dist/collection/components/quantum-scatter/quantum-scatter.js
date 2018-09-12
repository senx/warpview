import Chart from 'chart.js';
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
export class QuantumScatter {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = '{}';
        this.width = '';
        this.height = '';
        this.theme = 'light';
        this.standalone = true;
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    onTheme(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        this._options = JSON.parse(this.options);
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const me = this;
        const color = this._options.gridLineColor || ChartLib.getGridColor(this.theme);
        const options = {
            legend: {
                display: this.showLegend
            },
            responsive: this.responsive,
            tooltips: {
                mode: 'x',
                position: 'nearest',
                custom: function (tooltip) {
                    if (tooltip.opacity > 0) {
                        me.pointHover.emit({ x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y });
                    }
                    else {
                        me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                    }
                    return;
                },
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        type: 'time',
                        time: {
                            min: this.timeMin,
                            max: this.timeMax,
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
        if (!this.standalone) {
            options.scales.yAxes[0].afterFit = (scaleInstance) => {
                scaleInstance.width = 100; // sets the width to 100px
            };
        }
        new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: options
        });
    }
    gtsToScatter(gts) {
        let datasets = [];
        gts.forEach(d => {
            for (let i = 0; i < d.gts.length; i++) {
                let g = d.gts[i];
                let data = [];
                g.v.forEach(d => {
                    data.push({ x: d[0] / 1000, y: d[d.length - 1] });
                });
                let color = ColorLib.getColor(i);
                if (d.params && d.params[i] && d.params[i].color) {
                    color = d.params[i].color;
                }
                let label = `${g.c} - ${JSON.stringify(g.l)}`;
                if (d.params && d.params[i] && d.params[i].key) {
                    label = d.params[i].key;
                }
                datasets.push({
                    label: label,
                    data: data,
                    pointRadius: 2,
                    borderColor: color,
                    backgroundColor: ColorLib.transparentize(color, 0.5)
                });
            }
        });
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", { class: this.theme },
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-scatter"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
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
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "theme": {
            "type": String,
            "attr": "theme",
            "watchCallbacks": ["onTheme"]
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
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
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-scatter:**/"; }
}
