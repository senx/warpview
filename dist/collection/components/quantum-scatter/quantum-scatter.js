import Chart from 'chart.js';
import { GTSLib } from '../../gts.lib';
export class QuantumScatter {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        const me = this;
        new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: {
                legend: { display: this.showLegend },
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
                            type: 'time',
                            time: {
                                min: this.timeMin,
                                max: this.timeMax,
                            }
                        }],
                    yAxes: [{
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            },
                            scaleLabel: {
                                display: true,
                                labelString: this.unit
                            }
                        }]
                },
            }
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
                let color = GTSLib.getColor(i);
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
                    backgroundColor: GTSLib.transparentize(color, 0.5)
                });
            }
        });
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height })));
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
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
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
            "attr": "width"
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
