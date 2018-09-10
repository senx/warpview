import Chart from 'chart.js';
import { GTSLib } from '../../gts.lib';
export class QuantumBubble {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.standalone = true;
        this.data = '[]';
        this.options = {};
        this.theme = 'light';
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = JSON.parse(this.data);
        if (!data)
            return;
        const me = this;
        const color = this.options.gridLineColor || this.theme === 'light' ? '#FFFFFF' : '#000000';
        const options = {
            legend: {
                display: this.showLegend
            },
            borderWidth: 1,
            animation: {
                duration: 0,
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
                yAxes: [
                    {
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
                    }
                ]
            },
            responsive: this.responsive
        };
        if (!this.standalone) {
            options.scales.yAxes[0].afterFit = (scaleInstance) => {
                scaleInstance.width = 100; // sets the width to 100px
            };
        }
        new Chart(ctx, {
            type: 'bubble',
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
                }
            },
            data: {
                datasets: this.parseData(data)
            },
            options: options
        });
    }
    parseData(gts) {
        if (!gts)
            return;
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let label = Object.keys(gts[i])[0];
            let data = [];
            let g = gts[i][label];
            if (GTSLib.isArray(g)) {
                g.forEach(d => {
                    data.push({
                        x: d[0],
                        y: d[1],
                        r: d[2],
                    });
                });
            }
            datasets.push({
                data: data,
                label: label,
                backgroundColor: GTSLib.transparentize(GTSLib.getColor(i), 0.5),
                borderColor: GTSLib.getColor(i),
                borderWidth: 1
            });
        }
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", { class: this.theme },
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" },
                h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-bubble"; }
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
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "theme": {
            "type": String,
            "attr": "theme"
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
    static get style() { return "/**style-placeholder:quantum-bubble:**/"; }
}
